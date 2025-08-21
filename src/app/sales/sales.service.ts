import { Sale } from './entities/sale.entity'
import { GetSalesDto } from './dto/get-sale.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateSaleDto } from './dto/create-sale.dto'
import { UpdateSaleDto } from './dto/update-sale.dto'
import { Pagination } from 'src/utils/paginate/pagination'
import { Client } from '../clients/entities/client.entity'
import { ProductsService } from '../products/products.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SaleDetail } from '../sale_details/entities/sale_detail.entity'
import { CreateSaleDetailDto } from '../sale_details/dto/create-sale_detail.dto'
import { StockMovementsService } from '../stock_movements/stock_movements.service'
import { CashRegister } from 'src/app/cash_registers/entities/cash_register.entity'
import { And, Between, DataSource, FindOperator, ILike, Repository } from 'typeorm'
import { CashRegisterStatus } from 'src/app/cash_registers/entities/cash_register.entity'

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale) private saleRepository: Repository<Sale>,
        @InjectRepository(SaleDetail) private saleDetailRepository: Repository<SaleDetail>,
        @InjectRepository(CashRegister) private cashRegisterRepository: Repository<CashRegister>,
        private productService: ProductsService,
        private stockMovementsService: StockMovementsService,
        private dataSource: DataSource
    ) {}

    async create(sale: CreateSaleDto, user: any) {
        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.startTransaction()

        try {
            const cashRegister = await this.cashRegisterRepository.findOne({
                where: { id: sale.cashRegisterId },
            })

            if (!cashRegister) {
                throw new HttpException('Cash register not found', HttpStatus.NOT_FOUND)
            }

            if (cashRegister.status === CashRegisterStatus.CLOSED) {
                throw new HttpException('Cannot make a sale, cash register is closed', HttpStatus.PAYMENT_REQUIRED)
            }

            const details = await Promise.all(
                sale.sale_details.map(async (detail: CreateSaleDetailDto) => {
                    if (detail.price) {
                        return detail
                    } else {
                        const product = await this.productService.findOne(detail.productId)
                        if (!product) {
                            throw new Error(`Product with ID ${detail.productId} not found`)
                        }
                        return { ...detail, price: Number(product.price) }
                    }
                })
            )

            const groupedDetails: Record<number, CreateSaleDetailDto> = {}
            for (const detail of details) {
                if (groupedDetails[detail.productId]) {
                    groupedDetails[detail.productId].quantity += detail.quantity
                } else {
                    groupedDetails[detail.productId] = { ...detail }
                }
            }
            const finalDetails = Object.values(groupedDetails)

            const totalAmount = finalDetails.reduce(
                (accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity,
                0
            )

            const newRecord = this.saleRepository.create({
                ...sale,
                sale_details: finalDetails,
                totalAmount,
                userId: user.id,
            })

            const createdRecord = await queryRunner.manager.save(Sale, newRecord)

            await Promise.all(
                newRecord.sale_details.map((sale_detail) =>
                    this.stockMovementsService.addMovement({
                        productId: sale_detail.productId,
                        quantity: -1 * sale_detail.quantity,
                        warehouseId: sale.wareHouseId,
                        objectId: createdRecord.id,
                        objectModel: 'Sale',
                    })
                )
            )

            await queryRunner.commitTransaction()

            return createdRecord
        } catch (error) {
            await queryRunner.rollbackTransaction()

            throw error
        } finally {
            await queryRunner.release()
        }
    }

    async findAll({ size, page, name, startDate, endDate }: GetSalesDto) {
        type FindOptions = {
            client?: { name?: FindOperator<string> }
            createdAt?: FindOperator<Date>
        }
        const findOptions: FindOptions = {}

        if (name) {
            const nameValues: string[] = name.split(' ').map((item) => item.trim())
            findOptions.client = {
                name: And(...nameValues.map((n) => ILike(`%${n}%`))),
            }
        }

        if (startDate && endDate) {
            const start = new Date(`${startDate}T00:00:00.000Z`)
            const end = new Date(`${endDate}T23:59:59.999Z`)
            findOptions.createdAt = Between(start, end)
        }

        if (page && size) {
            const [results, total] = await this.saleRepository.findAndCount({
                skip: (page - 1) * size,
                take: size,
                order: { id: 'DESC' },
                where: findOptions,
                relations: ['client'],
            })

            return new Pagination<Sale>({ results, total, page, size })
        } else {
            return this.saleRepository.find({
                order: { id: 'DESC' },
                where: findOptions,
                relations: ['client'],
            })
        }
    }

    async findOne(id: number) {
        const recordFound = await this.saleRepository.findOne({
            where: { id },
            relations: ['client', 'sale_details', 'sale_details.product', 'sale_details.product.warehouseDetails'],
        })

        if (!recordFound) {
            throw new HttpException('sale not found', HttpStatus.NOT_FOUND)
        }
        return recordFound
    }

    async findDeleted({ size, page, name, startDate, endDate }: GetSalesDto) {
        const queryBuilder = this.saleRepository
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.client', 'client')
            .where('sale.deletedAt IS NOT NULL')
            .orderBy('sale.id', 'DESC')
            .withDeleted()

        if (name) {
            const nameValues: string[] = name.split(' ').map((item) => item.trim())
            nameValues.forEach((nameValue, index) => {
                queryBuilder.andWhere(`client.name ILIKE :name${index}`, {
                    [`name${index}`]: `%${nameValue}%`,
                })
            })
        }

        if (startDate && endDate) {
            const start = new Date(`${startDate}T00:00:00.000Z`)
            const end = new Date(`${endDate}T23:59:59.999Z`)
            queryBuilder.andWhere('sale.createdAt BETWEEN :start AND :end', {
                start,
                end,
            })
        }

        if (page && size) {
            const [results, total] = await queryBuilder
                .skip((page - 1) * size)
                .take(size)
                .getManyAndCount()

            return new Pagination<Sale>({
                results,
                total,
                page,
                size,
            })
        } else {
            const results = await queryBuilder.getMany()
            return results
        }
    }

    async update(id: number, sale: UpdateSaleDto) {
        const recordFound = await this.saleRepository.findOne({
            where: { id },
            relations: ['sale_details'],
        })

        if (!recordFound) {
            throw new HttpException('Sale not found', HttpStatus.NOT_FOUND)
        }

        await this.dataSource.createQueryBuilder().delete().from('sale_details').where('saleId = :id', { id }).execute()
        sale.sale_details?.map((detail) => ({
            ...detail,
            sale: recordFound,
        })) || []

        const newDetails = sale.sale_details?.map((detail) => {
            const saleDetail = new SaleDetail()
            saleDetail.saleId = id
            saleDetail.productId = detail.productId
            saleDetail.quantity = detail.quantity
            saleDetail.price = detail.price || 0
            return saleDetail
        })

        console.log('New Details Created:', newDetails)

        const newRecord = {
            ...recordFound,
            ...sale,
            sale_details: newDetails,
        }

        if (newDetails && newDetails.length > 0) {
            await this.dataSource.createQueryBuilder().insert().into('sale_details').values(newDetails).execute()
        }

        return await this.saleRepository.save(newRecord)
    }

    async remove(id: number) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.startTransaction()

        try {
            const sale = await this.saleRepository.findOne({
                where: { id },
                relations: ['sale_details'],
            })

            if (!sale) {
                throw new HttpException('sale not found', HttpStatus.NOT_FOUND)
            }

            if (sale.deletedAt) {
                throw new HttpException('sale is already deleted', HttpStatus.BAD_REQUEST)
            }

            await Promise.all(
                sale.sale_details.map((sale_detail) =>
                    this.stockMovementsService.addMovement({
                        productId: sale_detail.productId,
                        quantity: sale_detail.quantity,
                        warehouseId: sale.wareHouseId,
                        objectId: sale.id,
                        objectModel: 'Sale_Cancelled',
                    })
                )
            )

            const result = await queryRunner.manager.softDelete(Sale, { id })

            if (result.affected === 0) {
                throw new HttpException('sale not found', HttpStatus.NOT_FOUND)
            }

            await queryRunner.manager.softDelete(SaleDetail, { saleId: id })

            await queryRunner.commitTransaction()
            return result
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }

    async restore(id: number) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.startTransaction()

        try {
            const sale = await this.saleRepository.findOne({
                where: { id },
                relations: ['sale_details'],
                withDeleted: true,
            })

            if (!sale) {
                throw new HttpException('sale not found', HttpStatus.NOT_FOUND)
            }

            if (!sale.deletedAt) {
                throw new HttpException('sale is not deleted', HttpStatus.BAD_REQUEST)
            }

            const deletedDetails = await this.saleDetailRepository.find({
                where: { saleId: id },
                withDeleted: true,
            })

            await queryRunner.manager.restore(Sale, { id })
            await queryRunner.manager.restore(SaleDetail, { saleId: id })

            await Promise.all(
                deletedDetails.map((sale_detail) =>
                    this.stockMovementsService.addMovement({
                        productId: sale_detail.productId,
                        quantity: -sale_detail.quantity,
                        warehouseId: sale.wareHouseId,
                        objectId: sale.id,
                        objectModel: 'Sale_Restored',
                    })
                )
            )

            await queryRunner.commitTransaction()
            return { message: 'Sale restored successfully' }
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }
}
