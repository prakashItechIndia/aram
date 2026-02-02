import {
  int,
  nvarchar,
  nchar,
  bit,
  datetime,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * LEGACY DB table: T_DONOR_CATEGORIES (old donation categories).
 * Use donation_categories table instead for new development.
 */
export const tDonorCategories = mssqlTable('T_DONOR_CATEGORIES', {
  id: int('Id').primaryKey().identity(),
  accountNumber: nvarchar('Account_Number', { length: 30 }),
  donorTypes: nvarchar('Donor_Types', { length: 50 }),
  donationCode: nchar('Donation_Code', { length: 10 }),
  donationPageShow: bit('DonationPage_Show'),
  isActive: bit('Is_Active'),
  isDeleted: bit('Is_Deleted'),
  createdBy: int('Created_By'),
  createdDate: datetime('Created_Date'),
});

export type TDonorCategory = typeof tDonorCategories.$inferSelect;
export type NewTDonorCategory = typeof tDonorCategories.$inferInsert;
