import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CashRegistersService } from "./cash_registers.service";
import { CreateCashRegisterDto } from "./dto/create-cash_register.dto";
import { UpdateCashRegisterDto } from "./dto/update-cash_register.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../../decorator/roles.decorators";

@Controller("cash_registers")
@UseGuards(JwtAuthGuard)
export class CashRegistersController {
  constructor(private readonly cashRegistersService: CashRegistersService) {}

  @Post()
  create(@Body() createCashRegisterDto: CreateCashRegisterDto) {
    return this.cashRegistersService.create(createCashRegisterDto);
  }

  @Get()
  @Roles("user")
  findAll() {
    return this.cashRegistersService.findAll();
  }

  @Get(":id")
  @Roles("user")
  findOne(@Param("id") id: string) {
    return this.cashRegistersService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCashRegisterDto: UpdateCashRegisterDto
  ) {
    return this.cashRegistersService.update(+id, updateCashRegisterDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cashRegistersService.remove(+id);
  }
}
