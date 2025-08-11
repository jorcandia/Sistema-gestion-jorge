import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateSaleDto } from './create-sale.dto'
import { UpdateSaleDetailDto } from 'src/app/sale_details/dto/update-sale_detail.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateSaleDto extends PartialType(OmitType(CreateSaleDto, ['sale_details'] as const)) {
    @ValidateNested({ each: true })
    @Type(() => UpdateSaleDetailDto)
    sale_details: UpdateSaleDetailDto[]
}
