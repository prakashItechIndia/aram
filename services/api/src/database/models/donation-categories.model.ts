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
  id: int('id').primaryKey(),
  categoryCode: nvarchar('category_code', { length: 32 }).notNull().unique(),
  displayName: nvarchar('display_name', { length: 128 }).notNull(),
  publicVisibility: bit('public_visibility').default(true),
  sortOrder: int('sort_order').default(0),
  is80gEligible: bit('is_80g_eligible').default(true),
  suggestedAmounts: nvarchar('suggested_amounts', { length: 'max' }),
  isDeleted: bit('is_deleted').default(false),
  description: nvarchar('description', { length: 'max' }),
  tagLabel: nvarchar('tag_label', { length: 64 }),
  highlighted: bit('highlighted').default(false),
  isDefault: bit('is_default').default(false),
  minAmount: decimal('min_amount', { precision: 18, scale: 2 }),
  maxAmount: decimal('max_amount', { precision: 18, scale: 2 }),
  allowCustomAmount: bit('allow_custom_amount').default(true),
  recurringAllowed: bit('recurring_allowed').default(false),
  recurringDefaultChecked: bit('recurring_default_checked').default(false),
  receiptEnabled: bit('receipt_enabled').default(true),
  template80g: nvarchar('template_80g', { length: 128 }),
  templateNon80g: nvarchar('template_non_80g', { length: 128 }),
  autoEmailReceipt: bit('auto_email_receipt').default(true),
  autoSmsReceipt: bit('auto_sms_receipt').default(false),
  receiptDescription: nvarchar('receipt_description', { length: 255 }),
  panRule: nvarchar('pan_rule', { length: 32 }),
  panThreshold: int('pan_threshold'),
  addressRequired: bit('address_required').default(false),
  mobileRequired: bit('mobile_required').default(true),
  showPurposeField: bit('show_purpose_field').default(true),
  allowAnonymous: bit('allow_anonymous').default(false),
  allowedGateways: nvarchar('allowed_gateways', { length: 'max' }),
  allowedPaymentMethods: nvarchar('allowed_payment_methods', { length: 'max' }),
  internationalAllowed: bit('international_allowed').default(false),
  accountingHead: nvarchar('accounting_head', { length: 128 }),
  costCenter: nvarchar('cost_center', { length: 128 }),
  taxCategory: nvarchar('tax_category', { length: 64 }),
  reportGrouping: nvarchar('report_grouping', { length: 128 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type DonationCategory = typeof donationCategories.$inferSelect;
export type NewDonationCategory = typeof donationCategories.$inferInsert;
