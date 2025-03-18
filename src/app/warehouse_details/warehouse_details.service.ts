import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateWarehouseDetailDto } from "./dto/create-warehouse_detail.dto";
import { UpdateWarehouseDetailDto } from "./dto/update-warehouse_detail.dto";
import { Repository } from "typeorm";
import { WarehouseDetail } from "./entities/warehouse_detail.entity";

@Injectable()
export class WarehouseDetailsService {
  constructor(
    @Inject("WAREHOUSE_DETAILS_REPOSITORY")
    private warehouseDetailsRepository: Repository<WarehouseDetail>
  ) {}
  async create(createWarehouseDetailDto: CreateWarehouseDetailDto) {
    const newRecord = this.warehouseDetailsRepository.create(
      createWarehouseDetailDto
    );
    return await this.warehouseDetailsRepository.save(newRecord);
  }

  async findAll() {
    return await this.warehouseDetailsRepository.find();
  }

  async findOne(id: number) {
    const foundRecord = await this.warehouseDetailsRepository.findOne({
      where: { id },
    });
    if (!foundRecord) {
      throw new HttpException(
        "WareHouseDetail not found",
        HttpStatus.NOT_FOUND
      );
    }
    return foundRecord;
  }

  async update(id: number, updateWarehouseDetailDto: UpdateWarehouseDetailDto) {
    const foundRecord = await this.warehouseDetailsRepository.findOne({
      where: { id },
    });
    if (!foundRecord) {
      throw new HttpException(
        "WareHouseDetail not found",
        HttpStatus.NOT_FOUND
      );
    }
    const updatedRecord = { ...foundRecord, ...updateWarehouseDetailDto };
    return this.warehouseDetailsRepository.save(updatedRecord);
  }

  async remove(id: number) {
    const result = await this.warehouseDetailsRepository.softDelete({ id });
    if (result.affected === 0) {
      throw new HttpException(
        "WareHouseDetail not found",
        HttpStatus.NOT_FOUND
      );
    }
    return result;
  }
}
