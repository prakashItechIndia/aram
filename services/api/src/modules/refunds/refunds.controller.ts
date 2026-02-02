import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefundsService } from './refunds.service';

@ApiTags('refunds')
@Controller('refunds')
export class RefundsController {
  constructor(private readonly service: RefundsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
