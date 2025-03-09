import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Role } from 'src/app/roles/entities/role.entity'
import { RolesService } from 'src/app/roles/roles.service'
import { RolesController } from 'src/app/roles/roles.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
