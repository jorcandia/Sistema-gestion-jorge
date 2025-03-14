import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";
import { CreateSaleDetailDto } from "src/app/sale_details/dto/create-sale_detail.dto";

export class CreateSaleDto {
  @IsNumber()
  clientId: number;

  @IsNumber()
  cashRegisterId: number;

  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  sale_details: CreateSaleDetailDto[];
}
