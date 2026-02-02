import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
