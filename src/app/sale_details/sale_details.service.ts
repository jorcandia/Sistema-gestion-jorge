import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateSaleDetailDto } from './dto/create-sale_detail.dto'
import { UpdateSaleDetailDto } from './dto/update-sale_detail.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { SaleDetail } from './entities/sale_detail.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SaleDetailsService {
    constructor(
        @InjectRepository(SaleDetail)
        private saleDatailsRepository: Repository<SaleDetail>
    ) {}
    async create(saleDetail: CreateSaleDetailDto) {
        const newRecord = this.saleDatailsRepository.create(saleDetail)

        return await this.saleDatailsRepository.save(newRecord)
    }

    async findAll() {
        return await this.saleDatailsRepository.find()
    }

    async findOne(id: number) {
        const recordFound = await this.saleDatailsRepository.findOneBy({ id })

        if (!recordFound) {
            throw new HttpException('saleDatails not found', HttpStatus.NOT_FOUND)
        }
        return recordFound
    }

    async findBySaleId(saleId: number) {
        return this.saleDatailsRepository.find({
            where: { saleId },
        })
    }

    async update(id: number, saleDetail: UpdateSaleDetailDto) {
        const recordFound = await this.saleDatailsRepository.findOneBy({ id })

        if (!recordFound) {
            throw new HttpException('saleDatails not found', HttpStatus.NOT_FOUND)
        }
        const newRecord = { ...recordFound, ...saleDetail }
        return this.saleDatailsRepository.save(newRecord)
    }

    async remove(id: number) {
        const result = await this.saleDatailsRepository.delete({ id })

        if (result.affected === 0) {
            throw new HttpException('saleDetail not found', HttpStatus.NOT_FOUND)
        }
        return result
    }
}
