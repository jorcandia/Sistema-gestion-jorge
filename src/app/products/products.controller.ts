import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from 'src/decorator/roles.decorators'
import { GetProductDto } from './dto/get-product.dto'

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @Roles('admin')
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto)
    }

    @Get()
    findAll(@Query() getProductDto: GetProductDto) {
        return this.productsService.findAll(getProductDto)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id)
    }

    @Patch(':id')
    @Roles('admin')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(+id, updateProductDto)
    }

    @Delete(':id')
    @Roles('admin')
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id)
    }

    @Get('by-warehouse/:warehouseId')
    findByWarehouse(
        @Param('warehouseId', ParseIntPipe) warehouseId: number,
        @Query('size') size?: number,
        @Query('page') page?: number,
        @Query('name') name?: string
    ) {
        return this.productsService.findByWarehouse(warehouseId, {
            size: size ? Number(size) : undefined,
            page: page ? Number(page) : undefined,
            name,
        })
    }
}
