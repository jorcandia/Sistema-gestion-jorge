import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm/dist'

import { User } from 'src/app/users/entities/user.entity'
import { UsersService } from 'src/app/users/users.service'
import { UsersController } from 'src/app/users/users.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
