import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { tCountry } from '../../database/models/t-country.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import { DonationFormSettingsService } from '../donation-form-settings/donation-form-settings.service';

export interface CountryOption {
  value: string;
  label: string;
  code: string;
}

@Injectable()
export class CountriesService {
  constructor(
    @Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>,
    private donationFormSettingsService: DonationFormSettingsService,
  ) { }

  /**
   * Get countries based on donation form settings
   * If multiCountry is enabled, return all countries from database
   * If multiCountry is disabled, return only India
   */
  async getCountries(): Promise<CountryOption[]> {
    // Get current donation form settings
    const settings = await this.donationFormSettingsService.getCurrentSettings();
    const multiCountry = settings.multiCountry ?? false;

    // If multiCountry is disabled, return only India
    if (!multiCountry) {
      return [{ value: 'india', label: 'India', code: '+91' }];
    }

    // Fetch all countries from database
    const countries = await this.db.select().from(tCountry);

    // Transform to dropdown format
    return countries.map((country) => ({
      value: country.countryName?.toLowerCase().replace(/\s+/g, '-') || '',
      label: country.countryName || '',
      code: country.countryNumber || '',
    }));
  }
}
