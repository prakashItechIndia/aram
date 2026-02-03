import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Receipt Management – remaining tabs (ReceiptManagement.tsx).
 * Numbering, Generation, Template, Mandatory Fields, Delivery, Reprint & Reissue.
 */
export const receiptSettings = mssqlTable('receipt_settings', {
  id: int('id').primaryKey().identity(),
  configJson: nvarchar('config_json', { length: 'max' }),
  // Numbering & Series
  receiptPrefix: nvarchar('receipt_prefix', { length: 64 }),
  startingNumber: nvarchar('starting_number', { length: 32 }),
  paddingLength: int('padding_length'),
  noGapEnforcement: bit('no_gap_enforcement').notNull().default(true),
  autoCreateNewSeries: bit('auto_create_new_series').notNull().default(true),
  manualApprovalRequired: bit('manual_approval_required').notNull().default(false),
  receiptTypesJson: nvarchar('receipt_types_json', { length: 'max' }),
  // Generation Rules
  autoGenerateOnSuccess: bit('auto_generate_on_success').notNull().default(true),
  generationDelay: int('generation_delay').notNull().default(0),
  autoGenerateImports: bit('auto_generate_imports').notNull().default(false),
  allowManualOffline: bit('allow_manual_offline').notNull().default(true),
  allowManualBulk: bit('allow_manual_bulk').notNull().default(true),
  allowBackdated: bit('allow_backdated').notNull().default(true),
  backdateWindow: int('backdate_window'),
  showBackdateStamp: bit('show_backdate_stamp').notNull().default(true),
  requireReasonManual: bit('require_reason_manual').notNull().default(true),
  // Template Rules
  defaultTemplateOnline: nvarchar('default_template_online', { length: 128 }),
  defaultTemplateOffline: nvarchar('default_template_offline', { length: 128 }),
  template80g: nvarchar('template_80g', { length: 128 }),
  templateNon80g: nvarchar('template_non_80g', { length: 128 }),
  forceRegenerateOnUpdate: bit('force_regenerate_on_update').notNull().default(false),
  lockContentAfterGeneration: bit('lock_content_after_generation').notNull().default(true),
  // Mandatory Fields
  mobileRequired: bit('mobile_required').notNull().default(true),
  emailRequired: bit('email_required').notNull().default(true),
  addressRequired: bit('address_required').notNull().default(false),
  donationCategoryRequired: bit('donation_category_required').notNull().default(true),
  donationTypeRequired: bit('donation_type_required').notNull().default(true),
  panRule: nvarchar('pan_rule', { length: 32 }),
  panThreshold: int('pan_threshold'),
  panAutoUppercase: bit('pan_auto_uppercase').notNull().default(true),
  pincodeValidation: bit('pincode_validation').notNull().default(true),
  duplicateWarning: bit('duplicate_warning').notNull().default(true),
  // Delivery
  autoSendEmailOnReceiptGeneration: bit('auto_send_email_on_receipt_generation').notNull().default(true),
  emailSubjectFormat: nvarchar('email_subject_format', { length: 'max' }),
  emailSenderName: nvarchar('email_sender_name', { length: 255 }),
  emailReplyTo: nvarchar('email_reply_to', { length: 255 }),
  emailRetryAttempts: int('email_retry_attempts').notNull().default(3),
  emailFailureAlertsNotifyAdmin: bit('email_failure_alerts_notify_admin').notNull().default(true),
  autoSendSmsOnReceiptGeneration: bit('auto_send_sms_on_receipt_generation').notNull().default(false),
  smsTemplate: nvarchar('sms_template', { length: 'max' }),
  smsShortLink: bit('sms_short_link').notNull().default(true),
  // Reprint & Reissue
  allowReprint: bit('allow_reprint').notNull().default(true),
  allowResendEmail: bit('allow_resend_email').notNull().default(true),
  allowCorrection: bit('allow_correction').notNull().default(true),
  requireReasonReprint: bit('require_reason_reprint').notNull().default(false),
  requireReasonCorrection: bit('require_reason_correction').notNull().default(true),
  requireReasonManualGen: bit('require_reason_manual_gen').notNull().default(true),
  requireReasonRegenerate: bit('require_reason_regenerate').notNull().default(true),
  requireReasonCancel: bit('require_reason_cancel').notNull().default(true),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
  updatedBy: nvarchar('updated_by', { length: 128 }),
});

export type ReceiptSetting = typeof receiptSettings.$inferSelect;
export type NewReceiptSetting = typeof receiptSettings.$inferInsert;
