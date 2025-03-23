import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateSaleDto } from './dto/create-sale.dto'
import { UpdateSaleDto } from './dto/update-sale.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Sale } from './entities/sale.entity'
import { And, DataSource, FindOperator, ILike, Repository } from 'typeorm'
import { ProductsService } from '../products/products.service'
import { CreateSaleDetailDto } from '../sale_details/dto/create-sale_detail.dto'
import { Pagination } from 'src/utils/paginate/pagination'
import { GetSalesDto } from './dto/get-sale.dto'
import { Client } from '../clients/entities/client.entity'
import { StockMovementsService } from '../stock_movements/stock_movements.service'

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale) private saleRepository: Repository<Sale>,
        private productService: ProductsService,
        private stockMovementsService: StockMovementsService,
        private dataSource: DataSource
    ) {}

    async create(sale: CreateSaleDto, user: any) {
        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.startTransaction()

        try {
            const details = await Promise.all(
                sale.sale_details.map(async (detail: CreateSaleDetailDto) => {
                    if (detail.price) {
                        return detail
                    } else {
                        const product = await this.productService.findOne(detail.productId)
                        if (!product) {
                            throw new Error(`Product con ID ${detail.productId} no encontrado`)
                        }
                        return { ...detail, price: Number(product.price) }
                    }
                })
            )

            const totalAmount = details.reduce(
                (accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity,
                0
            )

            const newRecord = this.saleRepository.create({
                ...sale,
                sale_details: details,
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
            throw new HttpException('Error al crear la venta', HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await queryRunner.release()
        }
    }

    async findAll({ size, page, name }: GetSalesDto) {
        type findOptions = { client?: { name?: FindOperator<string> } }
        const findOptions: findOptions = {}

        const nameValues: string[] = name ? name.split(' ').map((item) => item.trim()) : []
        findOptions.client = {
            name: And(...nameValues.map((n) => ILike(`%${n}%`))),
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
        const recordFound = await this.saleRepository.findOneBy({ id })

        if (!recordFound) {
            throw new HttpException('sale not found', HttpStatus.NOT_FOUND)
        }
        return recordFound
    }

    async update(id: number, sale: UpdateSaleDto) {
        const recordFound = await this.saleRepository.findOneBy({ id })

        if (!recordFound) {
            throw new HttpException('sale not found', HttpStatus.NOT_FOUND)
        }
        const newRecord = { ...recordFound, ...sale }
        return this.saleRepository.save(newRecord)
    }

    async remove(id: number) {
        const result = await this.saleRepository.delete({ id })

        if (result.affected === 0) {
            throw new HttpException('sale not found', HttpStatus.NOT_FOUND)
        }
        return result
    }
}
