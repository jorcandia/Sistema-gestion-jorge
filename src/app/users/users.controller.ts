import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from "@nestjs/common";

import { UsersService } from "src/app/users/users.service";
import { JwtAuthGuard } from "src/app/auth/jwt-auth.guard";
import { CreateUserDto } from "src/app/users/dto/create-user.dto";
import { UpdateUserDto } from "src/app/users/dto/update-user.dto";
import { Roles } from "src/decorator/roles.decorators";
import { GetUserDto } from "./dto/get-user.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles("admin")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() getUserDto: GetUserDto) {
    return this.usersService.findAll(getUserDto);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @Roles("admin")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles("admin")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
