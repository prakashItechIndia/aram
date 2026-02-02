import { Module } from '@nestjs/common';
import { DonationCategoriesService } from './donation-categories.service';
import { DonationCategoriesController } from './donation-categories.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DonationCategoriesController],
  providers: [DonationCategoriesService],
  exports: [DonationCategoriesService],
})
export class DonationCategoriesModule {}
