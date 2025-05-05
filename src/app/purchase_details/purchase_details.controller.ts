import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common'
import { PurchaseDetailsService } from './purchase_details.service'
import { CreatePurchaseDetailDto } from './dto/create-purchase_detail.dto'
import { UpdatePurchaseDetailDto } from './dto/update-purchase_detail.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from 'src/decorator/roles.decorators'

@Controller('purchase_details')
@UseGuards(JwtAuthGuard)
export class PurchaseDetailsController {
    constructor(private readonly purchaseDetailsService: PurchaseDetailsService) {}

    @Post()
    @Roles('admin', 'warehouse')
    create(@Body() createPurchaseDetailDto: CreatePurchaseDetailDto) {
        return this.purchaseDetailsService.create(createPurchaseDetailDto)
    }

    @Get()
    findAll() {
        return this.purchaseDetailsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.purchaseDetailsService.findOne(+id)
    }

    @Get('purchase/:purchaseId')
    findByPurchaseId(@Param('purchaseId', ParseIntPipe) purchaseId: number) {
        return this.purchaseDetailsService.findByPurchaseId(purchaseId)
    }

    @Patch(':id')
    @Roles('admin', 'warehouse')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePurchaseDetailDto: UpdatePurchaseDetailDto) {
        return this.purchaseDetailsService.update(+id, updatePurchaseDetailDto)
    }

    @Delete(':id')
    @Roles('admin', 'warehouse')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.purchaseDetailsService.remove(+id)
    }
}
