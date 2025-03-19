import { IsNumber } from "class-validator";

export class CreateWarehouseDetailDto {
  @IsNumber()
  
  warehouseId: number;
  productId: number;
  quantity: number;
}
