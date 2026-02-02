import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SponsorsService } from './sponsors.service';

@ApiTags('sponsors')
@Controller('website/sponsors')
export class SponsorsController {
  constructor(private readonly service: SponsorsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
