import { mssqlTable, int, nvarchar, datetime2, decimal, bit, datetime, bigint, date, nchar, varchar, index, unique, foreignKey, primaryKey, mssqlView } from "drizzle-orm/mssql-core"
import { sql } from "drizzle-orm"


export const adminNotifications = mssqlTable("admin_notifications", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	type: nvarchar({ length: 32 }).notNull(),
	title: nvarchar({ length: 255 }).notNull(),
	message: nvarchar({ length: 'max' }),
	readAt: datetime2("read_at", { mode: 'string', precision: 3 }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	userId: int("user_id").references(() => tUSER.id),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__admin_no__3213E83F46668038"}),
	index("IDX_admin_notifications_user_id").on(table.userId),
]);

export const auditLog = mssqlTable("audit_log", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	userId: int("user_id").references(() => users.id),
	action: nvarchar({ length: 64 }).notNull(),
	entityType: nvarchar("entity_type", { length: 64 }),
	entityId: nvarchar("entity_id", { length: 64 }),
	detailsJson: nvarchar("details_json", { length: 'max' }),
	ipAddress: nvarchar("ip_address", { length: 45 }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__audit_lo__3213E83FBF5B7D66"}),
]);

export const automationRules = mssqlTable("automation_rules", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 255 }).notNull(),
	triggerType: nvarchar("trigger_type", { length: 64 }).notNull(),
	triggerFiltersJson: nvarchar("trigger_filters_json", { length: 'max' }),
	actionsJson: nvarchar("actions_json", { length: 'max' }).notNull(),
	category: nvarchar({ length: 32 }),
	priority: nvarchar({ length: 16 }),
	status: nvarchar({ length: 32 }).default(sql`N'Enabled'`).notNull(),
	scheduleType: nvarchar("schedule_type", { length: 32 }),
	scheduleConfigJson: nvarchar("schedule_config_json", { length: 'max' }),
	lastRunAt: datetime2("last_run_at", { mode: 'string', precision: 3 }),
	nextRunAt: datetime2("next_run_at", { mode: 'string', precision: 3 }),
	successRate: decimal("success_rate", { precision: 5, scale: 2 }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__automati__3213E83FE1293288"}),
]);

export const automationRunLogs = mssqlTable("automation_run_logs", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	ruleId: int("rule_id").references(() => automationRules.id),
	eventRef: nvarchar("event_ref", { length: 128 }),
	recipient: nvarchar({ length: 255 }),
	channel: nvarchar({ length: 32 }),
	status: nvarchar({ length: 32 }).notNull(),
	errorMessage: nvarchar("error_message", { length: 'max' }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__automati__3213E83FF7BAC5CD"}),
]);

export const campaigns = mssqlTable("campaigns", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 128 }).notNull(),
	publicTitle: nvarchar("public_title", { length: 255 }),
	campaignCode: nvarchar("campaign_code", { length: 32 }).notNull(),
	donationCategoryId: int("donation_category_id").references(() => donationCategories.id),
	campaignType: nvarchar("campaign_type", { length: 32 }),
	targetAmount: decimal("target_amount", { precision: 18, scale: 2 }),
	currentAmount: decimal("current_amount", { precision: 18, scale: 2, mode: 'number' }).default(0).notNull(),
	donorCountTarget: int("donor_count_target"),
	showProgressOnPublic: bit("show_progress_on_public").default(true).notNull(),
	isActive: bit("is_active").default(true).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
	startDate: date("start_date", { mode: 'string' }),
	endDate: date("end_date", { mode: 'string' }),
	eventDescription: nvarchar("event_description", { length: 'max' }),
	bannerImageUrl: nvarchar("banner_image_url", { length: 512 }),
	thumbnailImageUrl: nvarchar("thumbnail_image_url", { length: 512 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__campaign__3213E83FAA2FF733"}),
	unique("UQ__campaign__DE597DBC8B9E6E62").on(table.campaignCode)
]);

export const communicationTemplates = mssqlTable("communication_templates", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 128 }).notNull(),
	category: nvarchar({ length: 32 }),
	type: nvarchar({ length: 16 }).notNull(),
	subject: nvarchar({ length: 255 }),
	bodyContent: nvarchar("body_content", { length: 'max' }),
	variablesJson: nvarchar("variables_json", { length: 'max' }),
	dltTemplateId: nvarchar("dlt_template_id", { length: 64 }),
	isActive: bit("is_active").default(true).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
	status: nvarchar({ length: 32 }),
	updatedBy: nvarchar("updated_by", { length: 128 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__communic__3213E83F08F16204"}),
]);

export const donationCategories = mssqlTable("donation_categories", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	categoryCode: nvarchar("category_code", { length: 32 }).notNull(),
	displayName: nvarchar("display_name", { length: 128 }).notNull(),
	publicVisibility: bit("public_visibility").default(true).notNull(),
	sortOrder: int("sort_order").default(0).notNull(),
	is80gEligible: bit("is_80g_eligible").default(true).notNull(),
	suggestedAmounts: nvarchar("suggested_amounts", { length: 'max' }),
	isDeleted: bit("is_deleted").default(false).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
	description: nvarchar({ length: 'max' }),
	tagLabel: nvarchar("tag_label", { length: 64 }),
	highlighted: bit().default(false).notNull(),
	isDefault: bit("is_default").default(false).notNull(),
	minAmount: decimal("min_amount", { precision: 18, scale: 2 }),
	maxAmount: decimal("max_amount", { precision: 18, scale: 2 }),
	allowCustomAmount: bit("allow_custom_amount").default(true).notNull(),
	recurringAllowed: bit("recurring_allowed").default(false).notNull(),
	recurringDefaultChecked: bit("recurring_default_checked").default(false).notNull(),
	receiptEnabled: bit("receipt_enabled").default(true).notNull(),
	template80g: nvarchar("template_80g", { length: 128 }),
	templateNon80g: nvarchar("template_non_80g", { length: 128 }),
	autoEmailReceipt: bit("auto_email_receipt").default(true).notNull(),
	autoSmsReceipt: bit("auto_sms_receipt").default(false).notNull(),
	receiptDescription: nvarchar("receipt_description", { length: 255 }),
	panRule: nvarchar("pan_rule", { length: 32 }),
	panThreshold: int("pan_threshold"),
	addressRequired: bit("address_required").default(false).notNull(),
	mobileRequired: bit("mobile_required").default(true).notNull(),
	showPurposeField: bit("show_purpose_field").default(true).notNull(),
	allowAnonymous: bit("allow_anonymous").default(false).notNull(),
	allowedGateways: nvarchar("allowed_gateways", { length: 'max' }),
	allowedPaymentMethods: nvarchar("allowed_payment_methods", { length: 'max' }),
	internationalAllowed: bit("international_allowed").default(false).notNull(),
	accountingHead: nvarchar("accounting_head", { length: 128 }),
	costCenter: nvarchar("cost_center", { length: 128 }),
	taxCategory: nvarchar("tax_category", { length: 64 }),
	reportGrouping: nvarchar("report_grouping", { length: 128 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__donation__3213E83F3AB29689"}),
	unique("UQ__donation__BC9D1E7C349B7CF2").on(table.categoryCode)
]);

export const donationFormSettings = mssqlTable("donation_form_settings", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	version: nvarchar({ length: 32 }).notNull(),
	configJson: nvarchar("config_json", { length: 'max' }).notNull(),
	isActive: bit("is_active").default(false).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	createdBy: nvarchar("created_by", { length: 128 }),
	maintenanceMessage: nvarchar("maintenance_message", { length: 'max' }),
	formEnabled: bit("form_enabled").default(true).notNull(),
	testMode: bit("test_mode").default(false).notNull(),
	multiCountry: bit("multi_country").default(false).notNull(),
	panRequired: nvarchar("pan_required", { length: 32 }),
	addressRequired: bit("address_required").default(true).notNull(),
	mobileRequired: bit("mobile_required").default(true).notNull(),
	otpVerification: bit("otp_verification").default(false).notNull(),
	suggestRecurring: bit("suggest_recurring").default(true).notNull(),
	changesDescription: nvarchar("changes_description", { length: 500 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__donation__3213E83FBC4C80B4"}),
]);

export const donorNotes = mssqlTable("donor_notes", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	donorId: int("donor_id").notNull().references(() => donors.id),
	createdByUserId: int("created_by_user_id").references(() => users.id),
	noteText: nvarchar("note_text", { length: 'max' }).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__donor_no__3213E83F343D1989"}),
]);

export const donors = mssqlTable("donors", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 255 }).notNull(),
	email: nvarchar({ length: 255 }).notNull(),
	mobile: nvarchar({ length: 20 }),
	pan: nvarchar({ length: 10 }),
	address: nvarchar({ length: 'max' }),
	country: nvarchar({ length: 128 }).default(sql`N'India'`),
	state: nvarchar({ length: 128 }),
	pincode: nvarchar({ length: 20 }),
	status: nvarchar({ length: 32 }),
	tags: nvarchar({ length: 'max' }),
	firstDonationAt: datetime2("first_donation_at", { mode: 'string', precision: 3 }),
	lastDonationAt: datetime2("last_donation_at", { mode: 'string', precision: 3 }),
	totalDonated: decimal("total_donated", { precision: 18, scale: 2, mode: 'number' }).default(0).notNull(),
	donationCount: int("donation_count").default(0).notNull(),
	isGuest: bit("is_guest").default(false).notNull(),
	passwordHash: nvarchar("password_hash", { length: 255 }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
	themePreference: nvarchar("theme_preference", { length: 16 }),
	notificationPreferences: nvarchar("notification_preferences", { length: 'max' }),
	birthday: date({ mode: 'string' }),
	memorialDates: nvarchar("memorial_dates", { length: 'max' }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__donors__3213E83F254341AA"}),
	unique("UQ_donors_pan").on(table.pan)
]);

export const eChallans = mssqlTable("e_challans", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	challanNumber: nvarchar("challan_number", { length: 64 }).notNull(),
	donorId: int("donor_id").notNull().references(() => donors.id),
	amount: decimal({ precision: 18, scale: 2 }).notNull(),
	categoryId: int("category_id").references(() => donationCategories.id),
	chequeNumber: nvarchar("cheque_number", { length: 64 }),
	paymentMode: nvarchar("payment_mode", { length: 32 }).notNull(),
	donationDate: date("donation_date", { mode: 'string' }).notNull(),
	receiptId: int("receipt_id").references(() => receipts.id),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	createdByUserId: int("created_by_user_id").references(() => users.id),
	cashReceivedBy: nvarchar("cash_received_by", { length: 128 }),
	bankName: nvarchar("bank_name", { length: 128 }),
	chequeDate: date("cheque_date", { mode: 'string' }),
	ddNumber: nvarchar("dd_number", { length: 64 }),
	ddDate: date("dd_date", { mode: 'string' }),
	utrNumber: nvarchar("utr_number", { length: 64 }),
	transferDate: date("transfer_date", { mode: 'string' }),
	amountInWords: nvarchar("amount_in_words", { length: 255 }),
	donorType: nvarchar("donor_type", { length: 32 }),
	purpose: nvarchar({ length: 'max' }),
	receiptNumber: nvarchar("receipt_number", { length: 64 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__e_challa__3213E83FA3DFC789"}),
]);

export const enquiries = mssqlTable("enquiries", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 255 }).notNull(),
	email: nvarchar({ length: 255 }).notNull(),
	organization: nvarchar({ length: 255 }),
	subject: nvarchar({ length: 255 }),
	message: nvarchar({ length: 'max' }),
	status: nvarchar({ length: 32 }).notNull(),
	assignedToUserId: int("assigned_to_user_id").references(() => users.id),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
	category: nvarchar({ length: 64 }),
	slaDeadline: datetime2("sla_deadline", { mode: 'string', precision: 3 }),
	hasAttachment: bit("has_attachment").default(false).notNull(),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__enquirie__3213E83F200D83F0"}),
]);

export const enquiryReplies = mssqlTable("enquiry_replies", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	enquiryId: int("enquiry_id").notNull().references(() => enquiries.id),
	fromUserId: int("from_user_id").references(() => users.id),
	body: nvarchar({ length: 'max' }).notNull(),
	isInternal: bit("is_internal").default(false).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__enquiry___3213E83F154382EE"}),
]);

export const enquirySettings = mssqlTable("enquiry_settings", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	defaultSlaHours: int("default_sla_hours"),
	warningBeforeBreachHours: int("warning_before_breach_hours"),
	autoAssignmentEnabled: bit("auto_assignment_enabled").default(false).notNull(),
	assignmentMethod: nvarchar("assignment_method", { length: 32 }),
	autoDetectSpam: bit("auto_detect_spam").default(false).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__enquiry___3213E83F49EA052A"}),
]);

export const exportLog = mssqlTable("export_log", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	userId: int("user_id").references(() => users.id),
	reportType: nvarchar("report_type", { length: 64 }),
	format: nvarchar({ length: 16 }),
	ipAddress: nvarchar("ip_address", { length: 45 }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__export_l__3213E83FBCA0C770"}),
]);

export const featureConfig = mssqlTable("feature_config", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	key: nvarchar({ length: 128 }).notNull(),
	value: nvarchar({ length: 'max' }),
	isEnabled: bit("is_enabled").default(true).notNull(),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedBy: nvarchar("updated_by", { length: 128 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__feature___3213E83F10E6EF79"}),
	unique("UQ__feature___DFD83CAF9876463D").on(table.key)
]);

export const gallery = mssqlTable("gallery", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	title: nvarchar({ length: 255 }).notNull(),
	description: nvarchar({ length: 'max' }),
	altText: nvarchar("alt_text", { length: 255 }),
	imagePath: nvarchar("image_path", { length: 512 }).notNull(),
	albumId: int("album_id"),
	tagsJson: nvarchar("tags_json", { length: 'max' }),
	sortOrder: int("sort_order").default(0).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
	caption: nvarchar({ length: 'max' }),
	photographer: nvarchar({ length: 128 }),
	visibility: nvarchar({ length: 32 }).default(sql`N'Public'`).notNull(),
	fileSize: nvarchar("file_size", { length: 32 }),
	thumbnailPath: nvarchar("thumbnail_path", { length: 512 }),
	uploadedBy: nvarchar("uploaded_by", { length: 128 }),
	uploadedAt: datetime2("uploaded_at", { mode: 'string', precision: 3 }),
	altTextGeneratedByAi: bit("alt_text_generated_by_ai").default(false).notNull(),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__gallery__3213E83F013C91F8"}),
]);

export const galleryAlbums = mssqlTable("gallery_albums", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 255 }).notNull(),
	coverImageUrl: nvarchar("cover_image_url", { length: 512 }),
	imageCount: int("image_count").default(0).notNull(),
	visibility: nvarchar({ length: 32 }).default(sql`N'Public'`).notNull(),
	sortOrder: int("sort_order").default(0).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__gallery___3213E83FD8F88096"}),
]);

export const gallerySettings = mssqlTable("gallery_settings", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	autoResizeEnabled: bit("auto_resize_enabled").default(true).notNull(),
	resizeSizesJson: nvarchar("resize_sizes_json", { length: 'max' }),
	convertToWebpEnabled: bit("convert_to_webp_enabled").default(true).notNull(),
	autoGenerateAltTextEnabled: bit("auto_generate_alt_text_enabled").default(false).notNull(),
	maxFileSizeMb: int("max_file_size_mb"),
	allowedExtensions: nvarchar("allowed_extensions", { length: 128 }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__gallery___3213E83F269A851C"}),
]);

export const paymentGatewaySettings = mssqlTable("payment_gateway_settings", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	provider: nvarchar({ length: 32 }).notNull(),
	environment: nvarchar({ length: 16 }).notNull(),
	apiKeyEncrypted: nvarchar("api_key_encrypted", { length: 'max' }),
	apiSecretEncrypted: nvarchar("api_secret_encrypted", { length: 'max' }),
	webhookSecret: nvarchar("webhook_secret", { length: 255 }),
	merchantId: nvarchar("merchant_id", { length: 128 }),
	gatewayFeeConfig: nvarchar("gateway_fee_config", { length: 'max' }),
	retryPolicy: nvarchar("retry_policy", { length: 'max' }),
	isActive: bit("is_active").default(true).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__payment___3213E83F032E1C7E"}),
]);

export const receiptSettings = mssqlTable("receipt_settings", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	configJson: nvarchar("config_json", { length: 'max' }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
	updatedBy: nvarchar("updated_by", { length: 128 }),
	autoSendEmailOnReceiptGeneration: bit("auto_send_email_on_receipt_generation").default(true).notNull(),
	emailSubjectFormat: nvarchar("email_subject_format", { length: 'max' }),
	emailSenderName: nvarchar("email_sender_name", { length: 255 }),
	emailReplyTo: nvarchar("email_reply_to", { length: 255 }),
	emailRetryAttempts: int("email_retry_attempts").default(3).notNull(),
	emailFailureAlertsNotifyAdmin: bit("email_failure_alerts_notify_admin").default(true).notNull(),
	autoSendSmsOnReceiptGeneration: bit("auto_send_sms_on_receipt_generation").default(false).notNull(),
	smsTemplate: nvarchar("sms_template", { length: 'max' }),
	smsShortLink: bit("sms_short_link").default(true).notNull(),
	mobileRequired: bit("mobile_required").default(true).notNull(),
	emailRequired: bit("email_required").default(true).notNull(),
	addressRequired: bit("address_required").default(false).notNull(),
	donationCategoryRequired: bit("donation_category_required").default(true).notNull(),
	donationTypeRequired: bit("donation_type_required").default(true).notNull(),
	panRule: nvarchar("pan_rule", { length: 32 }),
	panThreshold: int("pan_threshold"),
	panAutoUppercase: bit("pan_auto_uppercase").default(true).notNull(),
	pincodeValidation: bit("pincode_validation").default(true).notNull(),
	duplicateWarning: bit("duplicate_warning").default(true).notNull(),
	receiptPrefix: nvarchar("receipt_prefix", { length: 64 }),
	startingNumber: nvarchar("starting_number", { length: 32 }),
	paddingLength: int("padding_length"),
	noGapEnforcement: bit("no_gap_enforcement").default(true).notNull(),
	autoCreateNewSeries: bit("auto_create_new_series").default(true).notNull(),
	manualApprovalRequired: bit("manual_approval_required").default(false).notNull(),
	receiptTypesJson: nvarchar("receipt_types_json", { length: 'max' }),
	autoGenerateOnSuccess: bit("auto_generate_on_success").default(true).notNull(),
	generationDelay: int("generation_delay").default(0).notNull(),
	autoGenerateImports: bit("auto_generate_imports").default(false).notNull(),
	allowManualOffline: bit("allow_manual_offline").default(true).notNull(),
	allowManualBulk: bit("allow_manual_bulk").default(true).notNull(),
	allowBackdated: bit("allow_backdated").default(true).notNull(),
	backdateWindow: int("backdate_window"),
	showBackdateStamp: bit("show_backdate_stamp").default(true).notNull(),
	requireReasonManual: bit("require_reason_manual").default(true).notNull(),
	defaultTemplateOnline: nvarchar("default_template_online", { length: 128 }),
	defaultTemplateOffline: nvarchar("default_template_offline", { length: 128 }),
	template80g: nvarchar("template_80g", { length: 128 }),
	templateNon80g: nvarchar("template_non_80g", { length: 128 }),
	forceRegenerateOnUpdate: bit("force_regenerate_on_update").default(false).notNull(),
	lockContentAfterGeneration: bit("lock_content_after_generation").default(true).notNull(),
	storageMode: nvarchar("storage_mode", { length: 16 }),
	linkSecurity: nvarchar("link_security", { length: 16 }),
	linkExpiryDays: int("link_expiry_days"),
	allowRegenerationTemplate: bit("allow_regeneration_template").default(true).notNull(),
	allowRegenerationAnytime: bit("allow_regeneration_anytime").default(false).notNull(),
	bulkGenerationAllowed: bit("bulk_generation_allowed").default(true).notNull(),
	maxBatchSize: int("max_batch_size"),
	zipFilenameFormat: nvarchar("zip_filename_format", { length: 255 }),
	includeIndexCsv: bit("include_index_csv").default(true).notNull(),
	runInBackground: bit("run_in_background").default(true).notNull(),
	allowMarkReissued: bit("allow_mark_reissued").default(true).notNull(),
	autoMarkDelivered: bit("auto_mark_delivered").default(true).notNull(),
	allowReprint: bit("allow_reprint").default(true).notNull(),
	allowResendEmail: bit("allow_resend_email").default(true).notNull(),
	allowCorrection: bit("allow_correction").default(true).notNull(),
	requireReasonReprint: bit("require_reason_reprint").default(false).notNull(),
	requireReasonCorrection: bit("require_reason_correction").default(true).notNull(),
	requireReasonManualGen: bit("require_reason_manual_gen").default(true).notNull(),
	requireReasonRegenerate: bit("require_reason_regenerate").default(true).notNull(),
	requireReasonCancel: bit("require_reason_cancel").default(true).notNull(),
	retentionYears: int("retention_years"),
	defaultDateFilter: nvarchar("default_date_filter", { length: 32 }),
	defaultPageSize: int("default_page_size"),
	exportFormatsCsv: bit("export_formats_csv").default(true).notNull(),
	exportFormatsExcel: bit("export_formats_excel").default(true).notNull(),
	exportFormatsPdf: bit("export_formats_pdf").default(true).notNull(),
	maskPii: bit("mask_pii").default(true).notNull(),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__receipt___3213E83FA26480E9"}),
]);

export const receipts = mssqlTable("receipts", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	receiptNumber: nvarchar("receipt_number", { length: 64 }).notNull(),
	transactionId: int("transaction_id").references(() => transactions.id),
	donorId: int("donor_id").notNull().references(() => donors.id),
	amount: decimal({ precision: 18, scale: 2 }).notNull(),
	categoryId: int("category_id").references(() => donationCategories.id),
	receiptType: nvarchar("receipt_type", { length: 32 }).notNull(),
	financialYear: nvarchar("financial_year", { length: 16 }),
	pdfPath: nvarchar("pdf_path", { length: 512 }),
	is80g: bit("is_80g").default(true).notNull(),
	generatedAt: datetime2("generated_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	templateVersion: nvarchar("template_version", { length: 32 }),
	generatedBy: nvarchar("generated_by", { length: 128 }),
	deliveryStatusEmail: nvarchar("delivery_status_email", { length: 32 }),
	deliveryStatusSms: nvarchar("delivery_status_sms", { length: 32 }),
	status: nvarchar({ length: 32 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__receipts__3213E83FA24B973F"}),
	unique("UQ__receipts__89FE4B7559CA2AA5").on(table.receiptNumber)
]);

export const reconciliationBatches = mssqlTable("reconciliation_batches", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	gatewayProvider: nvarchar("gateway_provider", { length: 32 }).notNull(),
	periodStart: datetime2("period_start", { mode: 'string', precision: 3 }).notNull(),
	periodEnd: datetime2("period_end", { mode: 'string', precision: 3 }).notNull(),
	status: nvarchar({ length: 32 }).notNull(),
	matchedCount: int("matched_count").default(0).notNull(),
	mismatchCount: int("mismatch_count").default(0).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__reconcil__3213E83FE805A2D7"}),
]);

export const reconciliationSettings = mssqlTable("reconciliation_settings", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	autoFetchSettlements: bit("auto_fetch_settlements").default(true).notNull(),
	autoMatchSettlements: bit("auto_match_settlements").default(true).notNull(),
	matchStrategy: nvarchar("match_strategy", { length: 32 }),
	mismatchTolerance: decimal("mismatch_tolerance", { precision: 18, scale: 2 }),
	receiptMissingThreshold: int("receipt_missing_threshold"),
	webhookMissingThreshold: int("webhook_missing_threshold"),
	manualApprovalRequired: bit("manual_approval_required").default(true).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__reconcil__3213E83F8D99D8CA"}),
]);

export const refundRequests = mssqlTable("refund_requests", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	transactionId: int("transaction_id").notNull().references(() => transactions.id),
	amount: decimal({ precision: 18, scale: 2 }).notNull(),
	reason: nvarchar({ length: 'max' }).notNull(),
	status: nvarchar({ length: 32 }).notNull(),
	requestedByUserId: int("requested_by_user_id").references(() => users.id),
	approvedByUserId: int("approved_by_user_id").references(() => users.id),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__refund_r__3213E83F6FA8255B"}),
]);

export const rolePermissions = mssqlTable("role_permissions", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	roleId: int("role_id").notNull().references(() => userRoles.id),
	permissionKey: nvarchar("permission_key", { length: 128 }).notNull(),
	canCreate: bit("can_create").default(false).notNull(),
	canUpdate: bit("can_update").default(false).notNull(),
	canView: bit("can_view").default(true).notNull(),
	canDelete: bit("can_delete").default(false).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__role_per__3213E83F2A824CD1"}),
]);

export const sponsors = mssqlTable("sponsors", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 255 }).notNull(),
	logoUrl: nvarchar("logo_url", { length: 512 }),
	websiteUrl: nvarchar("website_url", { length: 512 }),
	contributionType: nvarchar("contribution_type", { length: 32 }),
	tier: nvarchar({ length: 32 }),
	displayOrder: int("display_order").default(0).notNull(),
	isActive: bit("is_active").default(true).notNull(),
	showOnHomepage: bit("show_on_homepage").default(false).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
	addedBy: nvarchar("added_by", { length: 128 }),
	featured: bit().default(false).notNull(),
	displayStartDate: date("display_start_date", { mode: 'string' }),
	displayEndDate: date("display_end_date", { mode: 'string' }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__sponsors__3213E83F7DE1E309"}),
]);

export const tBASICSETTING = mssqlTable("T_BASIC_SETTING", {
	id: int("Id").identity({ seed: 1 ,increment: 1 }),
	aramMailId: nvarchar("Aram_MailId", { length: 500 }),
	aramReplyToMailId: nvarchar("Aram_ReplyTo_MailId", { length: 500 }),
	aramCCMailId: nvarchar("Aram_CC_MailId", { length: 500 }),
	aramBCCMailId: nvarchar("Aram_BCC_MailId", { length: 'max' }),
	aramMailSubject: nvarchar("Aram_Mail_Subject", { length: 'max' }),
	serviceStartDate: datetime("Service_StartDate", { mode: 'string' }),
	serviceEndDate: datetime("Service_EndDate", { mode: 'string' }),
	status: bit("Status"),
	aramMailBody1: nvarchar("Aram_Mail_Body_1", { length: 'max' }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_BASIC_SETTING"}),
]);

export const tCFGERRORLOG = mssqlTable("T_CFG_ERRORLOG", {
	errorID: bigint("Error_ID", { mode: 'number' }).identity({ seed: 1 ,increment: 1 }),
	projectName: nvarchar("ProjectName", { length: 100 }),
	formName: nvarchar("FormName", { length: 100 }),
	customerID: nvarchar("CustomerID", { length: 100 }),
	processName: nvarchar("ProcessName", { length: 100 }),
	severity: nvarchar("Severity", { length: 50 }),
	errorDetails: nvarchar("ErrorDetails", { length: 'max' }),
	userName: nvarchar("UserName", { length: 50 }),
	recordStatus: nvarchar("RecordStatus", { length: 50 }),
	dataDate: datetime("Data_Date", { mode: 'string' }).defaultGetDate(),
	isDelete: bit("IsDelete").default(false),
}, (table) => [
	primaryKey({ columns: [table.errorID], name: "PK_ErrorLog"}),
]);

export const tCFGRecipients = mssqlTable("T_CFG_Recipients", {
	id: int("Id").identity({ seed: 1 ,increment: 1 }),
	institutionId: bigint("Institution_Id", { mode: 'number' }).notNull(),
	emailType: varchar("Email_Type", { length: 200 }).default(sql`NULL`),
	recipientType: varchar("Recipient_Type", { length: 100 }).default(sql`NULL`),
	fromEmail: varchar("FromEmail", { length: 500 }).default(sql`NULL`),
	toEmails: varchar("ToEmails", { length: 500 }),
	bcCs: varchar("BCCs", { length: 1000 }),
	cCs: varchar("CCs", { length: 1000 }),
	subject: varchar("Subject", { length: 500 }),
	signature: varchar("Signature", { length: 500 }),
	body: nvarchar("Body", { length: 'max' }),
	active: bit("Active"),
	deleteFlag: bit("Delete_Flag"),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__t_cfg_re__3214EC07BDCB69BF"}),
]);

export const tCountry = mssqlTable("T_Country", {
	id: int("Id").identity({ seed: 1 ,increment: 1 }),
	countryName: nvarchar("Country_Name", { length: 200 }),
	countryCode: nvarchar("Country_Code", { length: 10 }),
	isActive: bit("Is_Active"),
	createdBy: int("Created_By"),
	createdDate: datetime("Created_Date", { mode: 'string' }),
	isDeleted: bit("Is_Deleted"),
	modifiedBy: int("Modified_By"),
	modifiedDate: datetime("Modified_Date", { mode: 'string' }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_Country"}),
]);

export const tDONORCATEGORIES = mssqlTable("T_DONOR_CATEGORIES", {
	id: int("Id").identity({ seed: 1 ,increment: 1 }),
	accountNumber: nvarchar("Account_Number", { length: 30 }),
	donorTypes: nvarchar("Donor_Types", { length: 50 }),
	donationCode: nchar("Donation_Code", { length: 10 }),
	donationPageShow: bit("DonationPage_Show"),
	isActive: bit("Is_Active"),
	isDeleted: bit("Is_Deleted"),
	createdBy: int("Created_By"),
	createdDate: datetime("Created_Date", { mode: 'string' }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_DONOR_CATEGORIES"}),
]);

export const tEChallan = mssqlTable("T_EChallan", {
	id: int("Id").identity({ seed: 1 ,increment: 1 }),
	receiptNumber: nvarchar("Receipt_Number", { length: 50 }),
	donationTypes: int("Donation_Types").notNull(),
	accountNumber: nvarchar("Account_Number", { length: 25 }),
	nameOfDonor: nvarchar("Name_Of_Donor", { length: 100 }),
	address: nvarchar("Address", { length: 500 }),
	stateId: int("State_Id"),
	stateName: nvarchar("State_Name", { length: 100 }),
	countryId: int("Country_Id"),
	countryName: nvarchar("Country_Name", { length: 100 }),
	city: nvarchar("City", { length: 100 }),
	pincode: nvarchar("Pincode", { length: 6 }),
	telephoneNumber: nvarchar("Telephone_Number", { length: 15 }),
	mobileNumber: nvarchar("Mobile_Number", { length: 15 }),
	emailId: nvarchar("Email_Id", { length: 50 }),
	paymentMode: nvarchar("Payment_Mode", { length: 30 }),
	amount: decimal("Amount", { precision: 18, scale: 2 }),
	amountInWords: nvarchar("Amount_In_Words", { length: 'max' }),
	ddORChequeNumber: nvarchar("DD_OR_Cheque_Number", { length: 10 }),
	ddORChequeDate: datetime("DD_OR_Cheque_Date", { mode: 'string' }),
	ddORChequeBankName: nvarchar("DD_OR_Cheque_BankName", { length: 200 }),
	ddORChequeBranch: nvarchar("DD_OR_Cheque_Branch", { length: 200 }),
	paNcardNumber: nvarchar("PANcard_Number", { length: 50 }),
	location: nvarchar("Location", { length: 100 }),
	receiptDate: datetime("Receipt_Date", { mode: 'string' }),
	isActive: bit("Is_Active"),
	createdBy: int("Created_by"),
	createdDate: datetime("Created_Date", { mode: 'string' }),
	type: nvarchar("Type", { length: 10 }),
	transactionReferencePGINumber: nvarchar("Transaction_Reference_PGI_Number", { length: 100 }),
	bankReferenceNumber: nvarchar("Bank_Reference_Number", { length: 100 }),
	transactionAmount: decimal("Transaction_Amount", { precision: 18, scale: 2 }),
	bankId: nvarchar("Bank_Id", { length: 50 }),
	bankMerchantId: nvarchar("Bank_Merchant_Id", { length: 50 }),
	transactionType: nvarchar("Transaction_Type", { length: 50 }),
	authStatus: nvarchar("Auth_Status", { length: 50 }),
	transactionDate: nvarchar("Transaction_Date", { length: 100 }),
	authStatusMessage: nvarchar("Auth_Status_Message", { length: 100 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_EChallan"}),
	index("IDX_T_EChallan").on(table.donationTypes, table.receiptNumber, table.accountNumber, table.nameOfDonor, table.address, table.city, table.pincode, table.mobileNumber, table.emailId, table.paymentMode, table.amount, table.ddORChequeNumber, table.ddORChequeDate, table.paNcardNumber, table.receiptDate),
]);

export const tPaymentGatewayConfig = mssqlTable("T_Payment_Gateway_Config", {
	id: bigint("Id", { mode: 'number' }).identity({ seed: 1 ,increment: 1 }),
	settingName: nvarchar("Setting_Name", { length: 150 }).notNull(),
	settingValue: nvarchar("Setting_Value", { length: 500 }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_Payment_Gateway_Config"}),
]);

export const tPaymentOrderNo = mssqlTable("T_Payment_Order_No", {
	docTypeId: int("Doc_Type_Id").identity({ seed: 1 ,increment: 1 }),
	docType: varchar("Doc_Type", { length: 3 }).notNull(),
	financialYear: varchar("Financial_Year", { length: 9 }).notNull(),
	institutionId: int("Institution_Id").notNull(),
	startingNo: int("Starting_No").notNull(),
	latestNo: int("Latest_No").notNull(),
	moduleTag: varchar("Module_Tag", { length: 15 }).notNull(),
	createdBy: bigint("Created_By", { mode: 'number' }).notNull(),
	createdDate: datetime("Created_Date", { mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.docTypeId], name: "PK_T_Payment_Order_No"}),
]);

export const tPaymentTransaction = mssqlTable("T_Payment_Transaction", {
	id: bigint("Id", { mode: 'number' }).identity({ seed: 1 ,increment: 1 }),
	eChallanId: int("EChallan_Id"),
	feeType: nvarchar("Fee_Type", { length: 50 }),
	orderId: nvarchar("OrderId", { length: 50 }),
	paymentAmt: nvarchar("PaymentAmt", { length: 50 }),
	mid: nvarchar("MID", { length: 50 }),
	mkey: nvarchar("MKEY", { length: 50 }),
	paytmParams: nvarchar({ length: 'max' }),
	signature: nvarchar("Signature", { length: 2000 }),
	paytmUrl: nvarchar("PaytmUrl", { length: 500 }),
	token: nvarchar("Token", { length: 250 }),
	paymentUrl: nvarchar("PaymentUrl", { length: 500 }),
	initiatedTime: datetime("Initiated_Time", { mode: 'string' }),
	currency: nvarchar("CURRENCY", { length: 5 }),
	gatewayname: nvarchar("GATEWAYNAME", { length: 20 }),
	respmsg: nvarchar("RESPMSG", { length: 500 }),
	bankname: nvarchar("BANKNAME", { length: 150 }),
	paymentmode: nvarchar("PAYMENTMODE", { length: 20 }),
	respcode: nvarchar("RESPCODE", { length: 20 }),
	txnid: nvarchar("TXNID", { length: 80 }),
	txnamount: nvarchar("TXNAMOUNT", { length: 25 }),
	txnSTATUS: nvarchar("TXN_STATUS", { length: 20 }),
	banktxnid: nvarchar("BANKTXNID", { length: 150 }),
	txndate: datetime("TXNDATE", { mode: 'string' }),
	checksumhash: nvarchar("CHECKSUMHASH", { length: 250 }),
	validateCheckSum: nvarchar("ValidateCheckSum", { length: 25 }),
	responseTimeStamp: nvarchar("ResponseTimeStamp", { length: 'max' }),
	version: nvarchar("Version", { length: 50 }),
	txntype: nvarchar("TXNTYPE", { length: 50 }),
	statusFlag: bit("Status_Flag"),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_Payment_Transaction"}),
]);

export const tRazorpayTransaction = mssqlTable("T_Razorpay_Transaction", {
	id: bigint("Id", { mode: 'number' }).identity({ seed: 1 ,increment: 1 }),
	eChallanId: bigint("EChallan_Id", { mode: 'number' }).notNull(),
	feeType: nvarchar("Fee_Type", { length: 50 }),
	orderId: nvarchar("OrderId", { length: 50 }),
	paymentAmt: nvarchar("PaymentAmt", { length: 50 }),
	mid: nvarchar("MID", { length: 50 }),
	mkey: nvarchar("MKEY", { length: 50 }),
	orderIdParams: nvarchar("OrderIdParams", { length: 'max' }),
	rPayParams: nvarchar("RPayParams", { length: 'max' }),
	rPayOrderId: nvarchar("RPayOrderId", { length: 50 }),
	initiatedTime: datetime("Initiated_Time", { mode: 'string' }),
	currency: nvarchar("CURRENCY", { length: 5 }),
	gatewayname: nvarchar("GATEWAYNAME", { length: 20 }),
	respmsg: nvarchar("RESPMSG", { length: 'max' }),
	rPayPaymentId: nvarchar("RPayPaymentId", { length: 50 }),
	rpaySignature: nvarchar("RpaySignature", { length: 2000 }),
	validateSignature: nvarchar("ValidateSignature", { length: 25 }),
	txnSTATUS: nvarchar("TXN_STATUS", { length: 20 }),
	txndate: datetime("TXNDATE", { mode: 'string' }),
	bankname: nvarchar("BANKNAME", { length: 150 }),
	paymentmode: nvarchar("PAYMENTMODE", { length: 20 }),
	respcode: nvarchar("RESPCODE", { length: 20 }),
	txnid: nvarchar("TXNID", { length: 80 }),
	txnamount: nvarchar("TXNAMOUNT", { length: 25 }),
	txncharge: nvarchar("TXNCHARGE", { length: 25 }),
	banktxnid: nvarchar("BANKTXNID", { length: 150 }),
	checksumhash: nvarchar("CHECKSUMHASH", { length: 250 }),
	validateCheckSum: nvarchar("ValidateCheckSum", { length: 25 }),
	responseTimeStamp: nvarchar("ResponseTimeStamp", { length: 'max' }),
	version: nvarchar("Version", { length: 50 }),
	txntype: nvarchar("TXNTYPE", { length: 50 }),
	statusFlag: bit("Status_Flag"),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_Razorpay_Transaction"}),
]);

export const tState = mssqlTable("T_State", {
	id: int("Id").identity({ seed: 1 ,increment: 1 }),
	countryId: int("Country_Id"),
	stateName: nvarchar("State_Name", { length: 200 }),
	isActive: bit("Is_Active"),
	createdBy: int("Created_By"),
	createdDate: datetime("Created_Date", { mode: 'string' }),
	isDeleted: bit("Is_Deleted"),
	modifiedBy: int("Modified_By"),
	modifiedDate: datetime("Modified_Date", { mode: 'string' }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_State"}),
]);

export const tUSER = mssqlTable("T_USER", {
	id: int("Id").identity({ seed: 1 ,increment: 1 }),
	name: nvarchar("Name", { length: 100 }),
	userType: nvarchar("User_Type", { length: 30 }),
	userName: nvarchar("User_Name", { length: 100 }),
	password: nvarchar("Password", { length: 50 }),
	mobileNumber: nvarchar("Mobile_Number", { length: 15 }),
	location: nvarchar("Location", { length: 300 }),
	eMail: nvarchar("E_Mail", { length: 100 }),
	isActive: bit("Is_Active"),
	createdBy: int("Created_By"),
	createdDate: datetime("Created_Date", { mode: 'string' }),
	isDeleted: bit("Is_Deleted"),
	modifiedBy: int("Modified_By"),
	modifiedDate: datetime("Modified_Date", { mode: 'string' }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_USER"}),
]);

export const tUserActivites = mssqlTable("T_User_Activites", {
	id: int("Id").identity({ seed: 1 ,increment: 1 }),
	eChallanId: int("EChallan_Id"),
	type: nvarchar("Type", { length: 50 }),
	doneBy: int("Done_By"),
	currentDate: nvarchar("CurrentDate", { length: 20 }),
	currentTime: nvarchar("CurrentTime", { length: 20 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK_T_User_Activites"}),
]);

export const transactions = mssqlTable("transactions", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	paymentId: nvarchar("payment_id", { length: 128 }),
	orderId: nvarchar("order_id", { length: 128 }),
	donorId: int("donor_id").notNull().references(() => donors.id),
	amount: decimal({ precision: 18, scale: 2 }).notNull(),
	gatewayFee: decimal("gateway_fee", { precision: 18, scale: 2, mode: 'number' }).default(0).notNull(),
	netAmount: decimal("net_amount", { precision: 18, scale: 2 }),
	currency: nvarchar({ length: 3 }).default(sql`N'INR'`).notNull(),
	status: nvarchar({ length: 32 }).notNull(),
	paymentMethod: nvarchar("payment_method", { length: 32 }),
	donationCategoryId: int("donation_category_id").references(() => donationCategories.id),
	campaignId: int("campaign_id").references(() => campaigns.id),
	receiptId: int("receipt_id").references(() => receipts.id),
	gatewayProvider: nvarchar("gateway_provider", { length: 32 }),
	gatewayResponse: nvarchar("gateway_response", { length: 'max' }),
	isRecurring: bit("is_recurring").default(false).notNull(),
	isOffline: bit("is_offline").default(false).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__transact__3213E83FA21C2484"}),
]);

export const userOtp = mssqlTable("user_otp", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	userId: int("user_id").references(() => users.id),
	email: nvarchar({ length: 255 }),
	phone: nvarchar({ length: 20 }),
	otpCode: nvarchar("otp_code", { length: 10 }).notNull(),
	expiresAt: datetime2("expires_at", { mode: 'string', precision: 3 }).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__user_otp__3213E83F34FAD49A"}),
]);

export const userRoles = mssqlTable("user_roles", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 64 }).notNull(),
	description: nvarchar({ length: 255 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__user_rol__3213E83F17DDE973"}),
	unique("UQ__user_rol__72E12F1B2C0B7CB5").on(table.name)
]);

export const users = mssqlTable("users", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	email: nvarchar({ length: 255 }).notNull(),
	password: nvarchar({ length: 255 }).notNull(),
	name: nvarchar({ length: 255 }),
	roleId: int("role_id").references(() => userRoles.id),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__users__3213E83F6FBDA42A"}),
	unique("UQ__users__AB6E616497F78EB8").on(table.email)
]);

export const webhookLog = mssqlTable("webhook_log", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	gateway: nvarchar({ length: 32 }).notNull(),
	eventType: nvarchar("event_type", { length: 128 }),
	paymentId: nvarchar("payment_id", { length: 128 }),
	status: nvarchar({ length: 32 }),
	signatureValid: bit("signature_valid"),
	notes: nvarchar({ length: 'max' }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__webhook___3213E83F3D219E31"}),
]);

export const websiteContent = mssqlTable("website_content", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	sectionKey: nvarchar("section_key", { length: 64 }).notNull(),
	contentJson: nvarchar("content_json", { length: 'max' }).notNull(),
	version: int().default(1).notNull(),
	publishedAt: datetime2("published_at", { mode: 'string', precision: 3 }),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
	name: nvarchar({ length: 128 }),
	slug: nvarchar({ length: 128 }),
	status: nvarchar({ length: 32 }),
	modifiedBy: nvarchar("modified_by", { length: 128 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__website___3213E83F66E44988"}),
]);

export const websitePageSections = mssqlTable("website_page_sections", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	pageId: int("page_id").notNull().references(() => websitePages.id),
	sectionKey: nvarchar("section_key", { length: 64 }).notNull(),
	sectionName: nvarchar("section_name", { length: 128 }),
	sectionConfigJson: nvarchar("section_config_json", { length: 'max' }),
	enabled: bit().default(true).notNull(),
	sortOrder: int("sort_order").default(0).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__website___3213E83F8CE1B03C"}),
]);

export const websitePages = mssqlTable("website_pages", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 128 }).notNull(),
	slug: nvarchar({ length: 128 }).notNull(),
	status: nvarchar({ length: 32 }).default(sql`N'Draft'`).notNull(),
	lastModified: datetime2("last_modified", { mode: 'string', precision: 3 }),
	modifiedBy: nvarchar("modified_by", { length: 128 }),
	version: int().default(1).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__website___3213E83F5CF9854E"}),
]);

export const websiteTeamMembers = mssqlTable("website_team_members", {
	id: int().identity({ seed: 1 ,increment: 1 }),
	name: nvarchar({ length: 255 }).notNull(),
	designation: nvarchar({ length: 128 }),
	photoUrl: nvarchar("photo_url", { length: 512 }),
	bio: nvarchar({ length: 'max' }),
	socialLinksJson: nvarchar("social_links_json", { length: 'max' }),
	displayOrder: int("display_order").default(0).notNull(),
	isActive: bit("is_active").default(true).notNull(),
	createdAt: datetime2("created_at", { mode: 'string', precision: 3 }).default(sql`getdate()`),
	updatedAt: datetime2("updated_at", { mode: 'string', precision: 3 }),
}, (table) => [
	primaryKey({ columns: [table.id], name: "PK__website___3213E83F3EA77801"}),
]);
export const allPGIData638 = mssqlView("All-PGI-Data638", {	id: int("Id").notNull(),
	receiptNumber: nvarchar("Receipt_Number"),
	donationType: varchar("Donation Type"),
	accountNumber: nvarchar("Account_Number"),
	nameOfDonor: nvarchar("Name_Of_Donor"),
	address: nvarchar("Address"),
	stateId: int("State_Id"),
	stateName: nvarchar("State_Name"),
	countryId: int("Country_Id"),
	countryName: nvarchar("Country_Name"),
	city: nvarchar("City"),
	pincode: nvarchar("Pincode"),
	telephoneNumber: nvarchar("Telephone_Number"),
	mobileNumber: nvarchar("Mobile_Number"),
	emailId: nvarchar("Email_Id"),
	paymentMode: nvarchar("Payment_Mode"),
	amount: decimal("Amount", {}),
	amountInWords: nvarchar("Amount_In_Words"),
	ddORChequeNumber: nvarchar("DD_OR_Cheque_Number"),
	ddORChequeDate: datetime("DD_OR_Cheque_Date", { mode: 'string' }),
	ddORChequeBankName: nvarchar("DD_OR_Cheque_BankName"),
	ddORChequeBranch: nvarchar("DD_OR_Cheque_Branch"),
	paNcardNumber: nvarchar("PANcard_Number"),
	location: nvarchar("Location"),
	receiptDate: datetime("Receipt_Date", { mode: 'string' }),
	isActive: bit("Is_Active"),
	createdBy: int("Created_by"),
	createdDate: datetime("Created_Date", { mode: 'string' }),
	type: nvarchar("Type"),
	transactionReferencePGINumber: nvarchar("Transaction_Reference_PGI_Number"),
	bankReferenceNumber: nvarchar("Bank_Reference_Number"),
	transactionAmount: decimal("Transaction_Amount", {}),
	bankId: nvarchar("Bank_Id"),
	bankMerchantId: nvarchar("Bank_Merchant_Id"),
	transactionType: nvarchar("Transaction_Type"),
	authStatus: nvarchar("Auth_Status"),
	transactionDate: nvarchar("Transaction_Date"),
	authStatusMessage: nvarchar("Auth_Status_Message"),
}).with({"encryption":false,"schemaBinding":false,"viewMetadata":false,"checkOption":false}).as(sql`SELECT        Id, Receipt_Number, 
                         CASE Donation_Types WHEN '1' THEN 'General Fund' WHEN '2' THEN 'Education Fund' WHEN '3' THEN 'Building Fund' WHEN '4' THEN 'Medical Fund' WHEN '5' THEN 'Aram Sei Fund' END AS 'Donation Type', 
                         Account_Number, Name_Of_Donor, Address, State_Id, State_Name, Country_Id, Country_Name, City, Pincode, Telephone_Number, Mobile_Number, Email_Id, Payment_Mode, Amount, Amount_In_Words, 
                         DD_OR_Cheque_Number, DD_OR_Cheque_Date, DD_OR_Cheque_BankName, DD_OR_Cheque_Branch, PANcard_Number, Location, Receipt_Date, Is_Active, Created_by, Created_Date, Type, 
                         Transaction_Reference_PGI_Number, Bank_Reference_Number, Transaction_Amount, Bank_Id, Bank_Merchant_Id, Transaction_Type, Auth_Status, Transaction_Date, Auth_Status_Message
FROM            dbo.T_EChallan`);