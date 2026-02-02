import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReconciliationService } from './reconciliation.service';

@ApiTags('reconciliation')
@Controller('reconciliation')
export class ReconciliationController {
  constructor(private readonly service: ReconciliationService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
