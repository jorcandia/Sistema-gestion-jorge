import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common'
import { CashRegistersService } from './cash_registers.service'
import { CreateCashRegisterDto } from './dto/create-cash_register.dto'
import { UpdateCashRegisterDto } from './dto/update-cash_register.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../../decorator/roles.decorators'
import { User } from 'src/decorator/user.decorator'

@Controller('cash_registers')
@UseGuards(JwtAuthGuard)
export class CashRegistersController {
    constructor(private readonly cashRegistersService: CashRegistersService) {}

    @Post()
    @Roles('admin')
    create(@Body() createCashRegisterDto: CreateCashRegisterDto) {
        return this.cashRegistersService.create(createCashRegisterDto)
    }

    @Get()
    findAll() {
        return this.cashRegistersService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cashRegistersService.findOne(+id)
    }

    @Patch(':id')
    @Roles('admin')
    update(@Param('id') id: string, @Body() updateCashRegisterDto: UpdateCashRegisterDto) {
        return this.cashRegistersService.update(+id, updateCashRegisterDto)
    }

    @Delete(':id')
    @Roles('admin')
    remove(@Param('id') id: string) {
        return this.cashRegistersService.remove(+id)
    }

    @Post('open/:id')
    @HttpCode(200)
    async openCashRegister(@Param('id') id: number, @User() user) {
        return this.cashRegistersService.open(id, user);
    }

    // Ruta para cerrar la caja
    @Post('close/:id')
    @HttpCode(200)
    async closeCashRegister(@Param('id') id: number, @User() user) {
        return this.cashRegistersService.close(id, user);
    }
}
