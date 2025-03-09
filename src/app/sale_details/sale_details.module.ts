import { Module } from "@nestjs/common";
import { SaleDetailsService } from "./sale_details.service";
import { SaleDetailsController } from "./sale_details.controller";
import { SaleDetail } from "./entities/sale_detail.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([SaleDetail])],
  controllers: [SaleDetailsController],
  providers: [SaleDetailsService],
})
export class SaleDetailsModule {}
