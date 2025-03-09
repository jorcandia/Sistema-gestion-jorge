import { IsNumber, IsOptional, IsPositive } from 'class-validator'

export class PaginationQueryDto {

    @IsNumber()
    @IsOptional()
    page: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    size: number

}