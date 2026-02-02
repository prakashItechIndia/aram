import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { WebsiteContentService } from './website-content.service';
import { CreateWebsiteContentDto } from './dto/create-website-content.dto';
import { UpdateWebsiteContentDto } from './dto/update-website-content.dto';

@ApiTags('website-content')
@Controller('website/content')
export class WebsiteContentController {
  constructor(private readonly service: WebsiteContentService) {}

  @Get()
  findAll(@Query('sectionKey') sectionKey?: string) {
    if (sectionKey) return this.service.findBySectionKey(sectionKey);
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateWebsiteContentDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWebsiteContentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
