import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';

@Module({
  imports: [AuthModule],
  controllers: [DonorsController],
  providers: [DonorsService],
  exports: [DonorsService],
})
export class DonorsModule {}
