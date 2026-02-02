import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_DONOR_CATEGORIES (donation categories).
 */
export const tDonorCategories = mssqlTable('T_DONOR_CATEGORIES', {
  id: int('Id').primaryKey(),
  categoryCode: nvarchar('Category_Code', { length: 32 }),
  displayName: nvarchar('Display_Name', { length: 128 }),
  is80gEligible: bit('Is_80G_Eligible'),
  sortOrder: int('Sort_Order'),
  isActive: bit('Is_Active'),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TDonorCategory = typeof tDonorCategories.$inferSelect;
export type NewTDonorCategory = typeof tDonorCategories.$inferInsert;
