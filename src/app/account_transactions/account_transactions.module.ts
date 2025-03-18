import { Module } from '@nestjs/common';
import { AccountTransactionsService } from './account_transactions.service';
import { AccountTransactionsController } from './account_transactions.controller';

@Module({
  controllers: [AccountTransactionsController],
  providers: [AccountTransactionsService]
})
export class AccountTransactionsModule {}
