import {
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateCategoryDto } from "src/app/categories/dto/create-category.dto";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  providerId: number;

  @IsNumber()
  price: number;

  @IsNumber()
  cost: number;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateCategoryDto)
  categories: CreateCategoryDto[];
}
