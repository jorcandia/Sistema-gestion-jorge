import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePurchaseDetailDto } from "./dto/create-purchase_detail.dto";
import { UpdatePurchaseDetailDto } from "./dto/update-purchase_detail.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PurchaseDetail } from "./entities/purchase_detail.entity";

@Injectable()
export class PurchaseDetailsService {
  constructor(
    @InjectRepository(PurchaseDetail)
    private purchaseDetailsRepository: Repository<PurchaseDetail>
  ) {}
  async create(createPurchaseDetailDto: CreatePurchaseDetailDto) {
    const newRecord = this.purchaseDetailsRepository.create(
      createPurchaseDetailDto
    );

    return await this.purchaseDetailsRepository.save(newRecord);
  }

  async findAll() {
    return await this.purchaseDetailsRepository.find();
  }

  async findOne(id: number) {
    const recordFound = await this.purchaseDetailsRepository.findOneBy({ id });
    if (!recordFound) {
      throw new HttpException(
        "purchaseDetails not found",
        HttpStatus.NOT_FOUND
      );
    }
    return recordFound;
  }

  async update(id: number, updatePurchaseDetailDto: UpdatePurchaseDetailDto) {
    const recordFound = await this.purchaseDetailsRepository.findOneBy({ id });
    if (!recordFound) {
      throw new HttpException(
        "purchaseDetails not found",
        HttpStatus.NOT_FOUND
      );
    }
    const newRecord = { ...recordFound, ...updatePurchaseDetailDto };
    return this.purchaseDetailsRepository.save(newRecord);
  }

  async remove(id: number) {
    const result = await this.purchaseDetailsRepository.delete({ id });
    if (result.affected === 0) {
      throw new HttpException("purchaseDetail not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
