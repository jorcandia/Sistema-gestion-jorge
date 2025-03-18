import { Module } from "@nestjs/common";
import { StockMovementsService } from "./stock_movements.service";
import { StockMovementsController } from "./stock_movements.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StockMovement } from "./entities/stock_movement.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement])],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  exports: [StockMovementsService],
})
export class StockMovementsModule {}
