import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Purchase } from "./entities/purchase.entity";
import { Repository } from "typeorm";

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase) private purchaseRepository: Repository<Purchase>
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const newRecord = this.purchaseRepository.create(createPurchaseDto);
    return await this.purchaseRepository.save(newRecord);
  }

  findAll() {
    return this.purchaseRepository.find();
  }

  async findOne(id: number) {
    const recordFound = await this.purchaseRepository.findOneBy({ id });

    if (!recordFound) {
      throw new HttpException("purchase not found", HttpStatus.NOT_FOUND);
    }
    return recordFound;
  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    const recordFound = await this.purchaseRepository.findOneBy({ id });

    if (!recordFound) {
      throw new HttpException("purchase not found", HttpStatus.NOT_FOUND);
    }
    const updatedRecord = { ...recordFound, ...updatePurchaseDto };
    return this.purchaseRepository.save(updatedRecord);
  }

  async remove(id: number) {
    const result = await this.purchaseRepository.softDelete(id);

    if (result.affected === 0) {
      throw new HttpException("purchase not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
