import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EChallansService, CreateEChallanDto, UpdateEChallanDto, EChallanFilters } from './e-challans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('e-challans')
@Controller('e-challans')
export class EChallansController {
  constructor(private readonly service: EChallansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all e-challans with optional filters' })
  @ApiQuery({ name: 'donorId', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'paymentMode', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'challanNumber', required: false, type: String })
  @ApiQuery({ name: 'createdBy', required: false, type: Number })
  @ApiQuery({ name: 'hasReceipt', required: false, type: Boolean })
  findAll(
    @Query('donorId') donorId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('paymentMode') paymentMode?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('challanNumber') challanNumber?: string,
    @Query('createdBy') createdBy?: string,
    @Query('hasReceipt') hasReceipt?: string,
  ) {
    const filters: EChallanFilters = {};
    
    if (donorId) filters.donorId = parseInt(donorId, 10);
    if (categoryId) filters.categoryId = parseInt(categoryId, 10);
    if (paymentMode) filters.paymentMode = paymentMode;
    if (fromDate) filters.fromDate = new Date(fromDate);
    if (toDate) filters.toDate = new Date(toDate);
    if (challanNumber) filters.challanNumber = challanNumber;
    if (createdBy) filters.createdBy = parseInt(createdBy, 10);
    if (hasReceipt !== undefined) filters.hasReceipt = hasReceipt === 'true';

    return this.service.findAll(filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get e-challan statistics' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  getStatistics(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const filters: any = {};
    if (fromDate) filters.fromDate = new Date(fromDate);
    if (toDate) filters.toDate = new Date(toDate);
    if (categoryId) filters.categoryId = parseInt(categoryId, 10);

    return this.service.getStatistics(filters);
  }

  @Get('by-challan-number/:challanNumber')
  @ApiOperation({ summary: 'Get e-challans by challan number' })
  findByChallanNumber(@Param('challanNumber') challanNumber: string) {
    return this.service.findByChallanNumber(challanNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single e-challan by ID with relationships' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Create a new e-challan' })
  create(@Body() createDto: CreateEChallanDto) {
    return this.service.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update an existing e-challan' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEChallanDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Patch(':id/link-receipt/:receiptId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Link a receipt to an e-challan' })
  linkReceipt(
    @Param('id', ParseIntPipe) id: number,
    @Param('receiptId', ParseIntPipe) receiptId: number,
  ) {
    return this.service.linkReceipt(id, receiptId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete an e-challan' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
