import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query, Put } from '@nestjs/common'
import { SalesService } from './sales.service'
import { CreateSaleDto } from './dto/create-sale.dto'
import { UpdateSaleDto } from './dto/update-sale.dto'
import { User } from '../../decorator/user.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from 'src/decorator/roles.decorators'
import { GetSalesDto } from './dto/get-sale.dto'

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    @Post()
    @Roles('admin', 'cashier')
    create(@Body() createSaleDto: CreateSaleDto, @User() user) {
        return this.salesService.create(createSaleDto, user)
    }

    @Get()
    findAll(@Query() getSalesDto: GetSalesDto) {
        return this.salesService.findAll(getSalesDto)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.salesService.findOne(+id)
    }

    @Put(':id')
    @Roles('admin', 'cashier')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSaleDto: UpdateSaleDto) {
        return this.salesService.update(+id, updateSaleDto)
    }

    @Delete(':id')
    @Roles('admin', 'cashier')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.salesService.remove(+id)
    }
}
