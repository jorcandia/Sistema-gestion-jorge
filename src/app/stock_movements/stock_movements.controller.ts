import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common'
import { StockMovementsService } from './stock_movements.service'
import { CreateStockMovementDto } from './dto/create-stock_movement.dto'
import { UpdateStockMovementDto } from './dto/update-stock_movement.dto'

@Controller('stock-movements')
export class StockMovementsController {
    constructor(private readonly stockMovementsService: StockMovementsService) {}

    @Post()
    create(@Body() createStockMovementDto: CreateStockMovementDto) {
        return this.stockMovementsService.create(createStockMovementDto)
    }

    @Get()
    findAll() {
        return this.stockMovementsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.stockMovementsService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateStockMovementDto: UpdateStockMovementDto) {
        return this.stockMovementsService.update(+id, updateStockMovementDto)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.stockMovementsService.remove(+id)
    }

    @Post()
    addMovement(
        @Body('productId') productId: number,
        @Body('quantity') quantity: number,
        @Body('warehouseId') warehouseId: number,
        @Body('objectId') objectId: number,
        @Body('objectModel') objectModel: string
    ) {
        return this.stockMovementsService.addMovement({ productId, quantity, warehouseId, objectId, objectModel })
    }
}
