import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Donation form settings (versioned).
 * BRD §7: Enable/Disable form, maintenance message, test mode, multi-country, PAN rules,
 * Require address, Require mobile, OTP verification, Preset amounts, Min/Max, Recurring.
 * 
 * Supports version history and rollback functionality.
 * Each row represents a version of the settings. Only one version is active at a time.
 */
export const donationFormSettings = mssqlTable('donation_form_settings', {
  id: int('id').primaryKey().identity(),
  version: nvarchar('version', { length: 32 }).notNull(),
  configJson: nvarchar('config_json', { length: 'max' }).notNull(),
  isActive: bit('is_active').default(false),
  createdBy: nvarchar('created_by', { length: 128 }),
  changesDescription: nvarchar('changes_description', { length: 500 }),
  maintenanceMessage: nvarchar('maintenance_message', { length: 'max' }),
  formEnabled: bit('form_enabled').default(true),
  testMode: bit('test_mode').default(false),
  multiCountry: bit('multi_country').default(false),
  panRequired: nvarchar('pan_required', { length: 32 }),
  addressRequired: bit('address_required').default(true),
  mobileRequired: bit('mobile_required').default(true),
  otpVerification: bit('otp_verification').default(false),
  suggestRecurring: bit('suggest_recurring').default(true),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type DonationFormSettingsRow = typeof donationFormSettings.$inferSelect;
export type NewDonationFormSettingsRow = typeof donationFormSettings.$inferInsert;
