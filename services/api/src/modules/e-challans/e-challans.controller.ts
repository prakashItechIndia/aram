import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EChallansService } from './e-challans.service';

@ApiTags('e-challans')
@Controller('e-challans')
export class EChallansController {
  constructor(private readonly service: EChallansService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
