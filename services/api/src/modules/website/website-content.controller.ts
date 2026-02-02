import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebsiteContentService } from './website-content.service';

@ApiTags('website-content')
@Controller('website/content')
export class WebsiteContentController {
  constructor(private readonly service: WebsiteContentService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
