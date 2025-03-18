import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";
import { UpdateWarehouseDto } from "./dto/update-warehouse.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Warehouse } from "./entities/warehouse.entity";
import { Repository } from "typeorm";

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private wareHouseRepository: Repository<Warehouse>
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    const newRecord = this.wareHouseRepository.create(createWarehouseDto);
    return await this.wareHouseRepository.save(newRecord);
  }

  async findAll() {
    return await this.wareHouseRepository.find();
  }

  async findOne(id: number) {
    const foundRecord = await this.wareHouseRepository.findOne({
      where: { id },
    });
    if (!foundRecord) {
      return new HttpException("Warehouse not found", HttpStatus.NOT_FOUND);
    }
    return foundRecord;
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    const foundRecord = await this.wareHouseRepository.findOne({
      where: { id },
    });
    if (!foundRecord) {
      return new HttpException("Warehouse not found", HttpStatus.NOT_FOUND);
    }
    const updatedRecord = { ...foundRecord, ...updateWarehouseDto };
    return this.wareHouseRepository.save(updatedRecord);
  }

  async remove(id: number) {
    const result = await this.wareHouseRepository.softDelete({ id });
    if (result.affected === 0) {
      return new HttpException("Warehouse not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
