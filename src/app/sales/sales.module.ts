import { Module } from '@nestjs/common'
import { SalesService } from './sales.service'
import { SalesController } from './sales.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Sale } from './entities/sale.entity'
import { SaleDetail } from '../sale_details/entities/sale_detail.entity'
import { ProductsModule } from '../products/products.module'
import { ClientsModule } from '../clients/clients.module'
import { Client } from '../clients/entities/client.entity'
import { StockMovementsModule } from '../stock_movements/stock_movements.module'
import { CashRegistersModule } from '../cash_registers/cash_registers.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Sale, SaleDetail, Client]),
        ProductsModule,
        ClientsModule,
        StockMovementsModule,
        CashRegistersModule,
    ],
    controllers: [SalesController],
    providers: [SalesService],
})
export class SalesModule {}
