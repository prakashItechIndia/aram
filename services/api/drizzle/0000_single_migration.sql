-- =============================================================================
-- ARAM Backend – Single migration file (run manually in SQL Server)
-- Tables and columns from: ARAM admin/donor BRDs, apps (admin + donor),
-- Aram_Foundation_Admin_Portal_User_Stories.xlsx, Aram_Foundation_User_Stories - User side.xlsx.
--
-- RULES (do not recreate existing tables):
--   • If table DOES NOT exist → CREATE TABLE (only then).
--   • If table ALREADY exists (e.g. T_USER, T_State, T_EChallan, etc.) → skip
--     CREATE; only ADD missing columns via ALTER TABLE (each column guarded
--     by IF NOT EXISTS on sys.columns).
-- Safe to re-run: idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. user_roles (RBAC – referenced by users)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_roles')
BEGIN
  CREATE TABLE [dbo].[user_roles] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(64) NOT NULL UNIQUE,
    [description] NVARCHAR(255) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 2. users (Admin portal authentication)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
  CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [email] NVARCHAR(255) NOT NULL UNIQUE,
    [password] NVARCHAR(255) NOT NULL,
    [name] NVARCHAR(255) NULL,
    [role_id] INT NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL,
    CONSTRAINT [FK_users_role] FOREIGN KEY ([role_id]) REFERENCES [dbo].[user_roles]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- 3. donors (Donor profiles – admin + donor portal)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'donors')
BEGIN
  CREATE TABLE [dbo].[donors] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [mobile] NVARCHAR(20) NULL,
    [pan] NVARCHAR(10) NULL,
    [address] NVARCHAR(MAX) NULL,
    [country] NVARCHAR(128) NULL DEFAULT N'India',
    [state] NVARCHAR(128) NULL,
    [pincode] NVARCHAR(20) NULL,
    [status] NVARCHAR(32) NULL,
    [tags] NVARCHAR(MAX) NULL,
    [first_donation_at] DATETIME2(3) NULL,
    [last_donation_at] DATETIME2(3) NULL,
    [total_donated] DECIMAL(18,2) NOT NULL DEFAULT 0,
    [donation_count] INT NOT NULL DEFAULT 0,
    [is_guest] BIT NOT NULL DEFAULT 0,
    [password_hash] NVARCHAR(255) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 4. donation_categories (Master data)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'donation_categories')
BEGIN
  CREATE TABLE [dbo].[donation_categories] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [category_code] NVARCHAR(32) NOT NULL UNIQUE,
    [display_name] NVARCHAR(128) NOT NULL,
    [public_visibility] BIT NOT NULL DEFAULT 1,
    [sort_order] INT NOT NULL DEFAULT 0,
    [is_80g_eligible] BIT NOT NULL DEFAULT 1,
    [suggested_amounts] NVARCHAR(MAX) NULL,
    [is_deleted] BIT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 5. campaigns (Phase 2 – Campaign management)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'campaigns')
BEGIN
  CREATE TABLE [dbo].[campaigns] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(128) NOT NULL,
    [public_title] NVARCHAR(255) NULL,
    [campaign_code] NVARCHAR(32) NOT NULL UNIQUE,
    [donation_category_id] INT NULL,
    [campaign_type] NVARCHAR(32) NULL,
    [target_amount] DECIMAL(18,2) NULL,
    [current_amount] DECIMAL(18,2) NOT NULL DEFAULT 0,
    [donor_count_target] INT NULL,
    [show_progress_on_public] BIT NOT NULL DEFAULT 1,
    [is_active] BIT NOT NULL DEFAULT 1,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL,
    CONSTRAINT [FK_campaigns_category] FOREIGN KEY ([donation_category_id]) REFERENCES [dbo].[donation_categories]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- 6. receipts (Unified receipt engine – transaction_id FK added after table 7)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'receipts')
BEGIN
  CREATE TABLE [dbo].[receipts] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [receipt_number] NVARCHAR(64) NOT NULL UNIQUE,
    [transaction_id] INT NULL,
    [donor_id] INT NOT NULL,
    [amount] DECIMAL(18,2) NOT NULL,
    [category_id] INT NULL,
    [receipt_type] NVARCHAR(32) NOT NULL,
    [financial_year] NVARCHAR(16) NULL,
    [pdf_path] NVARCHAR(512) NULL,
    [is_80g] BIT NOT NULL DEFAULT 1,
    [generated_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_receipts_donor] FOREIGN KEY ([donor_id]) REFERENCES [dbo].[donors]([id]),
    CONSTRAINT [FK_receipts_category] FOREIGN KEY ([category_id]) REFERENCES [dbo].[donation_categories]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- 7. transactions (Payments / donations)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'transactions')
BEGIN
  CREATE TABLE [dbo].[transactions] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [payment_id] NVARCHAR(128) NULL,
    [order_id] NVARCHAR(128) NULL,
    [donor_id] INT NOT NULL,
    [amount] DECIMAL(18,2) NOT NULL,
    [gateway_fee] DECIMAL(18,2) NOT NULL DEFAULT 0,
    [net_amount] DECIMAL(18,2) NULL,
    [currency] NVARCHAR(3) NOT NULL DEFAULT N'INR',
    [status] NVARCHAR(32) NOT NULL,
    [payment_method] NVARCHAR(32) NULL,
    [donation_category_id] INT NULL,
    [campaign_id] INT NULL,
    [receipt_id] INT NULL,
    [gateway_provider] NVARCHAR(32) NULL,
    [gateway_response] NVARCHAR(MAX) NULL,
    [is_recurring] BIT NOT NULL DEFAULT 0,
    [is_offline] BIT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL,
    CONSTRAINT [FK_transactions_donor] FOREIGN KEY ([donor_id]) REFERENCES [dbo].[donors]([id]),
    CONSTRAINT [FK_transactions_category] FOREIGN KEY ([donation_category_id]) REFERENCES [dbo].[donation_categories]([id]),
    CONSTRAINT [FK_transactions_campaign] FOREIGN KEY ([campaign_id]) REFERENCES [dbo].[campaigns]([id]),
    CONSTRAINT [FK_transactions_receipt] FOREIGN KEY ([receipt_id]) REFERENCES [dbo].[receipts]([id])
  );
END
GO

-- FK from receipts to transactions (add after both tables exist)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'transactions') AND EXISTS (SELECT * FROM sys.tables WHERE name = 'receipts')
  AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_receipts_transaction')
BEGIN
  ALTER TABLE [dbo].[receipts] ADD CONSTRAINT [FK_receipts_transaction] FOREIGN KEY ([transaction_id]) REFERENCES [dbo].[transactions]([id]);
END
GO

-- -----------------------------------------------------------------------------
-- 8. donation_form_settings (Versioned form config)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'donation_form_settings')
BEGIN
  CREATE TABLE [dbo].[donation_form_settings] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [version] NVARCHAR(32) NOT NULL,
    [config_json] NVARCHAR(MAX) NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [created_by] NVARCHAR(128) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 9. feature_config (Feature flags / key-value)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'feature_config')
BEGIN
  CREATE TABLE [dbo].[feature_config] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [key] NVARCHAR(128) NOT NULL UNIQUE,
    [value] NVARCHAR(MAX) NULL,
    [is_enabled] BIT NOT NULL DEFAULT 1,
    [updated_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_by] NVARCHAR(128) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 10. payment_gateway_settings (Gateway config)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'payment_gateway_settings')
BEGIN
  CREATE TABLE [dbo].[payment_gateway_settings] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [provider] NVARCHAR(32) NOT NULL,
    [environment] NVARCHAR(16) NOT NULL,
    [api_key_encrypted] NVARCHAR(MAX) NULL,
    [api_secret_encrypted] NVARCHAR(MAX) NULL,
    [webhook_secret] NVARCHAR(255) NULL,
    [merchant_id] NVARCHAR(128) NULL,
    [gateway_fee_config] NVARCHAR(MAX) NULL,
    [retry_policy] NVARCHAR(MAX) NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 11. refund_requests (Refunds + approval for >10k)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'refund_requests')
BEGIN
  CREATE TABLE [dbo].[refund_requests] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [transaction_id] INT NOT NULL,
    [amount] DECIMAL(18,2) NOT NULL,
    [reason] NVARCHAR(MAX) NOT NULL,
    [status] NVARCHAR(32) NOT NULL,
    [requested_by_user_id] INT NULL,
    [approved_by_user_id] INT NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL,
    CONSTRAINT [FK_refund_requests_transaction] FOREIGN KEY ([transaction_id]) REFERENCES [dbo].[transactions]([id]),
    CONSTRAINT [FK_refund_requests_requested_by] FOREIGN KEY ([requested_by_user_id]) REFERENCES [dbo].[users]([id]),
    CONSTRAINT [FK_refund_requests_approved_by] FOREIGN KEY ([approved_by_user_id]) REFERENCES [dbo].[users]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- 12. enquiries (Contact form / Communications inbox)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'enquiries')
BEGIN
  CREATE TABLE [dbo].[enquiries] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [organization] NVARCHAR(255) NULL,
    [subject] NVARCHAR(255) NULL,
    [message] NVARCHAR(MAX) NULL,
    [status] NVARCHAR(32) NOT NULL,
    [assigned_to_user_id] INT NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL,
    CONSTRAINT [FK_enquiries_assigned_to] FOREIGN KEY ([assigned_to_user_id]) REFERENCES [dbo].[users]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- 13. communication_templates (Email / SMS templates)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'communication_templates')
BEGIN
  CREATE TABLE [dbo].[communication_templates] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(128) NOT NULL,
    [category] NVARCHAR(32) NULL,
    [type] NVARCHAR(16) NOT NULL,
    [subject] NVARCHAR(255) NULL,
    [body_content] NVARCHAR(MAX) NULL,
    [variables_json] NVARCHAR(MAX) NULL,
    [dlt_template_id] NVARCHAR(64) NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 14. e_challans (Offline donations – E-Challan entry)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'e_challans')
BEGIN
  CREATE TABLE [dbo].[e_challans] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [challan_number] NVARCHAR(64) NOT NULL,
    [donor_id] INT NOT NULL,
    [amount] DECIMAL(18,2) NOT NULL,
    [category_id] INT NULL,
    [cheque_number] NVARCHAR(64) NULL,
    [payment_mode] NVARCHAR(32) NOT NULL,
    [donation_date] DATE NOT NULL,
    [receipt_id] INT NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [created_by_user_id] INT NULL,
    CONSTRAINT [FK_e_challans_donor] FOREIGN KEY ([donor_id]) REFERENCES [dbo].[donors]([id]),
    CONSTRAINT [FK_e_challans_category] FOREIGN KEY ([category_id]) REFERENCES [dbo].[donation_categories]([id]),
    CONSTRAINT [FK_e_challans_receipt] FOREIGN KEY ([receipt_id]) REFERENCES [dbo].[receipts]([id]),
    CONSTRAINT [FK_e_challans_created_by] FOREIGN KEY ([created_by_user_id]) REFERENCES [dbo].[users]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- 15. audit_log (User activity – Super Admin)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'audit_log')
BEGIN
  CREATE TABLE [dbo].[audit_log] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NULL,
    [action] NVARCHAR(64) NOT NULL,
    [entity_type] NVARCHAR(64) NULL,
    [entity_id] NVARCHAR(64) NULL,
    [details_json] NVARCHAR(MAX) NULL,
    [ip_address] NVARCHAR(45) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_audit_log_user] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- 16. admin_notifications (Dashboard alerts)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'admin_notifications')
BEGIN
  CREATE TABLE [dbo].[admin_notifications] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [type] NVARCHAR(32) NOT NULL,
    [title] NVARCHAR(255) NOT NULL,
    [message] NVARCHAR(MAX) NULL,
    [read_at] DATETIME2(3) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE()
  );
END
GO

-- -----------------------------------------------------------------------------
-- 17. user_otp (2FA / OTP verification)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_otp')
BEGIN
  CREATE TABLE [dbo].[user_otp] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NULL,
    [email] NVARCHAR(255) NULL,
    [phone] NVARCHAR(20) NULL,
    [otp_code] NVARCHAR(10) NOT NULL,
    [expires_at] DATETIME2(3) NOT NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_user_otp_user] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- 18. reconciliation_batches (Payments reconciliation)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reconciliation_batches')
BEGIN
  CREATE TABLE [dbo].[reconciliation_batches] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [gateway_provider] NVARCHAR(32) NOT NULL,
    [period_start] DATETIME2(3) NOT NULL,
    [period_end] DATETIME2(3) NOT NULL,
    [status] NVARCHAR(32) NOT NULL,
    [matched_count] INT NOT NULL DEFAULT 0,
    [mismatch_count] INT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE()
  );
END
GO

-- -----------------------------------------------------------------------------
-- 19. website_content (CMS – Phase 2)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'website_content')
BEGIN
  CREATE TABLE [dbo].[website_content] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [section_key] NVARCHAR(64) NOT NULL,
    [content_json] NVARCHAR(MAX) NOT NULL,
    [version] INT NOT NULL DEFAULT 1,
    [published_at] DATETIME2(3) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 20. sponsors (Website – Phase 3)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'sponsors')
BEGIN
  CREATE TABLE [dbo].[sponsors] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [logo_url] NVARCHAR(512) NULL,
    [website_url] NVARCHAR(512) NULL,
    [contribution_type] NVARCHAR(32) NULL,
    [tier] NVARCHAR(32) NULL,
    [display_order] INT NOT NULL DEFAULT 0,
    [is_active] BIT NOT NULL DEFAULT 1,
    [show_on_homepage] BIT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 21. gallery (Website – Phase 3)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'gallery')
BEGIN
  CREATE TABLE [dbo].[gallery] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [title] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [alt_text] NVARCHAR(255) NULL,
    [image_path] NVARCHAR(512) NOT NULL,
    [album_id] INT NULL,
    [tags_json] NVARCHAR(MAX) NULL,
    [sort_order] INT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- 22. export_log (Report export audit)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'export_log')
BEGIN
  CREATE TABLE [dbo].[export_log] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NULL,
    [report_type] NVARCHAR(64) NULL,
    [format] NVARCHAR(16) NULL,
    [ip_address] NVARCHAR(45) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_export_log_user] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id])
  );
END
GO

-- =============================================================================
-- LEGACY TABLES (from EChallan-AramFoundation-WebwithPGI and SAI_ARAM)
-- Uppercase table names and PascalCase_Underscore columns for consistency.
-- Existing tables (e.g. in Dev_SaiAram_Echallan) are NOT recreated; CREATE
-- runs only when the table does not exist. No ALTER on legacy tables here.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- T_USER (Admin users – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_USER')
BEGIN
  CREATE TABLE [dbo].[T_USER] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(100) NULL,
    [User_Type] NVARCHAR(30) NULL,
    [User_Name] NVARCHAR(100) NULL,
    [Password] NVARCHAR(50) NULL,
    [Mobile_Number] NVARCHAR(15) NULL,
    [Location] NVARCHAR(300) NULL,
    [E_Mail] NVARCHAR(100) NULL,
    [Is_Active] BIT NULL,
    [Created_By] INT NULL,
    [Created_Date] DATETIME2(3) NULL,
    [Is_Deleted] BIT NULL,
    [Modified_By] INT NULL,
    [Modified_Date] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_Country (Countries master – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_Country')
BEGIN
  CREATE TABLE [dbo].[T_Country] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Country_Name] NVARCHAR(128) NULL,
    [Country_Code] NVARCHAR(16) NULL,
    [Is_Active] BIT NULL,
    [Created_By] INT NULL,
    [Created_Date] DATETIME2(3) NULL,
    [Is_Deleted] BIT NULL,
    [Modified_By] INT NULL,
    [Modified_Date] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_State (States master – legacy, FK to T_Country)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_State')
BEGIN
  CREATE TABLE [dbo].[T_State] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Country_Id] INT NULL,
    [State_Name] NVARCHAR(128) NULL,
    [Is_Active] BIT NULL,
    [Created_By] INT NULL,
    [Created_Date] DATETIME2(3) NULL,
    [Is_Deleted] BIT NULL,
    [Modified_By] INT NULL,
    [Modified_Date] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_DONOR_CATEGORIES (Donation categories – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_DONOR_CATEGORIES')
BEGIN
  CREATE TABLE [dbo].[T_DONOR_CATEGORIES] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Account_Number] NVARCHAR(64) NULL,
    [Donor_Types] NVARCHAR(64) NULL,
    [Donation_Code] NVARCHAR(32) NULL,
    [DonationPage_Show] BIT NULL,
    [Is_Active] BIT NULL,
    [Is_Deleted] BIT NULL,
    [Created_By] INT NULL,
    [Created_Date] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_EChallan (E-Challan / offline donations – legacy, full column set from old apps)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_EChallan')
BEGIN
  CREATE TABLE [dbo].[T_EChallan] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Receipt_Number] NVARCHAR(64) NULL,
    [Donation_Types] INT NOT NULL DEFAULT 0,
    [Account_Number] NVARCHAR(64) NULL,
    [Name_Of_Donor] NVARCHAR(255) NULL,
    [Address] NVARCHAR(MAX) NULL,
    [State_Id] INT NULL,
    [State_Name] NVARCHAR(128) NULL,
    [Country_Id] INT NULL,
    [Country_Name] NVARCHAR(128) NULL,
    [City] NVARCHAR(128) NULL,
    [Pincode] NVARCHAR(20) NULL,
    [Telephone_Number] NVARCHAR(20) NULL,
    [Mobile_Number] NVARCHAR(20) NULL,
    [Email_Id] NVARCHAR(255) NULL,
    [Payment_Mode] NVARCHAR(32) NULL,
    [Amount] DECIMAL(18,2) NULL,
    [Amount_In_Words] NVARCHAR(255) NULL,
    [DD_OR_Cheque_Number] NVARCHAR(64) NULL,
    [DD_OR_Cheque_Date] DATETIME2(3) NULL,
    [DD_OR_Cheque_BankName] NVARCHAR(128) NULL,
    [DD_OR_Cheque_Branch] NVARCHAR(128) NULL,
    [PANcard_Number] NVARCHAR(10) NULL,
    [Location] NVARCHAR(300) NULL,
    [Receipt_Date] DATETIME2(3) NULL,
    [Is_Active] BIT NULL,
    [Created_by] INT NULL,
    [Created_Date] DATETIME2(3) NULL,
    [Type] NVARCHAR(32) NULL,
    [Transaction_Reference_PGI_Number] NVARCHAR(64) NULL,
    [Bank_Reference_Number] NVARCHAR(64) NULL,
    [Transaction_Amount] DECIMAL(18,2) NULL,
    [Bank_Id] NVARCHAR(64) NULL,
    [Bank_Merchant_Id] NVARCHAR(64) NULL,
    [Transaction_Type] NVARCHAR(32) NULL,
    [Auth_Status] NVARCHAR(32) NULL,
    [Transaction_Date] NVARCHAR(32) NULL,
    [Auth_Status_Message] NVARCHAR(255) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_BASIC_SETTING (Email / basic settings – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_BASIC_SETTING')
BEGIN
  CREATE TABLE [dbo].[T_BASIC_SETTING] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Aram_MailId] NVARCHAR(255) NULL,
    [Aram_ReplyTo_MailId] NVARCHAR(255) NULL,
    [Aram_CC_MailId] NVARCHAR(255) NULL,
    [Aram_BCC_MailId] NVARCHAR(255) NULL,
    [Aram_Mail_Subject] NVARCHAR(255) NULL,
    [Service_StartDate] DATETIME2(3) NULL,
    [Service_EndDate] DATETIME2(3) NULL,
    [Status] BIT NULL,
    [Aram_Mail_Body_1] NVARCHAR(MAX) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_CFG_Recipients (Email recipients config – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_CFG_Recipients')
BEGIN
  CREATE TABLE [dbo].[T_CFG_Recipients] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Institution_Id] BIGINT NOT NULL,
    [Email_Type] NVARCHAR(64) NULL,
    [Recipient_Type] NVARCHAR(64) NULL,
    [FromEmail] NVARCHAR(255) NULL,
    [ToEmails] NVARCHAR(MAX) NULL,
    [BCCs] NVARCHAR(MAX) NULL,
    [CCs] NVARCHAR(MAX) NULL,
    [Subject] NVARCHAR(255) NULL,
    [Signature] NVARCHAR(MAX) NULL,
    [Body] NVARCHAR(MAX) NULL,
    [Active] BIT NULL,
    [Delete_Flag] BIT NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_CFG_ERRORLOG (Error logging – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_CFG_ERRORLOG')
BEGIN
  CREATE TABLE [dbo].[T_CFG_ERRORLOG] (
    [Error_ID] BIGINT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [ProjectName] NVARCHAR(128) NULL,
    [FormName] NVARCHAR(128) NULL,
    [CustomerID] NVARCHAR(64) NULL,
    [ProcessName] NVARCHAR(128) NULL,
    [Severity] NVARCHAR(32) NULL,
    [ErrorDetails] NVARCHAR(MAX) NULL,
    [UserName] NVARCHAR(128) NULL,
    [RecordStatus] NVARCHAR(32) NULL,
    [Data_Date] DATETIME2(3) NULL,
    [IsDelete] BIT NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_Payment_Gateway_Config (Gateway key-value – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_Payment_Gateway_Config')
BEGIN
  CREATE TABLE [dbo].[T_Payment_Gateway_Config] (
    [Id] BIGINT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [Setting_Name] NVARCHAR(128) NULL,
    [Setting_Value] NVARCHAR(MAX) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_Payment_Order_No (Order number sequence – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_Payment_Order_No')
BEGIN
  CREATE TABLE [dbo].[T_Payment_Order_No] (
    [Doc_Type_Id] INT NOT NULL PRIMARY KEY,
    [Doc_Type] NVARCHAR(32) NULL,
    [Financial_Year] NVARCHAR(16) NULL,
    [Institution_Id] INT NOT NULL,
    [Starting_No] INT NOT NULL,
    [Latest_No] INT NOT NULL,
    [Module_Tag] NVARCHAR(32) NULL,
    [Created_By] BIGINT NOT NULL,
    [Created_Date] DATETIME2(3) NOT NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_Payment_Transaction (Payment gateway transactions – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_Payment_Transaction')
BEGIN
  CREATE TABLE [dbo].[T_Payment_Transaction] (
    [Id] BIGINT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [EChallan_Id] INT NULL,
    [Fee_Type] NVARCHAR(32) NULL,
    [OrderId] NVARCHAR(128) NULL,
    [PaymentAmt] NVARCHAR(32) NULL,
    [MID] NVARCHAR(64) NULL,
    [MKEY] NVARCHAR(255) NULL,
    [paytmParams] NVARCHAR(MAX) NULL,
    [Signature] NVARCHAR(MAX) NULL,
    [PaytmUrl] NVARCHAR(512) NULL,
    [Token] NVARCHAR(MAX) NULL,
    [PaymentUrl] NVARCHAR(512) NULL,
    [Initiated_Time] DATETIME2(3) NULL,
    [CURRENCY] NVARCHAR(8) NULL,
    [GATEWAYNAME] NVARCHAR(32) NULL,
    [RESPMSG] NVARCHAR(255) NULL,
    [BANKNAME] NVARCHAR(128) NULL,
    [PAYMENTMODE] NVARCHAR(32) NULL,
    [RESPCODE] NVARCHAR(16) NULL,
    [TXNID] NVARCHAR(64) NULL,
    [TXNAMOUNT] NVARCHAR(32) NULL,
    [TXN_STATUS] NVARCHAR(32) NULL,
    [BANKTXNID] NVARCHAR(64) NULL,
    [TXNDATE] DATETIME2(3) NULL,
    [CHECKSUMHASH] NVARCHAR(MAX) NULL,
    [ValidateCheckSum] NVARCHAR(MAX) NULL,
    [ResponseTimeStamp] NVARCHAR(64) NULL,
    [Version] NVARCHAR(16) NULL,
    [TXNTYPE] NVARCHAR(32) NULL,
    [Status_Flag] BIT NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_Razorpay_Transaction (Razorpay transactions – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_Razorpay_Transaction')
BEGIN
  CREATE TABLE [dbo].[T_Razorpay_Transaction] (
    [Id] BIGINT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [EChallan_Id] BIGINT NOT NULL,
    [Fee_Type] NVARCHAR(32) NULL,
    [OrderId] NVARCHAR(128) NULL,
    [PaymentAmt] NVARCHAR(32) NULL,
    [MID] NVARCHAR(64) NULL,
    [MKEY] NVARCHAR(255) NULL,
    [OrderIdParams] NVARCHAR(MAX) NULL,
    [RPayParams] NVARCHAR(MAX) NULL,
    [RPayOrderId] NVARCHAR(128) NULL,
    [Initiated_Time] DATETIME2(3) NULL,
    [CURRENCY] NVARCHAR(8) NULL,
    [GATEWAYNAME] NVARCHAR(32) NULL,
    [RESPMSG] NVARCHAR(255) NULL,
    [RPayPaymentId] NVARCHAR(64) NULL,
    [RpaySignature] NVARCHAR(MAX) NULL,
    [ValidateSignature] NVARCHAR(MAX) NULL,
    [TXN_STATUS] NVARCHAR(32) NULL,
    [TXNDATE] DATETIME2(3) NULL,
    [BANKNAME] NVARCHAR(128) NULL,
    [PAYMENTMODE] NVARCHAR(32) NULL,
    [RESPCODE] NVARCHAR(16) NULL,
    [TXNID] NVARCHAR(64) NULL,
    [TXNAMOUNT] NVARCHAR(32) NULL,
    [TXNCHARGE] NVARCHAR(32) NULL,
    [BANKTXNID] NVARCHAR(64) NULL,
    [CHECKSUMHASH] NVARCHAR(MAX) NULL,
    [ValidateCheckSum] NVARCHAR(MAX) NULL,
    [ResponseTimeStamp] NVARCHAR(64) NULL,
    [Version] NVARCHAR(16) NULL,
    [TXNTYPE] NVARCHAR(32) NULL,
    [Status_Flag] BIT NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- T_User_Activites (User activity log – legacy)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'T_User_Activites')
BEGIN
  CREATE TABLE [dbo].[T_User_Activites] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [EChallan_Id] INT NULL,
    [Type] NVARCHAR(64) NULL,
    [Done_By] INT NULL,
    [CurrentDate] NVARCHAR(32) NULL,
    [CurrentTime] NVARCHAR(32) NULL
  );
END
GO

-- =============================================================================
-- ADDITIONAL COLUMNS ON EXISTING TABLES
-- For tables that already exist: only ADD columns that are missing.
-- Each ALTER runs only when table exists and column does not exist (sys.columns).
-- =============================================================================

-- donation_categories: extra fields for Donation Categories screen (description, tag_label, highlighted, is_default, amount rules, receipt/80G, form rules, accounting)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'donation_categories')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'description')
    ALTER TABLE [dbo].[donation_categories] ADD [description] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'tag_label')
    ALTER TABLE [dbo].[donation_categories] ADD [tag_label] NVARCHAR(64) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'highlighted')
    ALTER TABLE [dbo].[donation_categories] ADD [highlighted] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'is_default')
    ALTER TABLE [dbo].[donation_categories] ADD [is_default] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'min_amount')
    ALTER TABLE [dbo].[donation_categories] ADD [min_amount] DECIMAL(18,2) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'max_amount')
    ALTER TABLE [dbo].[donation_categories] ADD [max_amount] DECIMAL(18,2) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'allow_custom_amount')
    ALTER TABLE [dbo].[donation_categories] ADD [allow_custom_amount] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'recurring_allowed')
    ALTER TABLE [dbo].[donation_categories] ADD [recurring_allowed] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'recurring_default_checked')
    ALTER TABLE [dbo].[donation_categories] ADD [recurring_default_checked] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'receipt_enabled')
    ALTER TABLE [dbo].[donation_categories] ADD [receipt_enabled] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'template_80g')
    ALTER TABLE [dbo].[donation_categories] ADD [template_80g] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'template_non_80g')
    ALTER TABLE [dbo].[donation_categories] ADD [template_non_80g] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'auto_email_receipt')
    ALTER TABLE [dbo].[donation_categories] ADD [auto_email_receipt] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'auto_sms_receipt')
    ALTER TABLE [dbo].[donation_categories] ADD [auto_sms_receipt] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'receipt_description')
    ALTER TABLE [dbo].[donation_categories] ADD [receipt_description] NVARCHAR(255) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'pan_rule')
    ALTER TABLE [dbo].[donation_categories] ADD [pan_rule] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'pan_threshold')
    ALTER TABLE [dbo].[donation_categories] ADD [pan_threshold] INT NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'address_required')
    ALTER TABLE [dbo].[donation_categories] ADD [address_required] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'mobile_required')
    ALTER TABLE [dbo].[donation_categories] ADD [mobile_required] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'show_purpose_field')
    ALTER TABLE [dbo].[donation_categories] ADD [show_purpose_field] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'allow_anonymous')
    ALTER TABLE [dbo].[donation_categories] ADD [allow_anonymous] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'allowed_gateways')
    ALTER TABLE [dbo].[donation_categories] ADD [allowed_gateways] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'allowed_payment_methods')
    ALTER TABLE [dbo].[donation_categories] ADD [allowed_payment_methods] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'international_allowed')
    ALTER TABLE [dbo].[donation_categories] ADD [international_allowed] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'accounting_head')
    ALTER TABLE [dbo].[donation_categories] ADD [accounting_head] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'cost_center')
    ALTER TABLE [dbo].[donation_categories] ADD [cost_center] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'tax_category')
    ALTER TABLE [dbo].[donation_categories] ADD [tax_category] NVARCHAR(64) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_categories') AND name = 'report_grouping')
    ALTER TABLE [dbo].[donation_categories] ADD [report_grouping] NVARCHAR(128) NULL;
END
GO

-- e_challans: extra fields from E-Challan entry screen (cash_received_by, bank_name, cheque_date, dd_number, dd_date, utr_number, transfer_date, amount_in_words, donor_type, purpose)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'e_challans')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'cash_received_by')
    ALTER TABLE [dbo].[e_challans] ADD [cash_received_by] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'bank_name')
    ALTER TABLE [dbo].[e_challans] ADD [bank_name] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'cheque_date')
    ALTER TABLE [dbo].[e_challans] ADD [cheque_date] DATE NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'dd_number')
    ALTER TABLE [dbo].[e_challans] ADD [dd_number] NVARCHAR(64) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'dd_date')
    ALTER TABLE [dbo].[e_challans] ADD [dd_date] DATE NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'utr_number')
    ALTER TABLE [dbo].[e_challans] ADD [utr_number] NVARCHAR(64) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'transfer_date')
    ALTER TABLE [dbo].[e_challans] ADD [transfer_date] DATE NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'amount_in_words')
    ALTER TABLE [dbo].[e_challans] ADD [amount_in_words] NVARCHAR(255) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'donor_type')
    ALTER TABLE [dbo].[e_challans] ADD [donor_type] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'purpose')
    ALTER TABLE [dbo].[e_challans] ADD [purpose] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.e_challans') AND name = 'receipt_number')
    ALTER TABLE [dbo].[e_challans] ADD [receipt_number] NVARCHAR(64) NULL;
END
GO

-- donation_form_settings: support version history and maintenance message (already has config_json; add maintenance_message if needed)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'donation_form_settings')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'maintenance_message')
    ALTER TABLE [dbo].[donation_form_settings] ADD [maintenance_message] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'form_enabled')
    ALTER TABLE [dbo].[donation_form_settings] ADD [form_enabled] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'test_mode')
    ALTER TABLE [dbo].[donation_form_settings] ADD [test_mode] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'multi_country')
    ALTER TABLE [dbo].[donation_form_settings] ADD [multi_country] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'pan_required')
    ALTER TABLE [dbo].[donation_form_settings] ADD [pan_required] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'address_required')
    ALTER TABLE [dbo].[donation_form_settings] ADD [address_required] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'mobile_required')
    ALTER TABLE [dbo].[donation_form_settings] ADD [mobile_required] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'otp_verification')
    ALTER TABLE [dbo].[donation_form_settings] ADD [otp_verification] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'suggest_recurring')
    ALTER TABLE [dbo].[donation_form_settings] ADD [suggest_recurring] BIT NOT NULL DEFAULT 1;
END
GO

-- =============================================================================
-- ADDITIONAL TABLES AND COLUMNS (from all Admin/Donor screens – Communications,
-- Website Content/Gallery/Sponsors, Enquiries, Receipts, Gateway, Users & Roles)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- automation_rules (Communications > Automation)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'automation_rules')
BEGIN
  CREATE TABLE [dbo].[automation_rules] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [trigger_type] NVARCHAR(64) NOT NULL,
    [trigger_filters_json] NVARCHAR(MAX) NULL,
    [actions_json] NVARCHAR(MAX) NOT NULL,
    [category] NVARCHAR(32) NULL,
    [priority] NVARCHAR(16) NULL,
    [status] NVARCHAR(32) NOT NULL DEFAULT N'Enabled',
    [schedule_type] NVARCHAR(32) NULL,
    [schedule_config_json] NVARCHAR(MAX) NULL,
    [last_run_at] DATETIME2(3) NULL,
    [next_run_at] DATETIME2(3) NULL,
    [success_rate] DECIMAL(5,2) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- automation_run_logs (Automation run history)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'automation_run_logs')
BEGIN
  CREATE TABLE [dbo].[automation_run_logs] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [rule_id] INT NULL,
    [event_ref] NVARCHAR(128) NULL,
    [recipient] NVARCHAR(255) NULL,
    [channel] NVARCHAR(32) NULL,
    [status] NVARCHAR(32) NOT NULL,
    [error_message] NVARCHAR(MAX) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_automation_run_logs_rule] FOREIGN KEY ([rule_id]) REFERENCES [dbo].[automation_rules]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- website_pages (Website > Content – page list with versioning)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'website_pages')
BEGIN
  CREATE TABLE [dbo].[website_pages] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(128) NOT NULL,
    [slug] NVARCHAR(128) NOT NULL,
    [status] NVARCHAR(32) NOT NULL DEFAULT N'Draft',
    [last_modified] DATETIME2(3) NULL,
    [modified_by] NVARCHAR(128) NULL,
    [version] INT NOT NULL DEFAULT 1,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- website_page_sections (Sections per page – Hero, Mission, Stats, etc.)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'website_page_sections')
BEGIN
  CREATE TABLE [dbo].[website_page_sections] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [page_id] INT NOT NULL,
    [section_key] NVARCHAR(64) NOT NULL,
    [section_name] NVARCHAR(128) NULL,
    [section_config_json] NVARCHAR(MAX) NULL,
    [enabled] BIT NOT NULL DEFAULT 1,
    [sort_order] INT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL,
    CONSTRAINT [FK_website_page_sections_page] FOREIGN KEY ([page_id]) REFERENCES [dbo].[website_pages]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- website_team_members (Website > Team & Contact – WC-002)
-- Ref: User Stories – Team profiles (name, designation, photo, bio, social links)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'website_team_members')
BEGIN
  CREATE TABLE [dbo].[website_team_members] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [designation] NVARCHAR(128) NULL,
    [photo_url] NVARCHAR(512) NULL,
    [bio] NVARCHAR(MAX) NULL,
    [social_links_json] NVARCHAR(MAX) NULL,
    [display_order] INT NOT NULL DEFAULT 0,
    [is_active] BIT NOT NULL DEFAULT 1,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- gallery_albums (Website > Gallery – albums for grouping images)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'gallery_albums')
BEGIN
  CREATE TABLE [dbo].[gallery_albums] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [cover_image_url] NVARCHAR(512) NULL,
    [image_count] INT NOT NULL DEFAULT 0,
    [visibility] NVARCHAR(32) NOT NULL DEFAULT N'Public',
    [sort_order] INT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- enquiry_replies (Communications > Enquiries – reply thread)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'enquiry_replies')
BEGIN
  CREATE TABLE [dbo].[enquiry_replies] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [enquiry_id] INT NOT NULL,
    [from_user_id] INT NULL,
    [body] NVARCHAR(MAX) NOT NULL,
    [is_internal] BIT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_enquiry_replies_enquiry] FOREIGN KEY ([enquiry_id]) REFERENCES [dbo].[enquiries]([id]),
    CONSTRAINT [FK_enquiry_replies_user] FOREIGN KEY ([from_user_id]) REFERENCES [dbo].[users]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- webhook_log (Payments > Gateway Settings – webhook event log)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'webhook_log')
BEGIN
  CREATE TABLE [dbo].[webhook_log] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [gateway] NVARCHAR(32) NOT NULL,
    [event_type] NVARCHAR(128) NULL,
    [payment_id] NVARCHAR(128) NULL,
    [status] NVARCHAR(32) NULL,
    [signature_valid] BIT NULL,
    [notes] NVARCHAR(MAX) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE()
  );
END
GO

-- -----------------------------------------------------------------------------
-- role_permissions (Settings > Users & Roles – per-role menu permissions)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'role_permissions')
BEGIN
  CREATE TABLE [dbo].[role_permissions] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [role_id] INT NOT NULL,
    [permission_key] NVARCHAR(128) NOT NULL,
    [can_create] BIT NOT NULL DEFAULT 0,
    [can_update] BIT NOT NULL DEFAULT 0,
    [can_view] BIT NOT NULL DEFAULT 1,
    [can_delete] BIT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL,
    CONSTRAINT [FK_role_permissions_role] FOREIGN KEY ([role_id]) REFERENCES [dbo].[user_roles]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- enquiries: category, sla_deadline, has_attachment
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'enquiries')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.enquiries') AND name = 'category')
    ALTER TABLE [dbo].[enquiries] ADD [category] NVARCHAR(64) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.enquiries') AND name = 'sla_deadline')
    ALTER TABLE [dbo].[enquiries] ADD [sla_deadline] DATETIME2(3) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.enquiries') AND name = 'has_attachment')
    ALTER TABLE [dbo].[enquiries] ADD [has_attachment] BIT NOT NULL DEFAULT 0;
END
GO

-- -----------------------------------------------------------------------------
-- website_content: name, slug, status, modified_by (page-level metadata)
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'website_content')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.website_content') AND name = 'name')
    ALTER TABLE [dbo].[website_content] ADD [name] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.website_content') AND name = 'slug')
    ALTER TABLE [dbo].[website_content] ADD [slug] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.website_content') AND name = 'status')
    ALTER TABLE [dbo].[website_content] ADD [status] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.website_content') AND name = 'modified_by')
    ALTER TABLE [dbo].[website_content] ADD [modified_by] NVARCHAR(128) NULL;
END
GO

-- -----------------------------------------------------------------------------
-- gallery: caption, photographer, visibility, file_size, thumbnail_path, uploaded_by, uploaded_at
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'gallery')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.gallery') AND name = 'caption')
    ALTER TABLE [dbo].[gallery] ADD [caption] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.gallery') AND name = 'photographer')
    ALTER TABLE [dbo].[gallery] ADD [photographer] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.gallery') AND name = 'visibility')
    ALTER TABLE [dbo].[gallery] ADD [visibility] NVARCHAR(32) NOT NULL DEFAULT N'Public';
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.gallery') AND name = 'file_size')
    ALTER TABLE [dbo].[gallery] ADD [file_size] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.gallery') AND name = 'thumbnail_path')
    ALTER TABLE [dbo].[gallery] ADD [thumbnail_path] NVARCHAR(512) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.gallery') AND name = 'uploaded_by')
    ALTER TABLE [dbo].[gallery] ADD [uploaded_by] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.gallery') AND name = 'uploaded_at')
    ALTER TABLE [dbo].[gallery] ADD [uploaded_at] DATETIME2(3) NULL;
END
GO

-- -----------------------------------------------------------------------------
-- receipts: template_version, generated_by, delivery_status_email, delivery_status_sms, status
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'receipts')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipts') AND name = 'template_version')
    ALTER TABLE [dbo].[receipts] ADD [template_version] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipts') AND name = 'generated_by')
    ALTER TABLE [dbo].[receipts] ADD [generated_by] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipts') AND name = 'delivery_status_email')
    ALTER TABLE [dbo].[receipts] ADD [delivery_status_email] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipts') AND name = 'delivery_status_sms')
    ALTER TABLE [dbo].[receipts] ADD [delivery_status_sms] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipts') AND name = 'status')
    ALTER TABLE [dbo].[receipts] ADD [status] NVARCHAR(32) NULL;
END
GO

-- -----------------------------------------------------------------------------
-- sponsors: added_by, featured, display_start_date, display_end_date
-- Ref: User Stories WC-003 (Set display dates, auto-hide after end date)
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'sponsors')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.sponsors') AND name = 'added_by')
    ALTER TABLE [dbo].[sponsors] ADD [added_by] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.sponsors') AND name = 'featured')
    ALTER TABLE [dbo].[sponsors] ADD [featured] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.sponsors') AND name = 'display_start_date')
    ALTER TABLE [dbo].[sponsors] ADD [display_start_date] DATE NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.sponsors') AND name = 'display_end_date')
    ALTER TABLE [dbo].[sponsors] ADD [display_end_date] DATE NULL;
END
GO

-- -----------------------------------------------------------------------------
-- communication_templates: status, updated_by
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'communication_templates')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.communication_templates') AND name = 'status')
    ALTER TABLE [dbo].[communication_templates] ADD [status] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.communication_templates') AND name = 'updated_by')
    ALTER TABLE [dbo].[communication_templates] ADD [updated_by] NVARCHAR(128) NULL;
END
GO

-- =============================================================================
-- SETTINGS TABLES FOR CHECKBOXES / TOGGLES (Gallery upload, Receipt Management,
-- Reconciliation, Enquiries config – from all admin screens)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- gallery_settings (Gallery > Upload Images – Processing Options)
-- Auto-resize (thumbnail, medium, large), Convert to WebP, Auto-generate alt text (AI)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'gallery_settings')
BEGIN
  CREATE TABLE [dbo].[gallery_settings] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [auto_resize_enabled] BIT NOT NULL DEFAULT 1,
    [resize_sizes_json] NVARCHAR(MAX) NULL,
    [convert_to_webp_enabled] BIT NOT NULL DEFAULT 1,
    [auto_generate_alt_text_enabled] BIT NOT NULL DEFAULT 0,
    [max_file_size_mb] INT NULL,
    [allowed_extensions] NVARCHAR(128) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- receipt_settings (Receipts > Management – all tabs)
-- Single row; columns added in block below (Delivery, Mandatory Fields, Numbering, etc.).
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'receipt_settings')
BEGIN
  CREATE TABLE [dbo].[receipt_settings] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [config_json] NVARCHAR(MAX) NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL,
    [updated_by] NVARCHAR(128) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- receipt_settings: all tab columns (Delivery, Mandatory Fields, Numbering,
-- Generation, Template, Storage, Bulk, Status, Reprint, Audit, Search)
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'receipt_settings')
BEGIN
  -- Delivery
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'auto_send_email_on_receipt_generation')
    ALTER TABLE [dbo].[receipt_settings] ADD [auto_send_email_on_receipt_generation] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'email_subject_format')
    ALTER TABLE [dbo].[receipt_settings] ADD [email_subject_format] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'email_sender_name')
    ALTER TABLE [dbo].[receipt_settings] ADD [email_sender_name] NVARCHAR(255) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'email_reply_to')
    ALTER TABLE [dbo].[receipt_settings] ADD [email_reply_to] NVARCHAR(255) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'email_retry_attempts')
    ALTER TABLE [dbo].[receipt_settings] ADD [email_retry_attempts] INT NOT NULL DEFAULT 3;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'email_failure_alerts_notify_admin')
    ALTER TABLE [dbo].[receipt_settings] ADD [email_failure_alerts_notify_admin] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'auto_send_sms_on_receipt_generation')
    ALTER TABLE [dbo].[receipt_settings] ADD [auto_send_sms_on_receipt_generation] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'sms_template')
    ALTER TABLE [dbo].[receipt_settings] ADD [sms_template] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'sms_short_link')
    ALTER TABLE [dbo].[receipt_settings] ADD [sms_short_link] BIT NOT NULL DEFAULT 1;
  -- Mandatory Fields
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'mobile_required')
    ALTER TABLE [dbo].[receipt_settings] ADD [mobile_required] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'email_required')
    ALTER TABLE [dbo].[receipt_settings] ADD [email_required] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'address_required')
    ALTER TABLE [dbo].[receipt_settings] ADD [address_required] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'donation_category_required')
    ALTER TABLE [dbo].[receipt_settings] ADD [donation_category_required] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'donation_type_required')
    ALTER TABLE [dbo].[receipt_settings] ADD [donation_type_required] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'pan_rule')
    ALTER TABLE [dbo].[receipt_settings] ADD [pan_rule] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'pan_threshold')
    ALTER TABLE [dbo].[receipt_settings] ADD [pan_threshold] INT NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'pan_auto_uppercase')
    ALTER TABLE [dbo].[receipt_settings] ADD [pan_auto_uppercase] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'pincode_validation')
    ALTER TABLE [dbo].[receipt_settings] ADD [pincode_validation] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'duplicate_warning')
    ALTER TABLE [dbo].[receipt_settings] ADD [duplicate_warning] BIT NOT NULL DEFAULT 1;
  -- Numbering & Series
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'receipt_prefix')
    ALTER TABLE [dbo].[receipt_settings] ADD [receipt_prefix] NVARCHAR(64) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'starting_number')
    ALTER TABLE [dbo].[receipt_settings] ADD [starting_number] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'padding_length')
    ALTER TABLE [dbo].[receipt_settings] ADD [padding_length] INT NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'no_gap_enforcement')
    ALTER TABLE [dbo].[receipt_settings] ADD [no_gap_enforcement] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'auto_create_new_series')
    ALTER TABLE [dbo].[receipt_settings] ADD [auto_create_new_series] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'manual_approval_required')
    ALTER TABLE [dbo].[receipt_settings] ADD [manual_approval_required] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'receipt_types_json')
    ALTER TABLE [dbo].[receipt_settings] ADD [receipt_types_json] NVARCHAR(MAX) NULL;
  -- Generation Rules
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'auto_generate_on_success')
    ALTER TABLE [dbo].[receipt_settings] ADD [auto_generate_on_success] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'generation_delay')
    ALTER TABLE [dbo].[receipt_settings] ADD [generation_delay] INT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'auto_generate_imports')
    ALTER TABLE [dbo].[receipt_settings] ADD [auto_generate_imports] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'allow_manual_offline')
    ALTER TABLE [dbo].[receipt_settings] ADD [allow_manual_offline] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'allow_manual_bulk')
    ALTER TABLE [dbo].[receipt_settings] ADD [allow_manual_bulk] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'allow_backdated')
    ALTER TABLE [dbo].[receipt_settings] ADD [allow_backdated] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'backdate_window')
    ALTER TABLE [dbo].[receipt_settings] ADD [backdate_window] INT NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'show_backdate_stamp')
    ALTER TABLE [dbo].[receipt_settings] ADD [show_backdate_stamp] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'require_reason_manual')
    ALTER TABLE [dbo].[receipt_settings] ADD [require_reason_manual] BIT NOT NULL DEFAULT 1;
  -- Template Rules
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'default_template_online')
    ALTER TABLE [dbo].[receipt_settings] ADD [default_template_online] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'default_template_offline')
    ALTER TABLE [dbo].[receipt_settings] ADD [default_template_offline] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'template_80g')
    ALTER TABLE [dbo].[receipt_settings] ADD [template_80g] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'template_non_80g')
    ALTER TABLE [dbo].[receipt_settings] ADD [template_non_80g] NVARCHAR(128) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'force_regenerate_on_update')
    ALTER TABLE [dbo].[receipt_settings] ADD [force_regenerate_on_update] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'lock_content_after_generation')
    ALTER TABLE [dbo].[receipt_settings] ADD [lock_content_after_generation] BIT NOT NULL DEFAULT 1;
  -- Storage & Access
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'storage_mode')
    ALTER TABLE [dbo].[receipt_settings] ADD [storage_mode] NVARCHAR(16) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'link_security')
    ALTER TABLE [dbo].[receipt_settings] ADD [link_security] NVARCHAR(16) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'link_expiry_days')
    ALTER TABLE [dbo].[receipt_settings] ADD [link_expiry_days] INT NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'allow_regeneration_template')
    ALTER TABLE [dbo].[receipt_settings] ADD [allow_regeneration_template] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'allow_regeneration_anytime')
    ALTER TABLE [dbo].[receipt_settings] ADD [allow_regeneration_anytime] BIT NOT NULL DEFAULT 0;
  -- Bulk, Status, Reprint, Audit, Search
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'bulk_generation_allowed')
    ALTER TABLE [dbo].[receipt_settings] ADD [bulk_generation_allowed] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'max_batch_size')
    ALTER TABLE [dbo].[receipt_settings] ADD [max_batch_size] INT NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'zip_filename_format')
    ALTER TABLE [dbo].[receipt_settings] ADD [zip_filename_format] NVARCHAR(255) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'include_index_csv')
    ALTER TABLE [dbo].[receipt_settings] ADD [include_index_csv] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'run_in_background')
    ALTER TABLE [dbo].[receipt_settings] ADD [run_in_background] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'allow_mark_reissued')
    ALTER TABLE [dbo].[receipt_settings] ADD [allow_mark_reissued] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'auto_mark_delivered')
    ALTER TABLE [dbo].[receipt_settings] ADD [auto_mark_delivered] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'allow_reprint')
    ALTER TABLE [dbo].[receipt_settings] ADD [allow_reprint] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'allow_resend_email')
    ALTER TABLE [dbo].[receipt_settings] ADD [allow_resend_email] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'allow_correction')
    ALTER TABLE [dbo].[receipt_settings] ADD [allow_correction] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'require_reason_reprint')
    ALTER TABLE [dbo].[receipt_settings] ADD [require_reason_reprint] BIT NOT NULL DEFAULT 0;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'require_reason_correction')
    ALTER TABLE [dbo].[receipt_settings] ADD [require_reason_correction] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'require_reason_manual_gen')
    ALTER TABLE [dbo].[receipt_settings] ADD [require_reason_manual_gen] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'require_reason_regenerate')
    ALTER TABLE [dbo].[receipt_settings] ADD [require_reason_regenerate] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'require_reason_cancel')
    ALTER TABLE [dbo].[receipt_settings] ADD [require_reason_cancel] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'retention_years')
    ALTER TABLE [dbo].[receipt_settings] ADD [retention_years] INT NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'default_date_filter')
    ALTER TABLE [dbo].[receipt_settings] ADD [default_date_filter] NVARCHAR(32) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'default_page_size')
    ALTER TABLE [dbo].[receipt_settings] ADD [default_page_size] INT NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'export_formats_csv')
    ALTER TABLE [dbo].[receipt_settings] ADD [export_formats_csv] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'export_formats_excel')
    ALTER TABLE [dbo].[receipt_settings] ADD [export_formats_excel] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'export_formats_pdf')
    ALTER TABLE [dbo].[receipt_settings] ADD [export_formats_pdf] BIT NOT NULL DEFAULT 1;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.receipt_settings') AND name = 'mask_pii')
    ALTER TABLE [dbo].[receipt_settings] ADD [mask_pii] BIT NOT NULL DEFAULT 1;
END
GO

-- -----------------------------------------------------------------------------
-- reconciliation_settings (Payments > Reconciliation – toggles and thresholds)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reconciliation_settings')
BEGIN
  CREATE TABLE [dbo].[reconciliation_settings] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [auto_fetch_settlements] BIT NOT NULL DEFAULT 1,
    [auto_match_settlements] BIT NOT NULL DEFAULT 1,
    [match_strategy] NVARCHAR(32) NULL,
    [mismatch_tolerance] DECIMAL(18,2) NULL,
    [receipt_missing_threshold] INT NULL,
    [webhook_missing_threshold] INT NULL,
    [manual_approval_required] BIT NOT NULL DEFAULT 1,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- enquiry_settings (Communications > Enquiries > Configure – SLA, auto-assignment, spam)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'enquiry_settings')
BEGIN
  CREATE TABLE [dbo].[enquiry_settings] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [default_sla_hours] INT NULL,
    [warning_before_breach_hours] INT NULL,
    [auto_assignment_enabled] BIT NOT NULL DEFAULT 0,
    [assignment_method] NVARCHAR(32) NULL,
    [auto_detect_spam] BIT NOT NULL DEFAULT 0,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL
  );
END
GO

-- -----------------------------------------------------------------------------
-- gallery: alt_text_generated_by_ai (per-image: was alt text AI-generated?)
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'gallery')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.gallery') AND name = 'alt_text_generated_by_ai')
    ALTER TABLE [dbo].[gallery] ADD [alt_text_generated_by_ai] BIT NOT NULL DEFAULT 0;
END
GO

-- =============================================================================
-- BRD-DERIVED: Admin Donor drawer (Notes tab), Donor Profile (Appearance),
-- Donation Form Version History (changes description), Campaigns (Upcoming events)
-- Ref: ARAM admin.md §5.4.3 Notes tab; ARAM donor.md §10.4 Theme; §7.7 Version History; §5.5 Upcoming events
-- =============================================================================

-- -----------------------------------------------------------------------------
-- donor_notes (Admin > Donors > Donor Profile Drawer > Notes tab)
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'donor_notes')
BEGIN
  CREATE TABLE [dbo].[donor_notes] (
    [id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [donor_id] INT NOT NULL,
    [created_by_user_id] INT NULL,
    [note_text] NVARCHAR(MAX) NOT NULL,
    [created_at] DATETIME2(3) NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2(3) NULL,
    CONSTRAINT [FK_donor_notes_donor] FOREIGN KEY ([donor_id]) REFERENCES [dbo].[donors]([id]),
    CONSTRAINT [FK_donor_notes_user] FOREIGN KEY ([created_by_user_id]) REFERENCES [dbo].[users]([id])
  );
END
GO

-- -----------------------------------------------------------------------------
-- donors: theme_preference, notification_preferences, birthday, memorial_dates
-- Ref: User Stories DAS-008 (Profile/notifications), NOT-003 (Birthday & memorial greetings)
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'donors')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donors') AND name = 'theme_preference')
    ALTER TABLE [dbo].[donors] ADD [theme_preference] NVARCHAR(16) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donors') AND name = 'notification_preferences')
    ALTER TABLE [dbo].[donors] ADD [notification_preferences] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donors') AND name = 'birthday')
    ALTER TABLE [dbo].[donors] ADD [birthday] DATE NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donors') AND name = 'memorial_dates')
    ALTER TABLE [dbo].[donors] ADD [memorial_dates] NVARCHAR(MAX) NULL;
END
GO

-- -----------------------------------------------------------------------------
-- donors: UNIQUE on pan (identify repeat guest donors – one PAN = one donor)
-- Ref: User portal – "Donate without Signup" only once per PAN; repeat must use Login to Donate
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'donors')
  AND NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_donors_pan' AND parent_object_id = OBJECT_ID('dbo.donors'))
BEGIN
  ALTER TABLE [dbo].[donors] ADD CONSTRAINT [UQ_donors_pan] UNIQUE ([pan]);
END
GO

-- -----------------------------------------------------------------------------
-- donation_form_settings: changes_description (Version History drawer – "Changes Description")
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'donation_form_settings')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.donation_form_settings') AND name = 'changes_description')
    ALTER TABLE [dbo].[donation_form_settings] ADD [changes_description] NVARCHAR(500) NULL;
END
GO

-- -----------------------------------------------------------------------------
-- campaigns: start_date, end_date, event_description, banner_image_url, thumbnail_image_url
-- Ref: User Stories CM-001 (Campaign image upload – banner + thumbnail)
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'campaigns')
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.campaigns') AND name = 'start_date')
    ALTER TABLE [dbo].[campaigns] ADD [start_date] DATE NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.campaigns') AND name = 'end_date')
    ALTER TABLE [dbo].[campaigns] ADD [end_date] DATE NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.campaigns') AND name = 'event_description')
    ALTER TABLE [dbo].[campaigns] ADD [event_description] NVARCHAR(MAX) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.campaigns') AND name = 'banner_image_url')
    ALTER TABLE [dbo].[campaigns] ADD [banner_image_url] NVARCHAR(512) NULL;
  IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.campaigns') AND name = 'thumbnail_image_url')
    ALTER TABLE [dbo].[campaigns] ADD [thumbnail_image_url] NVARCHAR(512) NULL;
END
GO

-- -----------------------------------------------------------------------------
-- Future changes: append new blocks below this line.
-- -----------------------------------------------------------------------------
</think>
Fixing the circular dependency between `receipts` and `transactions`: creating `transactions` without the `receipt_id` FK first, then adding FKs.
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
StrReplace