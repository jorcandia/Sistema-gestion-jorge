import { InjectRepository } from '@nestjs/typeorm'
import { Purchase } from './entities/purchase.entity'
import { GetPurchasesDto } from './dto/get-purchase.dto'
import { Pagination } from 'src/utils/paginate/pagination'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { UpdatePurchaseDto } from './dto/update-purchase.dto'
import { ProductsService } from '../products/products.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { StockMovementsService } from '../stock_movements/stock_movements.service'
import { And, Between, DataSource, FindOperator, ILike, Repository } from 'typeorm'
import { PurchaseDetail } from '../purchase_details/entities/purchase_detail.entity'

@Injectable()
export class PurchasesService {
    constructor(
        @InjectRepository(Purchase)
        private purchaseRepository: Repository<Purchase>,
        @InjectRepository(PurchaseDetail)
        private purchaseDetailRepository: Repository<PurchaseDetail>,
        private productService: ProductsService,
        private stockMovementsService: StockMovementsService,
        private dataSource: DataSource
    ) {}

    async create(createPurchaseDto: CreatePurchaseDto, user: any) {
        const details = await Promise.all(
            createPurchaseDto.purchase_details.map(async (detail) => {
                if (detail.cost) {
                    return detail
                } else {
                    const product = await this.productService.findOne(detail.productId)
                    if (!product) {
                        throw new Error(`Producto con ID ${detail.productId} no encontrado`)
                    }
                    return { ...detail, cost: Number(product.cost) }
                }
            })
        )
        const totalAmount = details.reduce(
            (accumulator, currentValue) => accumulator + currentValue.cost * currentValue.quantity,
            0
        )
        const newRecord = this.purchaseRepository.create({
            ...createPurchaseDto,
            purchase_details: details,
            totalAmount,
            userId: user.id,
        })

        const createdRecord = await this.purchaseRepository.save(newRecord)
        await Promise.all(
            newRecord.purchase_details.map((purchase_detail) =>
                this.stockMovementsService.addMovement({
                    productId: purchase_detail.productId,
                    quantity: purchase_detail.quantity,
                    warehouseId: createPurchaseDto.wareHouseId,
                    objectId: createdRecord.id,
                    objectModel: 'Purchase',
                })
            )
        )
        return createdRecord
    }

    async findAll({ page, size, name, startDate, endDate }: GetPurchasesDto) {
        type FindOptions = {
            provider?: { name?: FindOperator<string> }
            createdAt?: FindOperator<Date>
        }
        const findOptions: FindOptions = {}

        if (name) {
            const terms = name.split(' ').map((s) => s.trim())
            findOptions.provider = {
                name: And(...terms.map((t) => ILike(`%${t}%`))),
            }
        }

        if (startDate && endDate) {
            const start = new Date(`${startDate}T00:00:00.000Z`)
            const end = new Date(`${endDate}T23:59:59.999Z`)
            findOptions.createdAt = Between(start, end)
        }

        if (page && size) {
            const [results, total] = await this.purchaseRepository.findAndCount({
                skip: (page - 1) * size,
                take: size,
                order: { id: 'DESC' },
                where: findOptions,
                relations: ['provider', 'warehouse'],
            })
            return new Pagination<Purchase>({ results, total, page, size })
        }

        return this.purchaseRepository.find({
            order: { id: 'DESC' },
            where: findOptions,
            relations: ['provider', 'warehouse'],
        })
    }

    async findOne(id: number) {
        const recordFound = await this.purchaseRepository.findOneBy({ id })

        if (!recordFound) {
            throw new HttpException('purchase not found', HttpStatus.NOT_FOUND)
        }
        return recordFound
    }

    async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
        const recordFound = await this.purchaseRepository.findOneBy({ id })

        if (!recordFound) {
            throw new HttpException('purchase not found', HttpStatus.NOT_FOUND)
        }
        const updatedRecord = { ...recordFound, ...updatePurchaseDto }
        return this.purchaseRepository.save(updatedRecord)
    }

    async remove(id: number) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.startTransaction()

        try {
            const purchase = await this.purchaseRepository.findOne({
                where: { id },
                relations: ['purchase_details'],
            })

            if (!purchase) {
                throw new HttpException('purchase not found', HttpStatus.NOT_FOUND)
            }

            // Verificar si la compra ya está eliminada
            if (purchase.deletedAt) {
                throw new HttpException('purchase is already deleted', HttpStatus.BAD_REQUEST)
            }

            // Descontar movimientos de stock para quitar productos del inventario
            await Promise.all(
                purchase.purchase_details.map((purchase_detail) =>
                    this.stockMovementsService.addMovement({
                        productId: purchase_detail.productId,
                        quantity: -purchase_detail.quantity, // Negativo para descontar
                        warehouseId: purchase.wareHouseId,
                        objectId: purchase.id,
                        objectModel: 'Purchase_Cancelled',
                    })
                )
            )

            // Soft delete de la compra
            const result = await queryRunner.manager.softDelete(Purchase, { id })

            if (result.affected === 0) {
                throw new HttpException('purchase not found', HttpStatus.NOT_FOUND)
            }

            // Soft delete de los detalles de compra en cascada
            await queryRunner.manager.softDelete(PurchaseDetail, { purchaseId: id })

            await queryRunner.commitTransaction()
            return result
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }
}
