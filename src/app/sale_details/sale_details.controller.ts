import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common'
import { SaleDetailsService } from './sale_details.service'
import { CreateSaleDetailDto } from './dto/create-sale_detail.dto'
import { UpdateSaleDetailDto } from './dto/update-sale_detail.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from 'src/decorator/roles.decorators'

@Controller('sale_details')
@UseGuards(JwtAuthGuard)
export class SaleDetailsController {
    constructor(private readonly saleDetailsService: SaleDetailsService) {}

    @Post()
    @Roles('admin', 'cashier')
    create(@Body() createSaleDetailDto: CreateSaleDetailDto) {
        return this.saleDetailsService.create(createSaleDetailDto)
    }

    @Get()
    findAll() {
        return this.saleDetailsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.saleDetailsService.findOne(+id)
    }

    @Get('sale/:saleId')
    findBySaleId(@Param('saleId', ParseIntPipe) saleId: number) {
        return this.saleDetailsService.findBySaleId(+saleId)
    }

    @Patch(':id')
    @Roles('admin', 'cashier')
    update(@Param('id') id: string, @Body() updateSaleDetailDto: UpdateSaleDetailDto) {
        return this.saleDetailsService.update(+id, updateSaleDetailDto)
    }

    @Delete(':id')
    @Roles('admin', 'cashier')
    remove(@Param('id') id: string) {
        return this.saleDetailsService.remove(+id)
    }
}
