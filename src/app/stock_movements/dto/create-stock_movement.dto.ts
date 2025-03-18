import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateStockMovementDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  objectId: number;

  @IsNotEmpty()
  objectModel: string;
}
