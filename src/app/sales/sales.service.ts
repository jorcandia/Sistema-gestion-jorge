import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Sale } from "./entities/sale.entity";
import { Repository } from "typeorm";

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>
  ) {}
  async create(sale: CreateSaleDto) {
    const newRecord = this.saleRepository.create(sale);

    return await this.saleRepository.save(newRecord);
  }

  async findAll() {
    return await this.saleRepository.find();
  }

  async findOne(id: number) {
    const recordFound = await this.saleRepository.findOneBy({ id });

    if (!recordFound) {
      throw new HttpException("sale not found", HttpStatus.NOT_FOUND);
    }
    return recordFound;
  }

  async update(id: number, sale: UpdateSaleDto) {
    const recordFound = await this.saleRepository.findOneBy({ id });

    if (!recordFound) {
      throw new HttpException("sale not found", HttpStatus.NOT_FOUND);
    }
    const newRecord = { ...recordFound, ...sale };
    return this.saleRepository.save(newRecord);
  }

  async remove(id: number) {
    const result = await this.saleRepository.delete({ id });

    if (result.affected === 0) {
      throw new HttpException("sale not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
