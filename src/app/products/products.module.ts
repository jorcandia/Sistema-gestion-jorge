import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { StockMovementsModule } from '../stock_movements/stock_movements.module'
import { WarehouseDetailsModule } from '../warehouse_details/warehouse_details.module'

@Module({
    imports: [TypeOrmModule.forFeature([Product]), StockMovementsModule, WarehouseDetailsModule],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
