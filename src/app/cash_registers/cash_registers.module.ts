import { Module } from "@nestjs/common";
import { CashRegistersService } from "./cash_registers.service";
import { CashRegistersController } from "./cash_registers.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CashRegister } from "./entities/cash_register.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CashRegister])],
  controllers: [CashRegistersController],
  providers: [CashRegistersService],
})
export class CashRegistersModule {}
