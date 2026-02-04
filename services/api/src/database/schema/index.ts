/**
 * Central schema export – module-based models.
 * Existing DB tables (T_*) are exported for auth and modules; new/upcoming tables follow same T_ + PascalCase_Underscore where applied.
 * Run: pnpm db:pull (from services/api) to introspect existing DB and merge into models.
 */

/* Existing DB tables (T_ prefix, PascalCase_Underscore columns) */
export * from '../models/t-user.model';
export * from '../models/t-roles.model';
export * from '../models/t-roles-privilege.model';
export * from '../models/t-country.model';
export * from '../models/t-state.model';
export * from '../models/t-donor-categories.model';
export * from '../models/t-echallan.model';
export * from '../models/t-payment-gateway-config.model';
export * from '../models/t-payment-order-no.model';
export * from '../models/t-payment-transaction.model';
export * from '../models/t-razorpay-transaction.model';
export * from '../models/t-user-activites.model';
export * from '../models/t-basic-setting.model';
export * from '../models/t-cfg-errorlog.model';
export * from '../models/t-cfg-recipients.model';

/* New/upcoming tables (also use T_ naming in DB when created) */
export * from '../models/user-roles.model';
export * from '../models/role-permissions.model';
// export * from '../models/users.model'; /* stub: maps to T_USER; no separate users table */
export * from '../models/donors.model';
export * from '../models/donor-notes.model';
export * from '../models/donation-categories.model';
export * from '../models/campaigns.model';
export * from '../models/receipts.model';
export * from '../models/transactions.model';
export * from '../models/donation-form-settings.model';
export * from '../models/feature-config.model';
export * from '../models/payment-gateway-settings.model';
export * from '../models/refund-requests.model';
export * from '../models/enquiries.model';
export * from '../models/enquiry-replies.model';
export * from '../models/communication-templates.model';
export * from '../models/automation-rules.model';
export * from '../models/automation-run-logs.model';
export * from '../models/e-challans.model';
export * from '../models/audit-log.model';
export * from '../models/admin-notifications.model';
export * from '../models/user-otp.model';
export * from '../models/reconciliation-batches.model';
export * from '../models/website-content.model';
export * from '../models/website-pages.model';
export * from '../models/website-page-sections.model';
export * from '../models/website-team-members.model';
export * from '../models/sponsors.model';
export * from '../models/gallery.model';
export * from '../models/gallery-albums.model';
export * from '../models/gallery-settings.model';
export * from '../models/receipt-settings.model';
export * from '../models/reconciliation-settings.model';
export * from '../models/enquiry-settings.model';
export * from '../models/export-log.model';
export * from '../models/webhook-log.model';
