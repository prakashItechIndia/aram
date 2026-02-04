import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { DonationFormSettingsModule } from '../donation-form-settings/donation-form-settings.module';

@Module({
  imports: [DonationFormSettingsModule],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
