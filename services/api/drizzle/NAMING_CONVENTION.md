# Database naming convention (existing DB – follow for new tables)

**Database:** `Dev_SaiAram_EchallanPGI` (SQL Server)

## Table names

- **Prefix:** `T_` (e.g. `T_USER`, `T_EChallan`, `T_Payment_Transaction`).
- **Format:** PascalCase with underscore after prefix: `T_TableName`.

## Column names

- **Format:** PascalCase with underscores: `Id`, `User_Type`, `E_Mail`, `Created_Date`, `Is_Active`, `Donor_Id`, `Amount`, `Gateway_Fee`, `Net_Amount`, `Receipt_Number`, `Financial_Year`, etc.
- **Primary key:** `Id` (INT, identity).
- **Foreign keys:** `{Entity}_Id` (e.g. `Donor_Id`, `Category_Id`, `User_Id`, `Created_By`).
- **Booleans:** `Is_Active`, `Is_80G_Eligible`, `Is_Offline`, `Is_Deleted`.
- **Dates:** `Created_Date`, `Updated_Date`, `Donation_Date`, `Expires_At`.

## Existing tables (from DB)

- `T_USER` – Admin users (Id, Name, User_Type, User_Name, Password, Mobile_Number, Location, E_Mail, Is_Active, Created_By, Created_Date)
- `T_ROLES` – Roles
- `T_ROLES_PRIVILEGE` – Role permissions
- `T_Country` – Countries
- `T_State` – States
- `T_DONOR_CATEGORIES` – Donation categories
- `T_EChallan` – Offline donations
- `T_Payment_Gateway_Config` – Gateway config
- `T_Payment_Order_No` – Order number sequence
- `T_Payment_Transaction` – Payments/transactions
- `T_Razorpay_Transaction` – Razorpay payload
- `T_User_Activites` – User activity / audit
- `T_BASIC_SETTING` – Basic settings
- `T_CFG_ERRORLOG` – Error log
- `T_CFG_Recipients` – Config recipients

## Upcoming tables (BRD – same format)

- `T_DONOR` – Donor profiles
- `T_RECEIPT` – Receipts
- `T_REFUND_REQUEST` – Refunds
- `T_ENQUIRY` – Enquiries
- `T_COMMUNICATION_TEMPLATE` – Email/SMS templates
- `T_DONATION_FORM_SETTING` – Versioned form config
- `T_FEATURE_CONFIG` – Feature flags
- `T_CAMPAIGN` – Campaigns
- `T_ADMIN_NOTIFICATION` – Dashboard alerts
- `T_USER_OTP` – 2FA OTP
- `T_RECONCILIATION_BATCH` – Reconciliation
- `T_WEBSITE_CONTENT` – CMS
- `T_SPONSOR` – Sponsors
- `T_GALLERY` – Gallery
- `T_EXPORT_LOG` – Export audit

All new tables and columns must use **T_** and **PascalCase_Underscore** to match the existing DB.
