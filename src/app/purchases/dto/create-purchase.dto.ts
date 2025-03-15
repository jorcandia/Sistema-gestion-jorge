import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";
import { CreatePurchaseDetailDto } from "src/app/purchase_details/dto/create-purchase_detail.dto";

export class CreatePurchaseDto {
  @IsNumber()
  providerId: number;

  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseDetailDto)
  purchase_details: CreatePurchaseDetailDto[];
}
