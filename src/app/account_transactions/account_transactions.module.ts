import { Module } from '@nestjs/common'
import { AccountTransactionsService } from './account_transactions.service'
import { AccountTransactionsController } from './account_transactions.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountTransaction } from './entities/account_transaction.entity'

@Module({
    imports: [TypeOrmModule.forFeature([AccountTransaction])],
    controllers: [AccountTransactionsController],
    providers: [AccountTransactionsService],
})
export class AccountTransactionsModule {}
