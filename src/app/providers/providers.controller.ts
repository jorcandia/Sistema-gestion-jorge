import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ProvidersService } from "./providers.service";
import { CreateProviderDto } from "./dto/create-provider.dto";
import { UpdateProviderDto } from "./dto/update-provider.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "src/decorator/roles.decorators";
import { GetProviderDto } from "./dto/get-provider.dto";

@Controller("providers")
@UseGuards(JwtAuthGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @Roles("admin")
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  findAll(@Query() getProviderDto: GetProviderDto) {
    return this.providersService.findAll(getProviderDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.providersService.findOne(+id);
  }

  @Patch(":id")
  @Roles("admin")
  update(
    @Param("id") id: string,
    @Body() updateProviderDto: UpdateProviderDto
  ) {
    return this.providersService.update(+id, updateProviderDto);
  }

  @Delete(":id")
  @Roles("admin")
  remove(@Param("id") id: string) {
    return this.providersService.remove(+id);
  }
}
