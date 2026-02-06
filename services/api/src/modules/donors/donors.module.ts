import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';
import { EmailModule } from '../email/email.module';
import { NotificationsModule } from '../notifications/notifications.module';

import { ReceiptSettingsModule } from '../receipt-settings/receipt-settings.module';

@Module({
  imports: [AuthModule, EmailModule, NotificationsModule, ReceiptSettingsModule],
  controllers: [DonorsController],
  providers: [DonorsService],
  exports: [DonorsService],
})
export class DonorsModule { }
