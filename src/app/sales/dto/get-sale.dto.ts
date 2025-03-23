import { IsDateString, IsOptional } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { PaginationQueryDto } from 'src/utils/paginate/pagination-query.dto'

export class GetSalesDto extends PartialType(PaginationQueryDto) {
    @IsOptional()
    name?: string

    @IsOptional()
    @IsDateString()
    startDate?: string

    @IsOptional()
    @IsDateString()
    endDate?: string
}
