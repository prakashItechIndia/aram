import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  date,
  decimal,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Campaigns (Phase 2) – time-bound, recurring, emergency, evergreen.
 * User Stories CM-001: banner_image_url, thumbnail_image_url.
 */
export const campaigns = mssqlTable('campaigns', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 128 }).notNull(),
  publicTitle: nvarchar('public_title', { length: 255 }),
  campaignCode: nvarchar('campaign_code', { length: 32 }).notNull().unique(),
  donationCategoryId: int('donation_category_id'),
  campaignType: nvarchar('campaign_type', { length: 32 }),
  targetAmount: decimal('target_amount', { precision: 18, scale: 2 }),
  currentAmount: decimal('current_amount', { precision: 18, scale: 2 }).default('0'),
  donorCountTarget: int('donor_count_target'),
  showProgressOnPublic: bit('show_progress_on_public').default(true),
  isActive: bit('is_active').default(true),
  startDate: date('start_date'),
  endDate: date('end_date'),
  eventDescription: nvarchar('event_description', { length: 'max' }),
  bannerImageUrl: nvarchar('banner_image_url', { length: 512 }),
  thumbnailImageUrl: nvarchar('thumbnail_image_url', { length: 512 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
