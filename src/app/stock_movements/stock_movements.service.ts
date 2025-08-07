import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateStockMovementDto } from './dto/create-stock_movement.dto'
import { UpdateStockMovementDto } from './dto/update-stock_movement.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { StockMovement } from './entities/stock_movement.entity'
import { DataSource, Repository } from 'typeorm'
import { WarehouseDetailsService } from '../warehouse_details/warehouse_details.service'
import { WarehouseDetail } from '../warehouse_details/entities/warehouse_detail.entity'
import { InjectDataSource } from '@nestjs/typeorm'

@Injectable()
export class StockMovementsService {
    constructor(
        @InjectRepository(StockMovement)
        private stockRepository: Repository<StockMovement>,
        private warehousesDetailService: WarehouseDetailsService,
        private dataSource: DataSource
    ) {}

    async create(createStockMovementDto: CreateStockMovementDto) {
        const stockMovement = this.stockRepository.create(createStockMovementDto)
        return await this.stockRepository.save(stockMovement)
    }

    async findAll() {
        return await this.stockRepository.find()
    }

    async findOne(id: number) {
        const recordFound = await this.stockRepository.findOneBy({ id })
        if (!recordFound) {
            return new HttpException('Stock movement not found', HttpStatus.NOT_FOUND)
        }
        return recordFound
    }

    async update(id: number, updateStockMovementDto: UpdateStockMovementDto) {
        const recordFound = await this.stockRepository.findOneBy({ id })
        if (!recordFound) {
            return new HttpException('Stock movement not found', HttpStatus.NOT_FOUND)
        }
        const updatedRecord = { ...recordFound, ...updateStockMovementDto }
        return this.stockRepository.save(updatedRecord)
    }

    async remove(id: number) {
        const result = await this.stockRepository.softDelete({ id })

        if (result.affected === 0) {
            return new HttpException('Stock movement not found', HttpStatus.NOT_FOUND)
        }
        return result
    }
    async addMovement({ productId, quantity, warehouseId, objectId, objectModel }) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // Intentar encontrar el warehouse_detail existente
            let warehouseDetail = await queryRunner.manager.findOne(WarehouseDetail, {
                where: {
                    productId,
                    warehouseId,
                },
                lock: { mode: 'pessimistic_write' },
            })

            if (!warehouseDetail) {
                try {
                    // Si no existe, crear uno nuevo con la cantidad inicial
                    warehouseDetail = await queryRunner.manager.save(WarehouseDetail, {
                        productId,
                        warehouseId,
                        quantity: quantity, // Para compras, iniciamos con la cantidad que estamos comprando
                    })

                    // Si estamos en una venta y no existe el warehouse_detail, es un error
                    if (quantity < 0) {
                        throw new HttpException(
                            'No existe relación producto-almacén. No se puede procesar la venta.',
                            HttpStatus.BAD_REQUEST
                        )
                    }

                    // Crear el registro de movimiento para la nueva relación
                    const stockMovement = await queryRunner.manager.save(StockMovement, {
                        wareHouseDetailId: warehouseDetail.id,
                        productId,
                        quantity,
                        warehouseId,
                        objectId,
                        objectModel,
                    })

                    await queryRunner.commitTransaction()
                    return stockMovement
                } catch (error) {
                    await queryRunner.rollbackTransaction()
                    throw new HttpException(
                        'Error al crear la relación producto-almacén: ' + error.message,
                        HttpStatus.INTERNAL_SERVER_ERROR
                    )
                }
            } // Para registros existentes: Validar y actualizar cantidad
            const newQuantity = warehouseDetail.quantity + quantity
            if (newQuantity < 0) {
                await queryRunner.rollbackTransaction()
                throw new HttpException('No hay suficiente cantidad en el almacén', HttpStatus.BAD_REQUEST)
            }

            try {
                // Actualizar la cantidad en warehouse_details
                await queryRunner.manager.update(WarehouseDetail, { id: warehouseDetail.id }, { quantity: newQuantity })

                // Crear el registro de movimiento
                const stockMovement = await queryRunner.manager.save(StockMovement, {
                    wareHouseDetailId: warehouseDetail.id,
                    productId,
                    quantity,
                    warehouseId,
                    objectId,
                    objectModel,
                })

                await queryRunner.commitTransaction()
                return stockMovement
            } catch (error) {
                await queryRunner.rollbackTransaction()
                throw new HttpException(
                    'Error al actualizar el stock: ' + error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }
}
