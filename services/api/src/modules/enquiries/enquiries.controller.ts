import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EnquiriesService } from './enquiries.service';

@ApiTags('enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly service: EnquiriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
