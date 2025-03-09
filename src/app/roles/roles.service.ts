import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums'
import { InjectRepository } from '@nestjs/typeorm'

import { Role } from 'src/app/roles/entities/role.entity'
import { HttpException } from '@nestjs/common/exceptions'
import { CreateRoleDto } from 'src/app/roles/dto/create-role.dto'
import { UpdateRoleDto } from 'src/app/roles/dto/update-role.dto'

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private roleRepository: Repository<Role>) { }

  create(createRoleDto: CreateRoleDto) {
    const newRecord = this.roleRepository.create(createRoleDto)
    return this.roleRepository.save(newRecord)
  }

  findAll() {
    return this.roleRepository.find()
  }

  async findOne(id: number) {
    const foundRecord =  await this.roleRepository.findOne({ where: { id } })
    if (!foundRecord) {
      return new HttpException('Role not found', HttpStatus.NOT_FOUND)
    }
    return foundRecord
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const foundRecord =  await this.roleRepository.findOne({ where: { id } })
    if (!foundRecord) {
      return new HttpException('Role not found', HttpStatus.NOT_FOUND)
    }
    const updatedRecord = Object.assign(foundRecord, updateRoleDto)
    return this.roleRepository.save(updatedRecord)
  }

  async remove(id: number) {
    const result =  await this.roleRepository.delete({ id })
    if (result.affected === 0) {
      return new HttpException('Role not found', HttpStatus.NOT_FOUND)
    }
    return result
  }
}