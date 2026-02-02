import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';

@ApiTags('gallery')
@Controller('website/gallery')
export class GalleryController {
  constructor(private readonly service: GalleryService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
