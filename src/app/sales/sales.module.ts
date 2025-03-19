import { Module } from '@nestjs/common'
import { SalesService } from './sales.service'
import { SalesController } from './sales.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Sale } from './entities/sale.entity'
import { ProductsModule } from '../products/products.module'
import { ClientsModule } from '../clients/clients.module'
import { Client } from '../clients/entities/client.entity'
import { StockMovementsModule } from '../stock_movements/stock_movements.module'

@Module({
    imports: [TypeOrmModule.forFeature([Sale, Client]), ProductsModule, ClientsModule, StockMovementsModule],
    controllers: [SalesController],
    providers: [SalesService],
})
export class SalesModule {}
