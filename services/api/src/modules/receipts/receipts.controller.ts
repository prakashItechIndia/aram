import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReceiptsService } from './receipts.service';

@ApiTags('receipts')
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
