import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { WarehouseDetailsService } from "./warehouse_details.service";
import { CreateWarehouseDetailDto } from "./dto/create-warehouse_detail.dto";
import { UpdateWarehouseDetailDto } from "./dto/update-warehouse_detail.dto";

@Controller("warehouse-details")
export class WarehouseDetailsController {
  constructor(
    private readonly warehouseDetailsService: WarehouseDetailsService
  ) {}

  @Post()
  create(@Body() createWarehouseDetailDto: CreateWarehouseDetailDto) {
    return this.warehouseDetailsService.create(createWarehouseDetailDto);
  }

  @Get()
  findAll() {
    return this.warehouseDetailsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.warehouseDetailsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateWarehouseDetailDto: UpdateWarehouseDetailDto
  ) {
    return this.warehouseDetailsService.update(+id, updateWarehouseDetailDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.warehouseDetailsService.remove(+id);
  }
}
