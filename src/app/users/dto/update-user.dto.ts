import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString } from 'class-validator'

import { CreateUserDto } from 'src/app/users/dto/create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsString()
    email: string

    @IsOptional()
    @IsString()
    password: string

}
