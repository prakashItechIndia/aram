import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { GalleryAlbumsService } from './gallery-albums.service';
import { CreateGalleryAlbumDto } from './dto/create-gallery-album.dto';
import { UpdateGalleryAlbumDto } from './dto/update-gallery-album.dto';

@ApiTags('gallery-albums')
@Controller('website/gallery/albums')
export class GalleryAlbumsController {
  constructor(private readonly service: GalleryAlbumsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateGalleryAlbumDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGalleryAlbumDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
