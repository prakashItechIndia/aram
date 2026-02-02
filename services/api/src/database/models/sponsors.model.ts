import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  date,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Website sponsors (Phase 3) – tiers, display order.
 * User Stories WC-003: display_start_date, display_end_date (auto-hide after end date).
 */
export const sponsors = mssqlTable('sponsors', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 255 }).notNull(),
  logoUrl: nvarchar('logo_url', { length: 512 }),
  websiteUrl: nvarchar('website_url', { length: 512 }),
  contributionType: nvarchar('contribution_type', { length: 32 }),
  tier: nvarchar('tier', { length: 32 }),
  displayOrder: int('display_order').default(0),
  isActive: bit('is_active').default(true),
  showOnHomepage: bit('show_on_homepage').default(false),
  addedBy: nvarchar('added_by', { length: 128 }),
  featured: bit('featured').notNull().default(false),
  displayStartDate: date('display_start_date'),
  displayEndDate: date('display_end_date'),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type Sponsor = typeof sponsors.$inferSelect;
export type NewSponsor = typeof sponsors.$inferInsert;
