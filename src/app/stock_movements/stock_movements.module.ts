import { Module } from '@nestjs/common'
import { StockMovementsService } from './stock_movements.service'
import { StockMovementsController } from './stock_movements.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StockMovement } from './entities/stock_movement.entity'
import { WarehouseDetailsModule } from '../warehouse_details/warehouse_details.module'

@Module({
    imports: [TypeOrmModule.forFeature([StockMovement]), WarehouseDetailsModule],
    controllers: [StockMovementsController],
    providers: [StockMovementsService],
    exports: [StockMovementsService],
})
export class StockMovementsModule {}
