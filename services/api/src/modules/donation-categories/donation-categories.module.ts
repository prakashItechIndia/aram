import { Module } from '@nestjs/common';
import { DonationCategoriesService } from './donation-categories.service';
import { DonationCategoriesController } from './donation-categories.controller';

@Module({
  controllers: [DonationCategoriesController],
  providers: [DonationCategoriesService],
  exports: [DonationCategoriesService],
})
export class DonationCategoriesModule {}
