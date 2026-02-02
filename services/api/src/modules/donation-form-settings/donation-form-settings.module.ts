import { Module } from '@nestjs/common';
import { DonationFormSettingsService } from './donation-form-settings.service';
import { DonationFormSettingsController } from './donation-form-settings.controller';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [DonationFormSettingsController],
  providers: [DonationFormSettingsService],
  exports: [DonationFormSettingsService],
})
export class DonationFormSettingsModule {}
