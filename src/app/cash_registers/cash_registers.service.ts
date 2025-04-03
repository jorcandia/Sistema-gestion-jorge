import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateCashRegisterDto } from './dto/create-cash_register.dto'
import { UpdateCashRegisterDto } from './dto/update-cash_register.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CashRegister, CashRegisterStatus } from './entities/cash_register.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CashRegistersService {
    constructor(
        @InjectRepository(CashRegister)
        private cashRegisterRepository: Repository<CashRegister>
    ) {}

    async create(cashRegister: CreateCashRegisterDto) {
        const newRecord = this.cashRegisterRepository.create(cashRegister)

        return await this.cashRegisterRepository.save(newRecord)
    }

    async findAll() {
        return await this.cashRegisterRepository.find()
    }

    async findOne(id: number) {
        const recordFound = await this.cashRegisterRepository.findOneBy({ id })

        if (!recordFound) {
            throw new HttpException('cashRegister not found', HttpStatus.NOT_FOUND)
        }
        return recordFound
    }

    async update(id: number, cashRegister: UpdateCashRegisterDto) {
        const recordFound = await this.cashRegisterRepository.findOneBy({ id })

        if (!recordFound) {
            throw new HttpException('cashRegister not found', HttpStatus.NOT_FOUND)
        }
        const newRecord = { ...recordFound, ...cashRegister }
        return this.cashRegisterRepository.save(newRecord)
    }

    async remove(id: number) {
        const result = await this.cashRegisterRepository.softDelete(id)

        if (result.affected === 0) {
            throw new HttpException('cashRegister not found', HttpStatus.NOT_FOUND)
        }
        return result
    }

    async open(id: number, user: any): Promise<CashRegister> {
        const cashRegister = await this.cashRegisterRepository.findOneBy({ id })

        if (!cashRegister) {
            throw new HttpException('Cash register not found', HttpStatus.NOT_FOUND)
        }

        if (cashRegister.status === CashRegisterStatus.OPEN) {
            throw new HttpException('The cash register is already open', HttpStatus.FORBIDDEN)
        }

        cashRegister.status = CashRegisterStatus.OPEN
        cashRegister.openedBy = user.id
        await this.cashRegisterRepository.save(cashRegister)

        return cashRegister
    }

    async close(id: number, user: any): Promise<CashRegister> {
        const cashRegister = await this.cashRegisterRepository.findOneBy({ id })

        if (!cashRegister) {
            throw new HttpException('Cash register not found', HttpStatus.NOT_FOUND)
        }

        if (cashRegister.status === CashRegisterStatus.CLOSED) {
            throw new HttpException('The cash register is already closed', HttpStatus.FORBIDDEN)
        }

        if (cashRegister.openedBy !== user.id) {
            throw new HttpException('Only the user who opened the cash register can close it', HttpStatus.FORBIDDEN)
        }

        cashRegister.status = CashRegisterStatus.CLOSED
        cashRegister.openedBy = null
        await this.cashRegisterRepository.save(cashRegister)

        return cashRegister
    }
}
