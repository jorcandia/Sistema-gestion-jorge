import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { UpdatePurchaseDto } from './dto/update-purchase.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Purchase } from './entities/purchase.entity'
import { ProductsService } from '../products/products.service'
import { StockMovementsService } from '../stock_movements/stock_movements.service'
import { GetPurchasesDto } from './dto/get-purchase.dto'
import { Pagination } from 'src/utils/paginate/pagination'
import { And, Between, FindOperator, ILike, Repository } from 'typeorm'

@Injectable()
export class PurchasesService {
    constructor(
        @InjectRepository(Purchase)
        private purchaseRepository: Repository<Purchase>,
        private productService: ProductsService,
        private stockMovementsService: StockMovementsService
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
                relations: ['provider'],
            })
            return new Pagination<Purchase>({ results, total, page, size })
        }

        return this.purchaseRepository.find({
            order: { id: 'DESC' },
            where: findOptions,
            relations: ['provider'],
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
        const result = await this.purchaseRepository.softDelete(id)

        if (result.affected === 0) {
            throw new HttpException('purchase not found', HttpStatus.NOT_FOUND)
        }
        return result
    }
}
