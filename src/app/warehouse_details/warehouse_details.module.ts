import { Module } from "@nestjs/common";
import { WarehouseDetailsService } from "./warehouse_details.service";
import { WarehouseDetailsController } from "./warehouse_details.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehouseDetail } from "./entities/warehouse_detail.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseDetail])],
  controllers: [WarehouseDetailsController],
  providers: [WarehouseDetailsService],
  exports: [WarehouseDetailsService],
})
export class WarehouseDetailsModule {}
