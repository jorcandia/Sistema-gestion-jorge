import { Module } from "@nestjs/common";
import { PurchaseDetailsService } from "./purchase_details.service";
import { PurchaseDetailsController } from "./purchase_details.controller";
import { Type } from "class-transformer";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PurchaseDetail } from "./entities/purchase_detail.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseDetail])],
  controllers: [PurchaseDetailsController],
  providers: [PurchaseDetailsService],
})
export class PurchaseDetailsModule {}
