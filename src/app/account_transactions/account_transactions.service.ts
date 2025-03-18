import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateAccountTransactionDto } from './dto/create-account_transaction.dto'
import { UpdateAccountTransactionDto } from './dto/update-account_transaction.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountTransaction } from './entities/account_transaction.entity'

@Injectable()
export class AccountTransactionsService {
    constructor(
        @InjectRepository(AccountTransaction) private accountTransactionRepository: Repository<AccountTransaction>
    ) {}
    async create(createAccountTransactionDto: CreateAccountTransactionDto) {
        const newRecord = this.accountTransactionRepository.create(createAccountTransactionDto)
        return await this.accountTransactionRepository.save(newRecord)
    }

    async findAll() {
        return await this.accountTransactionRepository.find()
    }

    async findOne(id: number) {
        const foundRecord = await this.accountTransactionRepository.findOne({ where: { id } })
        if (!foundRecord) {
            throw new HttpException('AccountTransaction not found', HttpStatus.NOT_FOUND)
        }
        return foundRecord
    }

    async update(id: number, updateAccountTransactionDto: UpdateAccountTransactionDto) {
        const foundRecord = await this.accountTransactionRepository.findOne({ where: { id } })
        if (!foundRecord) {
            throw new HttpException('AccountTransaction not found', HttpStatus.NOT_FOUND)
        }
        const updatedRecord = { ...foundRecord, ...updateAccountTransactionDto }
        return this.accountTransactionRepository.save(updatedRecord)
    }

    async remove(id: number) {
        const result = await this.accountTransactionRepository.softDelete({ id })
        if (result.affected === 0) {
            throw new HttpException('AccountTransaction not found', HttpStatus.NOT_FOUND)
        }
        return result
    }
}
