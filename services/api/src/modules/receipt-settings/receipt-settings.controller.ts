import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ReceiptSettingsService } from './receipt-settings.service';
import { UpdateReceiptSettingsDto } from './dto/update-receipt-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('receipt-settings')
export class ReceiptSettingsController {
  constructor(private readonly service: ReceiptSettingsService) {}

  @Get()
  async findSettings() {
    return this.service.findSettings();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateSettings(@Body() dto: UpdateReceiptSettingsDto) {
    return this.service.updateSettings(dto);
  }
}
