import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { UpdatePurchaseDto } from './dto/update-purchase.dto'
import { GetPurchasesDto } from './dto/get-purchase.dto'
import { User } from 'src/decorator/user.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from 'src/decorator/roles.decorators'

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) {}

    @Post()
    @Roles('admin', 'warehouse')
    create(@Body() createPurchaseDto: CreatePurchaseDto, @User() user) {
        return this.purchasesService.create(createPurchaseDto, user)
    }

    @Get()
    findAll(@Query() getPurchasesDto: GetPurchasesDto) {
        return this.purchasesService.findAll(getPurchasesDto)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.purchasesService.findOne(+id)
    }

    @Patch(':id')
    @Roles('admin', 'warehouse')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePurchaseDto: UpdatePurchaseDto) {
        return this.purchasesService.update(+id, updatePurchaseDto)
    }

    @Delete(':id')
    @Roles('admin', 'warehouse')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.purchasesService.remove(+id)
    }
}
