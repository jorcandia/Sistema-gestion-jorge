import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Purchase } from './entities/purchase.entity'
import { PurchasesService } from './purchases.service'
import { PurchasesController } from './purchases.controller'
import { ProductsModule } from '../products/products.module'
import { StockMovementsModule } from '../stock_movements/stock_movements.module'
import { PurchaseDetail } from '../purchase_details/entities/purchase_detail.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Purchase, PurchaseDetail]), ProductsModule, StockMovementsModule],
    controllers: [PurchasesController],
    providers: [PurchasesService],
})
export class PurchasesModule {}
