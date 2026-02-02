import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExportLogService } from './export-log.service';

@ApiTags('export-log')
@Controller('export-log')
export class ExportLogController {
  constructor(private readonly service: ExportLogService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
