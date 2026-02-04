import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRolesService } from './user-roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { QueryRolesDto } from './dto/query-roles.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('user-roles')
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly service: UserRolesService) { }

  @Get()
  findAll(@Query() query: QueryRolesDto) {
    return this.service.findAll(query);
  }

  @Get('menu-keys')
  getMenuKeys() {
    return this.service.getMenuKeys();
  }

  @Get(':id/permissions')
  getPermissions(@Param('id', ParseIntPipe) id: number) {
    return this.service.getPermissions(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateRoleDto) {
    return this.service.create(dto);
  }

  @Put(':id/permissions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updatePermissions(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionsDto) {
    return this.service.updatePermissions(id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
