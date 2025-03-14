import { IsNumber } from "class-validator";

export class CreatePurchaseDto {
  @IsNumber()
  providerId: number;

  @IsNumber()
  userId: number;
}
