import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [AuthModule, EmailModule],
  controllers: [DonorsController],
  providers: [DonorsService],
  exports: [DonorsService],
})
export class DonorsModule {}
