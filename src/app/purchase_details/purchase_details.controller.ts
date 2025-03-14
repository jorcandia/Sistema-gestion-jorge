import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PurchaseDetailsService } from './purchase_details.service';
import { CreatePurchaseDetailDto } from './dto/create-purchase_detail.dto';
import { UpdatePurchaseDetailDto } from './dto/update-purchase_detail.dto';

@Controller('purchase-details')
export class PurchaseDetailsController {
  constructor(private readonly purchaseDetailsService: PurchaseDetailsService) {}

  @Post()
  create(@Body() createPurchaseDetailDto: CreatePurchaseDetailDto) {
    return this.purchaseDetailsService.create(createPurchaseDetailDto);
  }

  @Get()
  findAll() {
    return this.purchaseDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePurchaseDetailDto: UpdatePurchaseDetailDto) {
    return this.purchaseDetailsService.update(+id, updatePurchaseDetailDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseDetailsService.remove(+id);
  }
}
