import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  decimal,
  date,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Donor profiles – admin + donor portal (guest and registered).
 * User Stories: DAS-008 (profile/notifications), NOT-003 (birthday & memorial).
 */
export const donors = mssqlTable('donors', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 255 }).notNull(),
  email: nvarchar('email', { length: 255 }).notNull(),
  mobile: nvarchar('mobile', { length: 20 }),
  pan: nvarchar('pan', { length: 10 }),
  address: nvarchar('address', { length: 'max' }),
  country: nvarchar('country', { length: 128 }),
  state: nvarchar('state', { length: 128 }),
  pincode: nvarchar('pincode', { length: 20 }),
  status: nvarchar('status', { length: 32 }),
  tags: nvarchar('tags', { length: 'max' }),
  firstDonationAt: datetime2('first_donation_at', { precision: 3 }),
  lastDonationAt: datetime2('last_donation_at', { precision: 3 }),
  totalDonated: decimal('total_donated', { precision: 18, scale: 2 }).default('0'),
  donationCount: int('donation_count').default(0),
  isGuest: bit('is_guest').default(false),
  passwordHash: nvarchar('password_hash', { length: 255 }),
  themePreference: nvarchar('theme_preference', { length: 16 }),
  notificationPreferences: nvarchar('notification_preferences', { length: 'max' }),
  birthday: date('birthday'),
  memorialDates: nvarchar('memorial_dates', { length: 'max' }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type Donor = typeof donors.$inferSelect;
export type NewDonor = typeof donors.$inferInsert;
