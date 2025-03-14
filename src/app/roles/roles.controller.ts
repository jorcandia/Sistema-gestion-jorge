import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";

import { RolesService } from "src/app/roles/roles.service";
import { CreateRoleDto } from "src/app/roles/dto/create-role.dto";
import { UpdateRoleDto } from "src/app/roles/dto/update-role.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "src/decorator/roles.decorators";

@Controller("roles")
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles("admin")
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(":id")
  @Roles("admin")
  update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(":id")
  @Roles("admin")
  remove(@Param("id") id: string) {
    return this.rolesService.remove(+id);
  }
}
