import { Module } from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { PurchasesController } from './purchases.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Purchase } from './entities/purchase.entity'
import { ProductsModule } from '../products/products.module'
import { StockMovementsModule } from '../stock_movements/stock_movements.module'

@Module({
    imports: [TypeOrmModule.forFeature([Purchase]), ProductsModule, StockMovementsModule],
    controllers: [PurchasesController],
    providers: [PurchasesService],
})
export class PurchasesModule {}
