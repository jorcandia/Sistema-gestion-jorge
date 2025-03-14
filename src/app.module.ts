import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppConfig, DatabaseConfig } from "src/config";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthModule } from "src/app/auth/auth.module";
import { RolesModule } from "src/app/roles/roles.module";
import { UsersModule } from "src/app/users/users.module";
import { CashRegistersModule } from "./app/cash_registers/cash_registers.module";
import { SalesModule } from "./app/sales/sales.module";
import { SaleDetailsModule } from "./app/sale_details/sale_details.module";
import { ProductsModule } from "./app/products/products.module";
import { ClientsModule } from "./app/clients/clients.module";
import { CategoriesModule } from "./app/categories/categories.module";
import { ProvidersModule } from "./app/providers/providers.module";
import { PurchasesModule } from "./app/purchases/purchases.module";
import { PurchaseDetailsModule } from './app/purchase_details/purchase_details.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get("database"),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    RolesModule,
    UsersModule,
    CashRegistersModule,
    SalesModule,
    SaleDetailsModule,
    ProductsModule,
    ClientsModule,
    CategoriesModule,
    ProvidersModule,
    PurchasesModule,
    PurchaseDetailsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
