import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Account } from './entities/account.entity'

@Injectable()
export class AccountsService {
    constructor(@InjectRepository(Account) private accountRepository: Repository<Account>) {}
    async create(createAccountDto: CreateAccountDto) {
        const newRecord = this.accountRepository.create(createAccountDto)
        return await this.accountRepository.save(newRecord)
    }

    async findAll() {
        return await this.accountRepository.find()
    }

    async findOne(id: number) {
        const foundRecord = await this.accountRepository.findOne({ where: { id } })
        if (!foundRecord) {
            throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
        }
        return foundRecord
    }

    async update(id: number, updateAccountDto: UpdateAccountDto) {
        const foundRecord = await this.accountRepository.findOne({ where: { id } })
        if (!foundRecord) {
            throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
        }
        const updatedRecord = { ...foundRecord, ...updateAccountDto }
        return this.accountRepository.save(updatedRecord)
    }

    async remove(id: number) {
        const result = await this.accountRepository.softDelete({ id })
        if (result.affected === 0) {
            throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
        }
        return result
    }
}
