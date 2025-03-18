import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { AccountTransactionsService } from "./account_transactions.service";
import { CreateAccountTransactionDto } from "./dto/create-account_transaction.dto";
import { UpdateAccountTransactionDto } from "./dto/update-account_transaction.dto";

@Controller("account-transactions")
export class AccountTransactionsController {
  constructor(
    private readonly accountTransactionsService: AccountTransactionsService
  ) {}

  @Post()
  create(@Body() createAccountTransactionDto: CreateAccountTransactionDto) {
    return this.accountTransactionsService.create(createAccountTransactionDto);
  }

  @Get()
  findAll() {
    return this.accountTransactionsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.accountTransactionsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAccountTransactionDto: UpdateAccountTransactionDto
  ) {
    return this.accountTransactionsService.update(
      +id,
      updateAccountTransactionDto
    );
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.accountTransactionsService.remove(+id);
  }
}
