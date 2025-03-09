import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { CreateProductDto } from "src/app/products/dto/create-product.dto";

export class CreateProviderDto {
  name: string;
  phone: string;
  address: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateProductDto)
  products: CreateProductDto[];
}
