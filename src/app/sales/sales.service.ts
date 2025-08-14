import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateSaleDto } from './dto/create-sale.dto'
import { UpdateSaleDto } from './dto/update-sale.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Sale } from './entities/sale.entity'
import { And, Between, DataSource, FindOperator, ILike, Repository } from 'typeorm'
import { ProductsService } from '../products/products.service'
import { CreateSaleDetailDto } from '../sale_details/dto/create-sale_detail.dto'
import { SaleDetail } from '../sale_details/entities/sale_detail.entity'
import { Pagination } from 'src/utils/paginate/pagination'
import { GetSalesDto } from './dto/get-sale.dto'
import { Client } from '../clients/entities/client.entity'
import { StockMovementsService } from '../stock_movements/stock_movements.service'
import { CashRegister } from 'src/app/cash_registers/entities/cash_register.entity'
import { CashRegisterStatus } from 'src/app/cash_registers/entities/cash_register.entity'

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale) private saleRepository: Repository<Sale>,
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

            // Agrupar productos por productId y sumar cantidades antes de guardar
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
        const result = await this.saleRepository.delete({ id })

        if (result.affected === 0) {
            throw new HttpException('sale not found', HttpStatus.NOT_FOUND)
        }
        return result
    }
}
