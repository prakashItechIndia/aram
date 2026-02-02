# Aram Foundation Admin Portal - Functional Specification Document

## Document Information
**Document Title:** Aram Foundation Admin Portal Functional Specification  
**Version:** 1.0  
**Prepared For:** Aram Foundation  
**Document Type:** Business Requirements Document / Functional Specification  
**Date:** January 2026  
**Purpose:** This document provides a comprehensive technical specification of the Aram Foundation Admin Portal, documenting all UI components, fields, interactions, validations, and workflows as implemented.

---

## 1. INTRODUCTION

### 1.1 Purpose of the Admin Portal
The Aram Foundation Admin Portal is a web-based administrative application designed to provide authorized administrative staff with comprehensive tools to manage donations, donors, transactions, receipts, reports, and system configurations. The portal serves as the central management interface for all donation-related operations.

### 1.2 Scope
This document covers all UI-level functionality, screens, tabs, fields, interactions, validations, and user flows within theAdmin Portal. This specification is based on the actual implementation files and represents the current state of the system.

### 1.3 Intended Users
- **Super Admin:** Full system access including user management, system configuration, and approval workflows
- **Admin:** Standard administrative access for managing donations, donors, and generating reports
- **Staff:** Limited access based on assigned permissions

---

## 2. AUTHENTICATION & AUTHORIZATION

### 2.1 Login Screen

#### 2.1.1 UI Elements
- **Email Field**
  - Field Type: Text input (email)
  - Mandatory: Yes
  - Validation: Email format validation
  - Placeholder: "Enter your email"
  
- **Password Field**
  - Field Type: Password input (masked)
  - Mandatory: Yes
  - Validation: Required field
  - Placeholder: "Enter your password"

- **Login Button**
  - Action: Submit credentials for authentication
  - Behavior: Triggers login process
  - Post-Action: On success, proceeds to 2FA screen; on failure, displays error message

#### 2.1.2 Login Flow
1. User enters email and password
2. System validates field presence and email format
3. On submit, credentials are verified (backend integration point)
4. If valid, system proceeds to Two-Factor Authentication
5. If invalid, error message displayed to user

### 2.2 Two-Factor Authentication (2FA)

#### 2.2.1 UI Elements
- **OTP Input Field**
  - Field Type: 6-digit numeric input
  - Mandatory: Yes
  - Validation: Must be 6 digits
  - Display: Individual boxes for each digit
  
- **Verify Button**
  - Action: Submit OTP for verification
  - Behavior: Validates OTP against server
  - Post-Action: On success, redirects to Dashboard
  
- **Resend Code Link**
  - Action: Request new OTP
  - Behavior: Triggers resend of OTP to registered email/phone
  - Confirmation: Success toast notification

#### 2.2.2 2FA Flow
1. After successful login, user is shown 2FA screen
2. OTP is sent to user's registered email/phone (simulated in UI)
3. User enters 6-digit code
4. System validates OTP
5. On successful verification, user is authenticated and redirected to Dashboard
6. If OTP is incorrect, error message is displayed

### 2.3 Session Management

#### 2.3.1 Logout Functionality
- **Location:** Header (top-right corner)
- **Action:** Ends user session
- **Behavior:** 
  - Clears authentication state
  - Redirects user to Login screen
  - Displays informational toast: "Logged out successfully"

---

## 3. MAIN APPLICATION LAYOUT

### 3.1 Sidebar Navigation

#### 3.1.1 Structure
The sidebar is a persistent left-side navigation panel (280px wide) that remains visible across all authenticated screens.

#### 3.1.2 Navigation Menu Items

**Dashboard**
- Path: `/dashboard`
- Icon: Dashboard icon
- Purpose: Main overview screen

**Donors**
- Section Header
- Sub-items:
  - All Donors (`/donors/all`)

**Payments**
- Section Header
- Sub-items:
  - Transactions (`/payments/transactions`)
  - Reconciliation (`/payments/reconciliation`)
  - Gateway Settings (`/payments/gateway-settings`)
  - E-Challan Entry (`/payments/e-challan-entry`)

**Receipts**
- Section Header
- Sub-items:
  - Receipt Management (`/receipts/management`)

**Reports**
- Section Header
- Sub-items:
  - Fund Collection Report (`/reports/fund-collection`)
  - Receipt Register (`/reports/receipt-register`)

**Master Data**
- Section Header
- Sub-items:
  - Donation Categories (`/master-data/donation-categories`)

**Communications**
- Section Header
- Sub-items:
  - Enquiries (`/communications/enquiries`)
  - Templates (`/communications/templates`)
  - Automation (`/communications/automation`)

**Website**
- Section Header
- Sub-items:
  - Content (`/website/content`)
  - Sponsors (`/website/sponsors`)
  - Gallery (`/website/gallery`)

**Settings**
- Section Header
- Sub-items:
  - Donation Form Settings (`/settings/donation-form`)
  - Users & Roles (`/settings/users-roles`)

#### 3.1.3 Navigation Behavior
- **Active State:** Currently selected menu item is highlighted with color (orange #F36A4F)
- **Hover State:** Menu items show hover effect on mouseover
- **Click Action:** Navigates to corresponding screen without page reload (SPA behavior)

### 3.2 Header

#### 3.2.1 UI Elements
- **Width:** Full width (extends across entire screen)
- **Height:** 72px
- **Position:** Fixed at top
- **Background:** White with bottom border

#### 3.2.2 Header Components
- **Logo/Branding:** Aram Foundation logo (left side)
- **Search Bar:** Global search functionality (center)
- **Notifications Icon:** Bell icon with badge for unread notifications
- **User Profile Dropdown:** 
  - Displays current user name
  - Dropdown options:
    - Profile Settings
    - Logout

---

## 4. DASHBOARD SCREEN

**Path:** `/dashboard`  
**Purpose:** Provides operational overview and quick access to common administrative tasks

### 4.1 Statistics Cards

#### 4.1.1 Today's Collections Card
- **Display Value:** Amount in INR (e.g., "₹2,45,678")
- **Change Indicator:** Percentage change with trend (e.g., "+12.5%")
- **Icon:** Indian Rupee icon
- **Color Scheme:** Orange (#F36A4F)
- **Trend Color:** 
  - Positive change: Green background
  - Negative change: Red background

#### 4.1.2 Active Donors Card
- **Display Value:** Count of active donors (e.g., "1,234")
- **Change Indicator:** Percentage change (e.g., "+8.2%")
- **Icon:** Users icon
- **Color Scheme:** Brown (#734F48)

#### 4.1.3 Pending Receipts Card
- **Display Value:** Count of pending receipts (e.g., "23")
- **Change Indicator:** Percentage change (e.g., "-15%")
- **Icon:** Receipt icon
- **Color Scheme:** Orange (#F36A4F)
- **Behavior:** Negative changes shown in red (indicate improvement)

#### 4.1.4 This Month Collections Card
- **Display Value:** Total monthly collection (e.g., "₹45.2L")
- **Change Indicator:** Percentage change (e.g., "+18.3%")
- **Icon:** Trending Up icon
- **Color Scheme:** Brown (#734F48)

### 4.2 Quick Actions Panel

#### 4.2.1 Purpose
Provides one-click access to frequently used administrative functions.

#### 4.2.2 Available Quick Actions

**Create E-Challan**
- Icon: Plus icon
- Color: Orange (#F36A4F)
- Action: Navigates to E-Challan Entry screen (`/payments/e-challan-entry`)
- Purpose: Create new offline donation entry

**Print Receipt**
- Icon: Printer icon
- Color: Brown (#734F48)
- Action: Opens receipt printing interface
- Purpose: Generate and print donation receipts

**Add Donation Category**
- Icon: File Text icon
- Color: Orange (#F36A4F)
- Action: Opens category creation modal
- Purpose: Add new donation category to master data

**View Today's Collections**
- Icon: Bar Chart icon
- Color: Brown (#734F48)
- Action: Navigates to filtered transaction view
- Purpose: Quick access to today's donation transactions

**Process Refund**
- Icon: Refresh icon
- Color: Orange (#F36A4F)
- Action: Opens refund processing interface
- Purpose: Initiate refund for failed or disputed transactions

**Pending Approvals**
- Icon: File Check icon
- Color: Brown (#734F48)
- Action: Shows approval queue
- Purpose: Review and approve pending administrative actions (e.g., refunds >₹10,000)

#### 4.2.3 UI Behavior
- **Layout:** 3-column grid on desktop, responsive on smaller screens
- **Card Height:** 96px
- **Hover Effect:** Border color changes to orange, background lightens
- **Click Action:** Executes corresponding action immediately

### 4.3 Alerts & Notifications Panel

#### 4.3.1 Purpose
Displays system alerts and issues requiring administrative attention.

#### 4.3.2 Alert Types

**Error Alerts (Red)**
- **Background Color:** #FEF1EE
- **Border Color:** #F36A4F
- **Icon:** Alert Triangle (red)
- **Example:** "Reconciliation Mismatch - 3 transactions from 14 Jan 2026 need attention"

**Warning Alerts (Orange)**
- **Background Color:** #FEF7F6
- **Border Color:** #FF8870
- **Icon:** Alert Triangle (orange)
- **Example:** "Failed Email Delivery - 5 receipt emails failed to send"

**Info Alerts (Brown)**
- **Background Color:** #F1EEED
- **Border Color:** #734F48
- **Icon:** File Check icon
- **Example:** "Duplicate Donors Detected - 2 potential duplicate donor records found"

#### 4.3.3 Alert Structure
Each alert displays:
- **Alert Title:** Bold, 14px font
- **Alert Message:** Detailed description
- **Timestamp:** Relative time (e.g., "10 mins ago", "1 hour ago")
- **Height:** 48px per alert

#### 4.3.4 Alert Actions
- **View All Alerts Button:** Located at bottom of panel
- **Click on Alert:** Navigates to relevant screen to address issue

---

## 5. DONORS MANAGEMENT SCREEN

**Path:** `/donors/all`  
**Purpose:** Manage donor information, view donation history, and analyze donor engagement

### 5.1 Page Header

#### 5.1.1 UI Elements
- **Page Title:** "All Donors"
- **Subtitle:** "Manage donor information and history"
- **Action Buttons:**
  - **Merge Duplicates Button**
    - Style: Outline button
    - Icon: Users icon
    - Purpose: Identify and merge duplicate donor records
  - **Export Button**
    - Style: Primary button
    - Icon: Download icon
    - Purpose: Export donor data to Excel/CSV

### 5.2 Filter Bar

#### 5.2.1 Search Field
- **Field Type:** Text input with search icon
- **Placeholder:** "Search by name, email, mobile..."
- **Behavior:** Real-time search (filters table as user types)
- **Width:** Flex-grow (expands to fill available space)
- **Minimum Width:** 200px

#### 5.2.2 Status Filter Dropdown
- **Field Type:** Select dropdown
- **Width:** 220px
- **Options:**
  - All Status (default)
  - Active
  - Inactive
- **Behavior:** Filters donor table by status
- **UI State:** Selected value displayed

#### 5.2.3 Tags Filter Dropdown
- **Field Type:** Select dropdown
- **Width:** 220px
- **Options:**
  - All Tags (default)
  - Regular
  - 80G
  - VIP
- **Behavior:** Filters donors by assigned tags
- **Multi-Select:** No (single selection)

### 5.3 Donors Table

#### 5.3.1 Table Columns

**Name**
- Data Type: Text
- Sortable: Yes
- Example: "Rajesh Kumar"

**Email**
- Data Type: Email
- Sortable: Yes
- Example: "rajesh.kumar@example.com"

**Mobile**
- Data Type: Phone number
- Format: "+91 98765 43210"
- Sortable: No

**Total Donated**
- Data Type: Currency (INR)
- Format: "₹1,25,000"
- Sortable: Yes (default descending)
- Alignment: Right-aligned for numbers

**Last Donation**
- Data Type: Date
- Format: "20 Jan 2026"
- Sortable: Yes

**Donation Count**
- Data Type: Integer
- Display: Numeric count
- Sortable: Yes

**Tags**
- Display: Badge pills
- Colors:
  - Regular: Light orange background
  - 80G: Light orange background
  - VIP: Light orange background
- Multiple Tags: Displayed as wrapped badges

**Status**
- Display: Badge component
- Values:
  - Active: Green badge
  - Inactive: Gray badge

**Actions**
- **View Button:** Eye icon
- **Action:** Opens donor detail drawer
- **Style:** Icon button with hover effect

#### 5.3.2 Table Behavior
- **Row Click:** Opens donor profile drawer
- **Pagination:** Available if more than default page size
- **Loading State:** Displays skeleton loader
- **Empty State:** "No donors found" message
- **Row Height:** Standard height for readability

### 5.4 Donor Profile Drawer

**Trigger:** Click on donor row or View action button  
**Width:** 600px  
**Position:** Slides in from right side  
**Overlay:** Semi-transparent backdrop

#### 5.4.1 Donor Information Card

**Profile Avatar**
- Display: Circle with donor initials
- Background Color: Orange (#F36A4F)
- Text Color: White
- Size: 64px diameter
- Initials: First letter of first and last name

**Donor Name**
- Font Size: 18px
- Font Weight: Semibold
- Color: Black (#0D0D0D)

**Tags & Status**
- Display: Horizontal badges
- Same styling as table tags

**Contact Information**
- **Email:** Displayed with mail icon
- **Phone:** Displayed with phone icon
- **Icon Color:** Gray (#6E6E6E)
- **Text Color:** Dark gray (#3D3D3D)
- **Font Size:** 14px

#### 5.4.2 Statistics Cards (3-column grid)

**Total Donated Card**
- **Icon:** Indian Rupee (orange background)
- **Value:** "₹1,25,000" (large, bold)
- **Label:** "Total Donated"
- **Alignment:** Center-aligned

**Donations Count Card**
- **Icon:** File Text (brown background)
- **Value:** "12" (large, bold)
- **Label:** "Donations"
- **Alignment:** Center-aligned

**Last Donation Card**
- **Icon:** Calendar (orange background)
- **Value:** "20 Jan 2026"
- **Label:** "Last Donation"
- **Alignment:** Center-aligned

#### 5.4.3 Tabs

**Tab Navigation**
- **Display:** Horizontal tabs with underline indicator
- **Active Tab Color:** Orange (#F36A4F)
- **Inactive Tab Color:** Gray (#6E6E6E)
- **Available Tabs:**
  1. Overview
  2. Donation History
  3. Communication
  4. Notes

#### 5.4.4 Donation History Tab

**Purpose:** Display complete donation history for the selected donor

**Table Columns:**
- **Date:** Transaction date
- **Amount:** Donation amount (bold, large font)
- **Category:** Donation type (e.g., Education, Healthcare)
- **Receipt Number:** Full receipt identifier
- **Download Action:** Download receipt PDF button

**Display Format:**
- Card-based layout for each donation
- Amount and category shown prominently
- Date and receipt number in smaller text
- Download button aligned to right

**Sample Entry:**
```
₹15,000 • Education
15 Dec 2025 • ARAM/2025-26/00089
[Download Button]
```

#### 5.4.5 Actions Footer

**Send Email Button**
- Style: Outline button
- Icon: Mail icon
- Width: 50%
- Purpose: Compose email to donor

**Generate Report Button**
- Style: Primary button
- Icon: File Text icon
- Width: 50%
- Purpose: Create donor-specific report

---

## 6. TRANSACTIONS SCREEN

**Path:** `/payments/transactions`  
**Purpose:** View, filter, and manage all payment transactions

### 6.1 Page Header
- **Title:** "Transactions"
- **Subtitle:** "View and manage all payment transactions"

### 6.2 Filter Bar

#### 6.2.1 Search Field
- **Field Type:** Text input with search icon
- **Placeholder:** "Search by Payment ID, Receipt, Donor..."
- **Width:** Flexible (minimum 200px)
- **Behavior:** Real-time filtering

#### 6.2.2 Date Range Filter
- **Field Type:** Select dropdown
- **Width:** 220px
- **Options:**
  - Last 7 Days (default)
  - Last 30 Days
  - This Month
  - Last Month
  - Custom Range
- **Behavior:** Filters transactions by date

#### 6.2.3 Status Filter
- **Field Type:** Select dropdown
- **Width:** 220px
- **Options:**
  - All Status (default)
  - Success
  - Failed
  - Processing
  - Refunded
  - Disputed
- **Impact:** Shows only transactions matching selected status

#### 6.2.4 Action Buttons

**More Filters Button**
- Style: Outline button
- Icon: Filter icon
- Action: Opens advanced filters modal

**Export Button**
- Style: Outline button
- Icon: Download icon
- Action: Exports filtered transaction data

### 6.3 Transactions Table

#### 6.3.1 Table Columns

**Payment ID**
- Width: 120px
- Example: "PAY_001234"
- Font: Monospace for readability

**Order ID**
- Width: 120px
- Example: "ORD_567890"
- Font: Monospace

**Receipt No**
- Display: Receipt number if generated, "-" if not available
- Gray color for "-"
- Example: "ARAM/2025-26/00123"

**Donor Name**
- Data Type: Text
- Example: "Rajesh Kumar"

**Amount**
- Format: "₹15,000"
- Alignment: Right-aligned
- Font Weight: Medium

**Gateway Fee**
- Format: "₹300"
- Alignment: Right-aligned
- Purpose: Shows transaction fees deducted by payment gateway

**Net Amount**
- Format: "₹14,700"
- Calculation: Amount - Gateway Fee
- Alignment: Right-aligned
- Font Weight: Bold

**Status**
- Display: Badge component
- Badge Colors:
  - Success: Green
  - Failed: Red
  - Processing: Yellow
  - Refunded: Blue
  - Disputed: Orange

**Date/Time**
- Format: "20 Jan 2026, 10:30 AM"
- Display: Full date and time

**Actions**
- **View Details:** Eye icon button
- **Refund:** Refresh icon button (only for successful transactions)
- **Download Receipt:** Download icon button (only if receipt generated)

#### 6.3.2 Table UI Behavior
- **Row Click:** Opens transaction details drawer
- **Hover Effect:** Row highlights on hover
- **Loading State:** Skeleton loader displayed
- **Empty State:** "No transactions found" message

### 6.4 Transaction Details Drawer

**Width:** 480px  
**Trigger:** Click on transaction row or View action

#### 6.4.1 Payment Information Section

**Displayed Fields:**
- **Payment ID:** Full payment ID
- **Order ID:** Full order ID
- **Receipt No:** Receipt number or "-"
- **Status:** Badge display
- **Date/Time:** Full timestamp

**Display Format:**
- Label-value pairs
- Labels in gray, values in black
- Border between each field
- 14px font size

#### 6.4.2 Amount Breakdown Section

**Fields:**
- **Amount:** Original transaction amount
- **Gateway Fee:** Fee charged (shown in red with minus sign)
- **Net Amount:** Final amount (bold, larger font)

**Visual Separator:**
- Thick border above Net Amount row
- Emphasizes final calculated amount

#### 6.4.3 Drawer Actions

**Process Refund Button**
- Display Condition: Only for successful transactions
- Style: Primary button
- Width: Full width or 50%
- Action: Opens Refund Modal

**Download Receipt Button**
- Display Condition: Only if receipt exists
- Style: Outline button
- Icon: Download icon
- Action: Downloads receipt PDF

### 6.5 Refund Modal

**Trigger:** Click "Process Refund" from transaction details  
**Modal Width:** Medium (600px)  
**Modal Title:** "Process Refund"

#### 6.5.1 Transaction Summary Display

**Information Shown:**
- **Transaction ID:** e.g., "PAY_001234"
- **Donor Name:** e.g., "Rajesh Kumar"
- **Original Amount:** e.g., "₹15,000"

**Display Format:**
- Text-based, bold values
- Paragraph format

#### 6.5.2 Refund Type Selection

**Field Type:** Radio button group  
**Label:** "Refund Type *"  
**Options:**

**Full Refund**
- Selected State: Orange border and background
- Default: Pre-selected
- Behavior: Auto-populates refund amount with original amount

**Partial Refund**
- Selected State: Orange border and background
- Behavior: Enables refund amount input field

#### 6.5.3 Refund Amount Field

**Display Condition:** Only when "Partial Refund" is selected  
**Field Type:** Number input  
**Label:** "Refund Amount *"  
**Validation:**
- Must be greater than 0
- Must not exceed original transaction amount
- **Helper Text:** "Maximum: ₹15,000"

#### 6.5.4 Approval Warning Box

**Display Condition:** Always visible  
**Background Color:** Light orange (#FEF7F6)  
**Border Color:** Orange (#FCD9D3)

**Content - If Amount > ₹10,000:**
- **Warning Icon:** ⚠️
- **Title:** "Approval Required"
- **Message:** "Refunds over ₹10,000 require Super Admin approval. This will be sent to the Pending Approvals queue."

**Content - If Amount ≤ ₹10,000:**
- **Message:** "This refund will be processed immediately. A reason is required for audit logs."

#### 6.5.5 Reason Field

**Field Type:** Textarea  
**Label:** "Reason *"  
**Placeholder:** "Enter reason for refund..."  
**Minimum Height:** 100px  
**Mandatory:** Yes  
**Helper Text:** "Reason is stored in audit logs."  
**Validation:** Must not be empty

#### 6.5.6 Modal Actions

**Cancel Button**
- Style: Outline button
- Action: Closes modal without saving
- Position: Left side

**Process Refund Button**
- Style: Danger button (red)
- Action: Submits refund request
- Validation: Checks all required fields
- Post-Action:
  - If amount > ₹10,000: Sends to approval queue, shows success toast
  - If amount ≤ ₹10,000: Processes immediately, shows success toast
  - Closes modal
  - Refreshes transaction table

---

## 7. DONATION FORM SETTINGS SCREEN

**Path:** `/settings/donation-form`  
**Purpose:** Configure donation form fields, validation rules, and behavior

### 7.1 Page Header

#### 7.1.1 UI Elements
- **Title:** "Donation Form Settings"
- **Subtitle:** "Configure donation form fields and behavior"
- **Action Buttons:**
  - **Version History Button**
    - Style: Outline button
    - Icon: History icon
    - Action: Opens version history drawer
  - **Preview Form Button**
    - Style: Outline button
    - Icon: Eye icon
    - Action: Opens preview of donor-facing form in new tab/modal

### 7.2 Test Mode Banner

**Display Condition:** Only visible when Test Mode is enabled  
**Background Color:** Light orange (#FEF7F6)  
**Border Color:** Orange (#FCD9D3)

**Content:**
- **Badge:** "Test Mode" (yellow/processing badge)
- **Message:** "Form is running in test mode. No actual transactions will be processed."
- **Action Button:** "Disable Test Mode"
  - Style: Outline button
  - Action: Toggles test mode OFF and marks changes as unsaved

### 7.3 Form Status Card

**Card Title:** "Form Status"  
**Card Subtitle:** "Enable or disable the donation form"

#### 7.3.1 Enable Donation Form Toggle

**Field Type:** Switch/Toggle  
**Label:** "Enable Donation Form"  
**Helper Text:** "When disabled, visitors will see a maintenance message"  
**Default State:** Enabled (ON)

**UI Behavior:**
- **When ENABLED:**
  - Donation form is publicly accessible
  - Donors can submit donations
  - Maintenance message field is hidden
  
- **When DISABLED:**
  - Donation form is not accessible to donors
  - Maintenance message field becomes visible
  - Maintenance message is displayed to visitors

**Change Impact:**
- Marks form as having unsaved changes
- Sticky save bar appears at bottom of screen

#### 7.3.2 Maintenance Message Field

**Display Condition:** Only when "Enable Donation Form" is OFF  
**Field Type:** Textarea  
**Label:** "Maintenance Message"  
**Placeholder:** "Enter message to display when form is disabled..."  
**Helper Text:** "This message will be shown to visitors"  
**Rows:** 3 minimum

**Purpose:**
- Inform donors why the form is temporarily unavailable
- Provide alternative contact information if needed

#### 7.3.3 Test Mode Toggle

**Field Type:** Switch/Toggle  
**Label:** "Test Mode"  
**Helper Text:** "Enable test mode for testing without processing real transactions"  
**Default State:** Disabled (OFF)  
**Border:** Displayed with top border separator

**UI Behavior:**
- **When ENABLED:**
  - Test Mode Banner appears at top of page
  - Form accepts test transactions
  - No actual payment processing occurs
  - Useful for QA and testing
  
- **When DISABLED:**
  - Banner is hidden
  - Form processes real transactions
  - Normal production behavior

### 7.4 Field Configuration Card

**Card Title:** "Field Configuration"  
**Card Subtitle:** "Configure required fields and validation rules"

#### 7.4.1 Multi-Country Support Toggle

**Field Type:** Switch/Toggle  
**Label:** "Multi-Country Support"  
**Helper Text:** "Allow donors to select country other than India"  
**Default State:** Disabled (OFF)

**UI Behavior:**
- **When ENABLED:**
  - Country dropdown field is displayed in donor form
  - Donors can select from multiple countries
  - State field adapts to selected country
  
- **When DISABLED:**
  - Country is hardcoded to "India"
  - State field auto-populates with Indian states only
  - Info message displayed: "ℹ️ Country will default to India. State field will auto-populate Indian states."

#### 7.4.2 PAN Card Requirement Configuration

**Section Label:** "PAN Card Requirement"  
**Field Type:** Radio button group

**Options:**

**Always Required**
- Label: "Always Required"
- Description: "PAN mandatory for all donations"
- Behavior: PAN field is mandatory regardless of donation amount

**Threshold Based (₹2,000+)**
- Label: "Threshold Based (₹2,000+)"
- Description: "Required for donations above ₹2,000"
- Default: Selected
- Behavior:
  - PAN field is optional for donations below ₹2,000
  - PAN field becomes mandatory for donations ≥ ₹2,000
  - Frontend shows conditional validation

**Optional for International**
- Label: "Optional for International"
- Description: "Not required for non-Indian donors"
- Behavior:
  - PAN required for Indian donors (threshold based)
  - PAN not required for donors with non-India country selection

#### 7.4.3 Address Requirement Toggle

**Field Type:** Switch/Toggle  
**Label:** "Require Address"  
**Helper Text:** "Make address field mandatory"  
**Default State:** Enabled (ON)  
**Border:** Top border separator

**UI Behavior:**
- **When ENABLED:** Address field is mandatory in donation form
- **When DISABLED:** Address field is optional

#### 7.4.4 Mobile Number Requirement Toggle

**Field Type:** Switch/Toggle  
**Label:** "Require Mobile Number"  
**Helper Text:** "Make mobile number mandatory"  
**Default State:** Enabled (ON)

**UI Behavior:**
- **When ENABLED:** Mobile number field is mandatory
- **When DISABLED:** Mobile number field is optional

#### 7.4.5 Mobile OTP Verification Toggle

**Field Type:** Switch/Toggle  
**Label:** "Mobile OTP Verification"  
**Helper Text:** "Verify mobile number with OTP (currently disabled)"  
**Default State:** Disabled (OFF)  
**Field State:** Disabled (grayed out)

**Purpose:**
- Future feature for OTP verification
- Currently not functional (disabled UI element)

### 7.5 Amount Configuration Card

**Card Title:** "Amount Configuration"  
**Card Subtitle:** "Configure donation amount options and limits"

#### 7.5.1 Preset Amounts Section

**Purpose:** Define quick-select amount buttons shown to donors

**Label:** "Preset Amounts"

**Default Values:**
- ₹500
- ₹1,000
- ₹2,500
- ₹5,000

**UI Components for Each Preset:**
- **Amount Input Field:**
  - Type: Number
  - Width: 100px
  - Validation: Must be positive integer
  
- **Remove Button:**
  - Style: Text button (red text)
  - Action: Removes this preset from list
  - Confirmation: None (immediate action)

**Add Preset Amount Button**
- Style: Outline button
- Label: "Add Preset Amount"
- Action: Adds new empty preset amount field
- Behavior: Appends new input field to list

**Helper Text:** "Donors can also enter custom amounts"

#### 7.5.2 Minimum Amount Field

**Field Type:** Number input  
**Label:** "Minimum Amount"  
**Default Value:** "100"  
**Validation:** Must be positive number  
**Purpose:** Sets lower limit for donation amounts

**Impact on Donor Form:**
- Donations below this amount are rejected
- Validation message shown to donor

#### 7.5.3 Maximum Amount Field

**Field Type:** Number input  
**Label:** "Maximum Amount"  
**Default Value:** "50000"  
**Validation:** Must be greater than minimum amount  
**Purpose:** Sets upper limit for single donation amounts

**Impact on Donor Form:**
- Donations above this amount are rejected
- Validation message shown to donor

#### 7.5.4 Suggest Recurring Donations Toggle

**Field Type:** Switch/Toggle  
**Label:** "Suggest Recurring Donations"  
**Helper Text:** "Show option to make donation recurring"  
**Default State:** Enabled (ON)

**UI Behavior:**
- **When ENABLED:**
  - Recurring donation checkbox is displayed in donor form
  - Donors can opt for monthly recurring donations
  
- **When DISABLED:**
  - Recurring donation option is hidden
  - All donations are one-time only

### 7.6 Unsaved Changes - Sticky Save Bar

**Display Condition:** Only visible when any setting has been modified  
**Position:** Fixed at bottom of screen  
**Height:** 72px  
**Background:** White with top border  
**Z-Index:** High (appears above content)  
**Left Margin:** 280px (accounts for sidebar)

**UI Elements:**

**Unsaved Changes Message**
- Text: "You have unsaved changes"
- Color: Gray (#6E6E6E)
- Position: Left side (margin-auto)

**Discard Button**
- Style: Outline button
- Icon: Rotate CCW icon
- Label: "Discard"
- Action: 
  - Resets all fields to last saved state
  - Hides sticky save bar
  - Shows toast: "Changes discarded"

**Save Changes Button**
- Style: Primary button
- Icon: Save icon
- Label: "Save Changes"
- Action:
  - Validates all fields
  - Saves configuration to database
  - Hides sticky save bar
  - Shows toast: "Settings saved successfully"
  - Creates new version in version history

### 7.7 Version History Drawer

**Trigger:** Click "Version History" button  
**Width:** 480px  
**Title:** "Version History"

#### 7.7.1 Version Entry Format

Each version displays:
- **Version Badge:** e.g., "v1.5" (green badge)
- **Current Indicator:** "Current" label for latest version
- **Date:** "20 Jan 2026, 10:30 AM"
- **Changes Description:** "Updated preset amounts"
- **User:** "by Super Admin"
- **Rollback Button:** Only for non-current versions
  - Style: Ghost button (small)
  - Label: "Rollback"
  - Action: Reverts settings to this version (requires confirmation)

#### 7.7.2 Version List
- Sorted by date (newest first)
- Card-based display
- Each entry is 16px padding
- Scrollable if many versions exist

---

## 8. FUND COLLECTION REPORT SCREEN

**Path:** `/reports/fund-collection`  
**Purpose:** Comprehensive donation analytics and insights with charts and statistics

### 8.1 Page Header
- **Title:** "Fund Collection Report"
- **Subtitle:** "Comprehensive donation analytics and insights"
- **Action Button:**
  - **Export Report Button**
    - Style: Primary button
    - Icon: Download icon
    - Action: Opens export options or directly downloads report

### 8.2 Filters Card

**Card Design:** Compact filter bar with single-row layout (wraps on mobile)

#### 8.2.1 Date Range Filter
- **Field Type:** Select dropdown
- **Label:** "Date Range"
- **Width:** 220px
- **Default:** "This Month"
- **Options:**
  - Today
  - Yesterday
  - Last 7 Days
  - Last 30 Days
  - This Month (default)
  - Last Month
  - This Financial Year
  - Last Financial Year
  - Custom Range

#### 8.2.2 Donation Type Filter
- **Field Type:** Select dropdown
- **Label:** "Donation Type"
- **Width:** 220px
- **Options:**
  - All Types (default)
  - Online
  - Offline

#### 8.2.3 Category Filter
- **Field Type:** Select dropdown
- **Label:** "Category"
- **Width:** 220px
- **Options:**
  - All Categories (default)
  - Education
  - Healthcare
  - General
  - Infrastructure

#### 8.2.4 Apply Filters Button
- Style: Outline button
- Label: "Apply Filters"
- Action: Refreshes report data based on selected filters

### 8.3 Statistics Cards (4-column grid)

#### 8.3.1 Total Collected Card
- **Icon:** Indian Rupee (orange background circle)
- **Value:** "₹45.2L"
- **Change Badge:** "+18.3%" (green background)
- **Label:** "Total Collected"

#### 8.3.2 Donor Count Card
- **Icon:** Users (brown background circle)
- **Value:** "1,234"
- **Change Badge:** "+12.5%" (green background)
- **Label:** "Donor Count"

#### 8.3.3 Average Donation Card
- **Icon:** Trending Up (orange background circle)
- **Value:** "₹3,662"
- **Change Badge:** "+5.2%" (green background)
- **Label:** "Avg Donation"

#### 8.3.4 Online vs Offline Card
- **Icon:** Credit Card (brown background circle)
- **Value:** "85% : 15%"
- **Change Badge:** "+3%" (green background)
- **Label:** "Online vs Offline"

### 8.4 Report Tabs

**Tab Navigation:**
- Summary (default)
- Transactions
- Export

**Active Tab:** Underlined in orange  
**Inactive Tabs:** Gray text with hover effect

### 8.5 Summary Tab Content

#### 8.5.1 Collection Trend Chart

**Chart Type:** Line Chart  
**Library:** Recharts  
**Height:** 300px  
**Title:** "Collection Trend"  
**Subtitle:** "Daily collection amounts and donor count"

**Data Series:**
- **Amount (₹):** Orange line (#F36A4F), 2px stroke width
- **Donors:** Brown line (#734F48), 2px stroke width

**X-Axis:**
- Data: Date labels (e.g., "01 Jan", "05 Jan")
- Color: Gray (#6E6E6E)
- Font Size: 13px

**Y-Axis:**
- Auto-scaled based on data
- Color: Gray
- Font Size: 13px

**Grid:** Light gray dashed lines  
**Tooltip:** White background, bordered, displays both series values  
**Legend:** Displays series names

#### 8.5.2 Category Distribution Chart

**Chart Type:** Pie Chart  
**Width:** 50% (in 2-column grid)  
**Height:** 300px  
**Title:** "Category Distribution"  
**Subtitle:** "Donations by category"

**Data Categories:**
- Education
- Healthcare
- General
- Infrastructure
- Other

**Colors:** Orange gradient (#F36A4F, #FF8870, #F9B5A7, #FCD9D3, #FEF1EE)

**Labels:**
- Display: Category name and percentage
- Format: "Education (35%)"
- Position: Outside pie with label lines

**Tooltip:** Shows category name and amount

#### 8.5.3 Payment Method Chart

**Chart Type:** Bar Chart  
**Width:** 50% (in 2-column grid)  
**Height:** 300px  
**Title:** "Payment Method"  
**Subtitle:** "Distribution by payment type"

**Payment Methods:**
- UPI
- Credit Card
- Debit Card
- Net Banking
- Cash

**Bar Styling:**
- Fill Color: Orange (#F36A4F)
- Corner Radius: Top corners rounded (8px)

**X-Axis:** Payment method names  
**Y-Axis:** Donation amounts  
**Grid:** Light gray dashed lines  
**Tooltip:** White background, bordered

#### 8.5.4 Top Donors List

**Title:** "Top Donors"  
**Subtitle:** "Highest contributors this period"  
**Layout:** Vertical list of cards

**Each Donor Entry:**
- **Rank Badge:**
  - Circular badge with number (1, 2, 3, etc.)
  - Background: Orange (#F36A4F)
  - Color: White
  - Size: 40px diameter
  
- **Donor Information:**
  - **Name:** Bold, 14px
  - **Donation Count:** Gray text, 12px (e.g., "12 donations")
  
- **Amount:**
  - Right-aligned
  - Bold, 16px
  - Color: Orange (#F36A4F)
  - Format: "₹1,25,000"

**Background:** Gray (#F3F3F3) for each card  
**Spacing:** 12px between cards

### 8.6 Export Tab Content

**Title:** "Export Report"  
**Subtitle:** "Generate and download reports in various formats"

#### 8.6.1 Export Format Selector
- **Field Type:** Select dropdown
- **Label:** "Export Format"
- **Options:**
  - Excel (.xlsx)
  - CSV (.csv)
  - PDF (.pdf)

#### 8.6.2 Export Watermark Information Box

**Background:** Light orange (#FEF7F6)  
**Border:** Orange (#FCD9D3)  
**Padding:** 16px

**Content:**
- **Title:** "Export Watermark:"
- **Watermark Example:** "Generated by Super Admin on 20 Jan 2026, 10:30 AM from 192.168.1.100"
  - Font: Monospace
  - Font Size: 12px
  
- **Audit Message:** "All exports are logged in the audit trail for compliance."

#### 8.6.3 Generate & Download Button
- **Style:** Primary button
- **Width:** Full width
- **Icon:** Download icon
- **Label:** "Generate & Download Report"
- **Action:**
  - Generates report in selected format
  - Includes watermark with user, timestamp, and IP
  - Logs export action in audit trail
  - Downloads file to user's browser

---

## 9. CONFIGURATION & TOGGLE BEHAVIOR SUMMARY

This section consolidates all configurable UI options and toggle behaviors across the Admin Portal.

### 9.1 Donation Form Settings Toggles

#### Enable Donation Form
- **ENABLED:** Form is publicly accessible; donors can donate
- **DISABLED:** Form is hidden; maintenance message is shown to donors; Maintenance Message field becomes visible

#### Test Mode
- **ENABLED:** Test Mode banner appears; no real transactions are processed; useful for QA testing
- **DISABLED:** Normal production mode; real transactions are processed

#### Multi-Country Support
- **ENABLED:** Country dropdown is shown in donor form; donors can select any country
- **DISABLED:** Country defaults to "India"; state dropdown shows only Indian states

#### Require Address
- **ENABLED:** Address field is mandatory in donor form
- **DISABLED:** Address field is optional

#### Require Mobile Number
- **ENABLED:** Mobile number field is mandatory
- **DISABLED:** Mobile number field is optional

#### Suggest Recurring Donations
- **ENABLED:** Recurring donation checkbox is shown in donor form
- **DISABLED:** Recurring option is hidden; all donations are one-time

### 9.2 PAN Card Requirement (Radio Options)
- **Always Required:** PAN mandatory for all donation amounts
- **Threshold Based (₹2,000+):** PAN mandatory only for donations ≥ ₹2,000
- **Optional for International:** PAN not required for non-Indian donors

### 9.3 Transaction Actions

#### Refund Processing
- **Amount ≤ ₹10,000:** Refund processed immediately; no approval required
- **Amount > ₹10,000:** Refund sent to Pending Approvals queue; requires Super Admin approval

---

## 10. END-TO-END UI FUNCTIONAL FLOWS

### 10.1 Admin Login Flow

1. **Start:** Admin navigates to portal URL
2. **Login Screen:**
   - Admin enters email and password
   - Client-side validation: email format, non-empty fields
   - Admin clicks "Login" button
3. **Authentication:**
   - Credentials submitted to backend
   - If invalid: Error message displayed, flow ends
   - If valid: Proceed to 2FA
4. **Two-Factor Authentication:**
   - OTP sent to admin's registered contact
   - 2FA screen displayed
   - Admin enters 6-digit OTP
   - Admin clicks "Verify" button
5. **OTP Validation:**
   - OTP submitted to backend
   - If invalid: Error message, admin can retry or resend
   - If valid: Authentication complete
6. **Dashboard:**
   - Admin is redirected to Dashboard screen
   - Session is established
   - UI loaded with user-specific permissions

### 10.2 Donor Search and View Flow

1. **Start:** Admin navigates to "All Donors" screen
2. **Initial Load:**
   - Full donor list displayed in table
   - Default sorting and pagination applied
3. **Search:**
   - Admin types search query in search box
   - Table filters in real-time (client-side filtering)
   - Matching donors displayed
4. **Apply Filters:**
   - Admin selects status filter (e.g., "Active")
   - Admin selects tags filter (e.g., "VIP")
   - Table updates to show filtered results
5. **View Donor Profile:**
   - Admin clicks on donor row or View icon
   - Donor profile drawer slides in from right
   - Donor information card displayed
   - Statistics cards populated with donor data
6. **View Donation History:**
   - Admin clicks "Donation History" tab
   - List of donations displayed with details
   - Each donation shows date, amount, category, receipt number
7. **Download Receipt:**
   - Admin clicks Download button next to donation
   - Receipt PDF is generated and downloaded
8. **Close Drawer:**
   - Admin clicks X or outside drawer
   - Drawer slides out and closes
   - Table remains in filtered state

### 10.3 Transaction Refund Flow

1. **Start:** Admin navigates to "Transactions" screen
2. **Search Transaction:**
   - Admin uses search or filters to find transaction
   - Successful transactions display refund icon
3. **Open Transaction Details:**
   - Admin clicks View icon or transaction row
   - Transaction details drawer opens
   - Payment information and amount breakdown displayed
4. **Initiate Refund:**
   - Admin clicks "Process Refund" button
   - Refund modal opens
5. **Configure Refund:**
   - Transaction summary displayed
   - Admin selects refund type:
     - **Full Refund:** Amount auto-filled
     - **Partial Refund:** Admin enters custom amount
   - Validation: Amount must be ≤ original amount
6. **Approval Warning:**
   - If amount > ₹10,000: Warning shown ("Requires Super Admin approval")
   - If amount ≤ ₹10,000: Info shown ("Will be processed immediately")
7. **Enter Reason:**
   - Admin enters reason in textarea
   - Validation: Reason is mandatory
8. **Submit Refund:**
   - Admin clicks "Process Refund" button
   - **If amount ≤ ₹10,000:**
     - Refund processed immediately
     - Success toast: "Refund processed successfully"
     - Transaction status updated to "Refunded"
   - **If amount > ₹10,000:**
     - Refund request created
     - Added to Pending Approvals queue
     - Success toast: "Refund request submitted for Super Admin approval"
9. **Close Modal:**
   - Modal closes
   - Transaction details drawer refreshes
   - Transactions table updates

### 10.4 Donation Form Settings Update Flow

1. **Start:** Admin navigates to "Donation Form Settings"
2. **View Current Settings:**
   - All current configuration values displayed
   - Toggles show current state (ON/OFF)
   - Preset amounts listed
3. **Modify Settings:**
   - Admin changes any setting (e.g., toggles "Test Mode" ON)
   - UI immediately reflects change
   - Sticky save bar appears at bottom of screen
   - "You have unsaved changes" message displayed
4. **Continue Editing:**
   - Admin can modify multiple settings
   - All changes tracked in UI
   - No data sent to server yet
5. **Save Changes:**
   - Admin clicks "Save Changes" button in sticky bar
   - All settings validated
   - Settings saved to database
   - New version created in version history
   - Success toast: "Settings saved successfully"
   - Sticky save bar disappears
6. **Alternative: Discard Changes:**
   - Admin clicks "Discard" button
   - All fields reset to last saved state
   - Sticky save bar disappears
   - Info toast: "Changes discarded"

### 10.5 Report Generation and Export Flow

1. **Start:** Admin navigates to "Fund Collection Report"
2. **Set Filters:**
   - Admin selects date range (e.g., "This Month")
   - Admin selects donation type (e.g., "Online")
   - Admin selects category (e.g., "Education")
   - Admin clicks "Apply Filters"
3. **View Report:**
   - Statistics cards update with filtered data
   - Charts refresh with new data
   - Trend chart displays daily collection amounts
   - Category distribution pie chart updates
   - Payment method bar chart updates
   - Top donors list refreshes
4. **Navigate Tabs:**
   - Admin can switch between Summary, Transactions, Export tabs
   - Each tab displays relevant content
5. **Export Report (Export Tab):**
   - Admin clicks "Export" tab
   - Export format selector displayed
   - Admin selects format (e.g., "Excel (.xlsx)")
   - Watermark information displayed
6. **Generate Export:**
   - Admin clicks "Generate & Download Report"
   - Server generates report with:
     - Current user name
     - Timestamp
     - IP address watermark
     - Selected filters applied
   - Export action logged in audit trail
   - File downloaded to admin's browser
7. **Success:**
   - File successfully downloaded
   - Admin can open and review report
   - Audit log entry created

---

## 11. NOTIFICATIONS & COMMUNICATION (ADMIN PERSPECTIVE)

### 11.1 In-App Notifications

#### 11.1.1 Notification Bell (Header)
- **Location:** Top-right corner of header
- **Display:** Bell icon with badge count
- **Badge:** Shows count of unread notifications
- **Click Action:** Opens notification dropdown

#### 11.1.2 Notification Types
- **Error Notifications:** Critical issues requiring immediate attention
- **Warning Notifications:** Important issues to review
- **Info Notifications:** General informational messages
- **Success Notifications:** Confirmations of successful actions

### 11.2 Toast Notifications

**Library:** Sonner or similar toast library  
**Position:** Top-right corner  
**Duration:** 3-5 seconds (auto-dismiss)

#### 11.2.1 Success Toasts
- **Color:** Green
- **Icon:** Checkmark
- **Examples:**
  - "Settings saved successfully"
  - "Refund processed successfully"
  - "Receipt downloaded"

#### 11.2.2 Error Toasts
- **Color:** Red
- **Icon:** X or Alert
- **Examples:**
  - "Payment failed. Please try again."
  - "Failed to save settings"

#### 11.2.3 Info Toasts
- **Color:** Blue
- **Icon:** Info icon
- **Examples:**
  - "Logged out successfully"
  - "Changes discarded"

### 11.3 Email Notifications (Backend Integration)

**Trigger Points:**
- Successful donation (receipt email to donor)
- Failed donation (alert to admin)
- Refund approved (confirmation to donor)
- Pending approval required (notification to Super Admin)

**Email Behavior (UI Perspective):**
- **Enabled:** Emails are sent automatically on trigger events
- **Disabled:** No emails sent; notifications only in-app

### 11.4 Alerts Panel (Dashboard)

**Purpose:** Display system-wide alerts requiring administrative action

**Alert Structure:**
- Error, Warning, or Info classification
- Alert title and detailed message
- Timestamp (relative time)
- Click action to navigate to relevant screen

**Examples:**
- "Reconciliation Mismatch - 3 transactions from 14 Jan 2026 need attention" (Error)
- "Failed Email Delivery - 5 receipt emails failed to send" (Warning)
- "Enquiries Pending >48hrs - 4 enquiries need response" (Info)

---

## 12. VALIDATION, COMPLIANCE & AUDIT (UI LEVEL)

### 12.1 Field Validation Rules

#### Email Fields
- **Format:** Must match email regex pattern
- **Example Valid:** user@example.com
- **Error Message:** "Invalid email format"

#### Mobile Number Fields
- **Format:** 10-digit numeric
- **Example Valid:** 9876543210
- **Error Message:** "Mobile must be 10 digits"

#### PAN Number Fields
- **Format:** AAAAA0000A (5 letters, 4 digits, 1 letter)
- **Case:** Auto-converted to uppercase
- **Example Valid:** ABCDE1234F
- **Error Message:** "Invalid PAN format (e.g., AAAAA0000A)"

#### Amount Fields
- **Type:** Positive number
- **Validation:** Must be between minimum and maximum thresholds
- **Error Messages:**
  - "Minimum donation amount is ₹100"
  - "Maximum donation amount is ₹50,000"

#### Required Fields
- **Indicator:** Red asterisk (*) next to label
- **Validation:** Must not be empty
- **Error Message:** "[Field name] is required"

### 12.2 Conditional Validations

#### PAN Requirement (Based on Configuration)
- **Threshold Mode:** If donation ≥ ₹2,000, PAN is required
- **Always Mode:** PAN is required for all donations
- **International Mode:** PAN not required if country ≠ India

#### Address Requirement
- **If Enabled:** Address field must be filled
- **If Disabled:** Address field is optional

### 12.3 Audit Trail (UI Perspective)

**Logged Actions:**
- Admin login/logout events
- Donation form settings changes (version history)
- Refund requests and approvals
- Report exports (with watermark)
- Transaction status changes

**Audit Log Display:**
- Not shown in current UI implementation
- Backend logging only
- Watermarks on exports provide traceability

**Export Watermark Example:**
- "Generated by Super Admin on 20 Jan 2026, 10:30 AM from 192.168.1.100"

### 12.4 Compliance Features

#### Data Integrity
- All changes tracked via version history
- Refund reasons stored for audit
- Transaction details immutable after creation

#### Access Control
- User roles determine visible screens and actions
- Super Admin approval required for high-value refunds

#### Data Export Compliance
- All exports watermarked with user and timestamp
- Export actions logged in audit trail
- Helps with GDPR and financial compliance requirements

---

## 13. ADDITIONAL ADMIN SCREENS (REFERENCE)

The following screens are referenced in the navigation but not fully implemented in the analyzed files. They are noted here for completeness:

### 13.1 Users & Roles (`/settings/users-roles`)
- User management interface
- Role assignment and permissions
- Create/edit/delete user accounts

### 13.2 Reconciliation (`/payments/reconciliation`)
- Match payment gateway transactions with internal records
- Identify discrepancies
- Reconciliation reports

### 13.3 Gateway Settings (`/payments/gateway-settings`)
- Configure payment gateway credentials
- Test mode settings
- Gateway-specific configurations

### 13.4 E-Challan Entry (`/payments/e-challan-entry`)
- Manual entry of offline donations
- Generate e-challans for tracking

### 13.5 Receipt Management (`/receipts/management`)
- Manage receipt generation
- Re-generate or cancel receipts
- Receipt templates

### 13.6 Receipt Register (`/reports/receipt-register`)
- Comprehensive register of all generated receipts
- Filter and search receipts
- Export receipt register

### 13.7 Donation Categories (`/master-data/donation-categories`)
- Manage donation categories
- Add/edit/delete categories
- Set 80G eligibility per category

### 13.8 Enquiries (`/communications/enquiries`)
- View and respond to donor enquiries
- Track enquiry status
- Enquiry response templates

### 13.9 Templates (`/communications/templates`)
- Email and SMS templates
- Template variables and placeholders
- Preview and test templates

### 13.10 Automation (`/communications/automation`)
- Automated email/SMS workflows
- Trigger conditions
- Workflow management

### 13.11 Website Content (`/website/content`)
- Manage website content
- Update text, images, banners
- Content versioning

### 13.12 Sponsors (`/website/sponsors`)
- Manage sponsor information
- Upload sponsor logos
- Display order and visibility

### 13.13 Gallery (`/website/gallery`)
- Upload and manage images
- Gallery categories
- Image metadata

---

## 14. SCREEN NAVIGATION MAP

```
Login → 2FA → Dashboard
  ├─ Dashboard
  │    ├─ Quick Actions → E-Challan Entry
  │    └─ Alerts → Contextual Navigation
  │
  ├─ Donors
  │    └─ All Donors
  │         └─ Donor Profile Drawer
  │              ├─ Overview Tab
  │              ├─ Donation History Tab
  │              ├─ Communication Tab
  │              └─ Notes Tab
  │
  ├─ Payments
  │    ├─ Transactions
  │    │    └─ Transaction Details Drawer
  │    │         └─ Refund Modal
  │    ├─ Reconciliation
  │    ├─ Gateway Settings
  │    └─ E-Challan Entry
  │
  ├─ Receipts
  │    └─ Receipt Management
  │
  ├─ Reports
  │    ├─ Fund Collection Report
  │    │    ├─ Summary Tab
  │    │    ├─ Transactions Tab
  │    │    └─ Export Tab
  │    └─ Receipt Register
  │
  ├─ Master Data
  │    └─ Donation Categories
  │
  ├─ Communications
  │    ├─ Enquiries
  │    ├─ Templates
  │    └─ Automation
  │
  ├─ Website
  │    ├─ Content
  │    ├─ Sponsors
  │    └─ Gallery
  │
  └─ Settings
       ├─ Donation Form Settings
       │    └─ Version History Drawer
       └─ Users & Roles
```

---

## 15. UI COMPONENT SPECIFICATIONS

### 15.1 Common Components

#### Card Component
- **Padding:** 24px
- **Border Radius:** 16px
- **Background:** White (#FFFFFF)
- **Border:** 1px solid #DBDBDB
- **Shadow:** Subtle box shadow for depth

#### Button Components

**Primary Button**
- **Background:** Orange (#F36A4F)
- **Text Color:** White
- **Height:** 44px
- **Border Radius:** 999px (fully rounded)
- **Hover:** Darkens to #D7563D

**Outline Button**
- **Background:** Transparent
- **Border:** 1px solid #DBDBDB
- **Text Color:** Dark gray (#3D3D3D)
- **Height:** 44px
- **Border Radius:** 999px
- **Hover:** Border color changes to orange

**Danger Button**
- **Background:** Red
- **Text Color:** White
- **Height:** 44px
- **Border Radius:** 999px
- **Hover:** Darkens

**Ghost Button**
- **Background:** Transparent
- **Border:** None
- **Text Color:** Gray (#6E6E6E)
- **Hover:** Background lightens

#### Input Components

**Text Input**
- **Height:** 44px
- **Padding:** 14px
- **Border:** 1px solid #DBDBDB
- **Border Radius:** 16px
- **Focus:** Orange ring (2px, 20% opacity)
- **Font Size:** 16px

**Textarea**
- **Padding:** 12px 14px
- **Border:** 1px solid #DBDBDB
- **Border Radius:** 16px
- **Focus:** Orange ring
- **Font Size:** 16px
- **Resize:** None (fixed or vertical only)

**Select Dropdown**
- **Height:** 44px
- **Padding:** 14px
- **Border:** 1px solid #DBDBDB
- **Border Radius:** 16px
- **Caret:** Chevron down icon

**Switch/Toggle**
- **Size:** Standard switch size
- **Active Color:** Orange (#F36A4F)
- **Inactive Color:** Gray (#DBDBDB)

#### Badge Component
- **Padding:** 4px 12px
- **Border Radius:** 999px (fully rounded)
- **Font Size:** 13px
- **Font Weight:** 500
- **Variants:**
  - Success: Green background
  - Failed/Danger: Red background
  - Processing/Warning: Yellow background
  - Info: Blue background

#### Modal Component
- **Overlay:** Semi-transparent black (#00000080)
- **Background:** White
- **Border Radius:** 16px
- **Max Width:** 600px (medium)
- **Padding:** 24px
- **Shadow:** Large box shadow

#### Drawer Component
- **Position:** Slides from right edge
- **Width:** 480px or 600px
- **Background:** White
- **Shadow:** Large left shadow
- **Close:** X button in top-right

### 15.2 Typography

**Headings:**
- **H1 (Page Title):** 28px, bold, #0D0D0D
- **H2 (Section Title):** 22px, bold, #0D0D0D
- **H3 (Card Title):** 18px, semibold, #0D0D0D
- **H4 (Subsection):** 16px, semibold, #0D0D0D

**Body Text:**
- **Regular:** 16px, normal, #3D3D3D
- **Small:** 14px, normal, #3D3D3D
- **Label:** 13px, medium, #6E6E6E
- **Helper Text:** 12px, normal, #6E6E6E

### 15.3 Color Palette

**Primary Colors:**
- Orange: #F36A4F
- Dark Orange: #D7563D
- Light Orange (backgrounds): #FEF1EE, #FEF7F6
- Brown: #734F48
- Light Brown: #F1EEED

**Grays:**
- Black: #0D0D0D
- Dark Gray: #3D3D3D
- Mid Gray: #6E6E6E
- Light Gray: #9E9E9E
- Border Gray: #DBDBDB
- Background Gray: #F3F3F3

**Semantic Colors:**
- Success Green: Various shades
- Error Red: #F36A4F (reuses primary orange family)
- Warning Yellow: Various shades
- Info Blue: Various shades

---

## 16. APPENDIX

### 16.1 Glossary

- **80G:** Tax deduction benefit under Indian Income Tax Act
- **Badge:** UI component displaying status or category
- **Drawer:** Slide-out panel from screen edge
- **Modal:** Overlay dialog box
- **OTP:** One-Time Password for two-factor authentication
- **PAN:** Permanent Account Number (Indian tax identifier)
- **Toggle:** On/Off switch component
- **Toast:** Temporary notification message

### 16.2 Technology Stack Reference

- **Framework:** React with TypeScript
- **Routing:** React Router (client-side SPA routing)
- **UI Components:** Custom components + shadcn/ui library
- **Charts:** Recharts library
- **Icons:** Lucide React
- **Styling:** Tailwind CSS
- **Notifications:** Sonner (toast library)

### 16.3 Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | Technical Team | Initial comprehensive specification |

---

**END OF DOCUMENT**
