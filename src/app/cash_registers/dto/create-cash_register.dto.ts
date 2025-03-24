import { IsNumber, IsEnum, IsOptional } from "class-validator";
import { CashRegisterStatus } from "../entities/cash_register.entity";

export class CreateCashRegisterDto {

  
  @IsNumber()
  number: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsEnum(CashRegisterStatus)
  status?: CashRegisterStatus;
}
