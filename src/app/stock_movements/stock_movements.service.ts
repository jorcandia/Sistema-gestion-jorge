import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateStockMovementDto } from "./dto/create-stock_movement.dto";
import { UpdateStockMovementDto } from "./dto/update-stock_movement.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { StockMovement } from "./entities/stock_movement.entity";
import { Repository } from "typeorm";

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovement)
    private stockRepository: Repository<StockMovement>
  ) {}

  async create(createStockMovementDto: CreateStockMovementDto) {
    const stockMovement = this.stockRepository.create(createStockMovementDto);
    return await this.stockRepository.save(stockMovement);
  }

  async findAll() {
    return await this.stockRepository.find();
  }

  async findOne(id: number) {
    const recordFound = await this.stockRepository.findOneBy({ id });
    if (!recordFound) {
      return new HttpException(
        "Stock movement not found",
        HttpStatus.NOT_FOUND
      );
    }
    return recordFound;
  }

  async update(id: number, updateStockMovementDto: UpdateStockMovementDto) {
    const recordFound = await this.stockRepository.findOneBy({ id });
    if (!recordFound) {
      return new HttpException(
        "Stock movement not found",
        HttpStatus.NOT_FOUND
      );
    }
    const updatedRecord = { ...recordFound, ...updateStockMovementDto };
    return this.stockRepository.save(updatedRecord);
  }

  async remove(id: number) {
    const result = await this.stockRepository.softDelete({ id });

    if (result.affected === 0) {
      return new HttpException(
        "Stock movement not found",
        HttpStatus.NOT_FOUND
      );
    }
    return result;
  }
}
