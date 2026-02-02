import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommunicationTemplatesService } from './communication-templates.service';

@ApiTags('communication-templates')
@Controller('communication-templates')
export class CommunicationTemplatesController {
  constructor(private readonly service: CommunicationTemplatesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
