import { Module } from '@nestjs/common';
import { ReceiptSettingsController } from './receipt-settings.controller';
import { ReceiptSettingsService } from './receipt-settings.service';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ReceiptSettingsController],
  providers: [ReceiptSettingsService],
  exports: [ReceiptSettingsService],
})
export class ReceiptSettingsModule {}
