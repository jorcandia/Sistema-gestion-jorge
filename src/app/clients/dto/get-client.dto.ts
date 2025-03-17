import { IsOptional } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { PaginationQueryDto } from "src/utils/paginate/pagination-query.dto";

export class GetClientDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  firstname: string;
}
