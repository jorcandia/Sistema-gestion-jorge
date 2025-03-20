import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { UpdatePurchaseDto } from './dto/update-purchase.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Purchase } from './entities/purchase.entity'
import { Repository } from 'typeorm'
import { ProductsService } from '../products/products.service'
import { StockMovementsService } from '../stock_movements/stock_movements.service'

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
                    return { ...detail, cost: Number(product.price) }
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
        //return await this.purchaseRepository.save(newRecord);

        const createdRecord = await this.purchaseRepository.save(newRecord)
        console.log(newRecord)
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
    }

    findAll() {
        return this.purchaseRepository.find()
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
