import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseDetailDto } from './create-warehouse_detail.dto';

export class UpdateWarehouseDetailDto extends PartialType(CreateWarehouseDetailDto) {}
