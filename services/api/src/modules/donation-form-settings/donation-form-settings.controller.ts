import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DonationFormSettingsService } from './donation-form-settings.service';
import { UpdateDonationFormSettingsDto } from './dto/update-donation-form-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('donation-form-settings')
@Controller('donation-form-settings')
export class DonationFormSettingsController {
  constructor(private readonly service: DonationFormSettingsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current active donation form settings' })
  getCurrentSettings() {
    return this.service.getCurrentSettings();
  }

  @Get('versions')
  @ApiOperation({ summary: 'Get all version history' })
  getVersionHistory() {
    return this.service.getVersionHistory();
  }

  @Get('versions/:id')
  @ApiOperation({ summary: 'Get a specific version by ID' })
  getVersionById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getVersionById(id);
  }

  @Patch('current')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update donation form settings (creates new version)' })
  updateSettings(@Body() dto: UpdateDonationFormSettingsDto, @Request() req: any) {
    const userId = req.user?.sub;
    return this.service.updateSettings(dto, userId);
  }

  @Post('rollback/:versionId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rollback to a specific version' })
  rollbackToVersion(
    @Param('versionId', ParseIntPipe) versionId: number,
    @Request() req: any,
  ) {
    const userId = req.user?.sub;
    return this.service.rollbackToVersion(versionId, userId);
  }
}
