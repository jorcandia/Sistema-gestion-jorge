import { PartialType } from "@nestjs/mapped-types";
import { CreateCashRegisterDto } from "./create-cash_register.dto";

export class UpdateCashRegisterDto extends PartialType(CreateCashRegisterDto) {}
