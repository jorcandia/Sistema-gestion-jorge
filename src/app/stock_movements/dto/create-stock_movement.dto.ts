import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateStockMovementDto {
    @IsNotEmpty()
    @IsNumber()
    wareHouseDetailId: number

    @IsNumber()
    quantity: number

    @IsNumber()
    objectId: number

    @IsNotEmpty()
    objectModel: string
}
