import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  decimal,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Master data – donation categories (DonationCategories.tsx + BRD).
 * Basic, Amount Rules, Receipt & 80G, Form Fields, Payment Gateway, Accounting.
 */
export const donationCategories = mssqlTable('donation_categories', {
  id: int().identity({ seed: 1, increment: 1 }),
  categoryCode: nvarchar('category_code', { length: 32 }).notNull(),
  displayName: nvarchar('display_name', { length: 128 }).notNull(),
  publicVisibility: bit('public_visibility').default(true).notNull(),
  sortOrder: int('sort_order').default(0).notNull(),
  is80gEligible: bit('is_80g_eligible').default(true).notNull(),
  suggestedAmounts: nvarchar('suggested_amounts', { length: 'max' }),
  isDeleted: bit('is_deleted').default(false).notNull(),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`getdate()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
  description: nvarchar({ length: 'max' }),
  tagLabel: nvarchar('tag_label', { length: 64 }),
  highlighted: bit().default(false).notNull(),
  isDefault: bit('is_default').default(false).notNull(),
  minAmount: decimal('min_amount', { precision: 18, scale: 2 }),
  maxAmount: decimal('max_amount', { precision: 18, scale: 2 }),
  allowCustomAmount: bit('allow_custom_amount').default(true).notNull(),
  recurringAllowed: bit('recurring_allowed').default(false).notNull(),
  recurringDefaultChecked: bit('recurring_default_checked').default(false).notNull(),
  receiptEnabled: bit('receipt_enabled').default(true).notNull(),
  template80g: nvarchar('template_80g', { length: 128 }),
  templateNon80g: nvarchar('template_non_80g', { length: 128 }),
  autoEmailReceipt: bit('auto_email_receipt').default(true).notNull(),
  autoSmsReceipt: bit('auto_sms_receipt').default(false).notNull(),
  receiptDescription: nvarchar('receipt_description', { length: 255 }),
  panRule: nvarchar('pan_rule', { length: 32 }),
  panThreshold: int('pan_threshold'),
  addressRequired: bit('address_required').default(false).notNull(),
  mobileRequired: bit('mobile_required').default(true).notNull(),
  showPurposeField: bit('show_purpose_field').default(true).notNull(),
  allowAnonymous: bit('allow_anonymous').default(false).notNull(),
  allowedGateways: nvarchar('allowed_gateways', { length: 'max' }),
  allowedPaymentMethods: nvarchar('allowed_payment_methods', { length: 'max' }),
  internationalAllowed: bit('international_allowed').default(false).notNull(),
  accountingHead: nvarchar('accounting_head', { length: 128 }),
  costCenter: nvarchar('cost_center', { length: 128 }),
  taxCategory: nvarchar('tax_category', { length: 64 }),
  reportGrouping: nvarchar('report_grouping', { length: 128 }),
});

export type DonationCategory = typeof donationCategories.$inferSelect;
export type NewDonationCategory = typeof donationCategories.$inferInsert;
