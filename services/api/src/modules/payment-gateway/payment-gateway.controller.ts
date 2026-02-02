import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentGatewayService } from './payment-gateway.service';

@ApiTags('payment-gateway')
@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(private readonly service: PaymentGatewayService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
