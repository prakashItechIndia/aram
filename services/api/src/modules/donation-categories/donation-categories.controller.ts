import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DonationCategoriesService } from './donation-categories.service';

@ApiTags('donation-categories')
@Controller('donation-categories')
export class DonationCategoriesController {
  constructor(private readonly service: DonationCategoriesService) {}

  @Get()
  findAll(@Query('includeDeleted') includeDeleted?: string) {
    return this.service.findAll(includeDeleted === 'true');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
