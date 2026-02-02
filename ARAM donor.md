# Aram Foundation User (Donor) Portal - Business Requirements Document

## Document Information
**Document Title:** Aram Foundation Site Revamp - Donor Portal Functional Specification  
**Version:** 3.0  
**Prepared For:** Aram Foundation  
**Document Type:** Business Requirements Document / Functional Specification  
**Date:** January 2026  
**Purpose:** This document provides a comprehensive technical specification of the Aram Foundation Donor Portal, documenting all UI components, fields, user interactions, validations, donation flows, and receipt management from the donor's perspective.

---

## 1. INTRODUCTION

### 1.1 Purpose of the Donor Portal
The Aram Foundation Donor Portal is a web-based donor-facing application that enables individuals to make donations, create accounts, track their donation history, download receipts and tax documents, and manage their donor profiles. The portal provides both guest donation capabilities and full-featured logged-in experiences.

### 1.2 Scope
This document covers all UI-level functionality for donor users, including:
- Guest donation flow (no account required)
- Account creation and authentication
- Logged-in donation flow
- Dashboard and donation history
- Reports and tax documents (80G)
- Profile management
- Payment processing UI

### 1.3 User Types
- **Guest Donor:** Users who donate without creating an account
- **Registered Donor:** Users who create an account and sign in
- **Returning Donor:** Registered donors who sign in for subsequent donations

---

## 2. ENTRY POINT & LANDING SCREEN

**Screen:** Entry Page  
**Route:** `/entry` (default landing screen)  
**Purpose:** Primary entry point for all donor interactions

### 2.1 UI Layout

#### 2.1.1 Screen Structure
- **Container Width:** Fixed width (1440px) centered on screen
- **Min Height:** 900px
- **Background:** White (#FFFFFF)
- **Branding:** Aram Foundation logo and mission statement displayed prominently

#### 2.1.2 Call-to-Action Buttons

**Login to Donate Button**
- **Style:** Primary button (orange #F36A4F)
- **Label:** "Login to Donate"
- **Icon:** None
- **Action:** Navigates to Sign In screen
- **Purpose:** For existing registered donors who want to donate while logged in

**Donate as Guest Button**
- **Style:** Secondary/outline button
- **Label:** "Donate as Guest"
- **Icon:** None
- **Action:** Navigates to Guest Donation form
- **Purpose:** For users who want to donate without creating an account

### 2.2 User Flow from Entry Page

**Path 1: Existing User**
1. Click "Login to Donate" → Sign In Screen → Dashboard → Donate Screen

**Path 2: New User (Account Creation)**
1. Click "Login to Donate" → Sign In Screen → Click "Create Account" → Create Account Screen → Dashboard

**Path 3: Guest Donation**
1. Click "Donate as Guest" → Guest Donation Form → Payment Processing → Entry Page

---

## 3. ACCOUNT CREATION SCREEN

**Screen:** Create Account  
**Route:** `/create-account`  
**Purpose:** Allow new donors to register for an account

### 3.1 Page Header

#### 3.1.1 Back Button
- **Icon:** Arrow Left icon
- **Label:** "Back"
- **Action:** Returns to Entry Page
- **Style:** Text button with icon
- **Color:** Gray (#6E6E6E) with hover effect

#### 3.1.2 Page Title
- **Title:** "Create Account"
- **Subtitle:** "Join us to make a difference"
- **Alignment:** Center-aligned

### 3.2 Form Fields

#### 3.2.1 Name Field
- **Label:** "Name"
- **Field Type:** Text input
- **Placeholder:** "Enter your full name"
- **Mandatory:** Yes (red asterisk)
- **Validation:**
  - Must not be empty
  - Error Message: "Name is required"

#### 3.2.2 Email Field
- **Label:** "Email ID"
- **Field Type:** Email input
- **Placeholder:** "Enter your email"
- **Mandatory:** Yes
- **Validation:**
  - Must not be empty
  - Must match email format (pattern: \S+@\S+\.\S+)
  - Error Messages:
    - "Email is required"
    - "Email format is invalid"

#### 3.2.3 Phone Number Field
- **Label:** "Phone Number"
- **Field Type:** Tel input
- **Placeholder:** "10-digit phone number"
- **Mandatory:** Yes
- **Validation:**
  - Must not be empty
  - Must be exactly 10 digits
  - Error Messages:
    - "Phone number is required"
    - "Phone must be 10 digits"

#### 3.2.4 Create Password Field
- **Label:** "Create Password"
- **Field Type:** Password input (with toggle visibility)
- **Placeholder:** "Min 8 characters"
- **Mandatory:** Yes
- **Show/Hide Toggle:** Eye/EyeOff icon button in field
- **Helper Text:** "Must contain: 8+ characters, uppercase, number, special character"
- **Validation:**
  - Must not be empty
  - Must be at least 8 characters
  - Must contain at least one uppercase letter (A-Z)
  - Must contain at least one number (0-9)
  - Must contain at least one special character (!@#$%^&*)
  - Error Messages:
    - "Password is required"
    - "Password must be at least 8 characters"
    - "Password must contain uppercase letter"
    - "Password must contain a number"
    - "Password must contain special character"

#### 3.2.5 Confirm Password Field
- **Label:** "Confirm Password"
- **Field Type:** Password input (with toggle visibility)
- **Placeholder:** "Re-enter password"
- **Mandatory:** Yes
- **Show/Hide Toggle:** Eye/EyeOff icon button
- **Validation:**
  - Must match value of Create Password field
  - Error Message: "Passwords do not match"

#### 3.2.6 Terms & Conditions Checkbox
- **Field Type:** Checkbox
- **Label:** "I agree to the Terms of Service and Privacy Policy"
- **Font Size:** 13px
- **Color:** Gray (#6E6E6E)
- **Mandatory:** Implicit (user cannot proceed without agreeing)

### 3.3 Form Actions

#### 3.3.1 Create Account Button
- **Label:** "Create account & continue"
- **Style:** Primary button (full width)
- **Action:**
  - Validates all fields
  - If validation passes:
    - Creates user account (backend integration)
    - Shows success toast: "Account created successfully!"
    - Navigates to Dashboard after brief delay (500ms)
  - If validation fails:
    - Displays inline error messages below each invalid field
    - Button remains enabled for retry

#### 3.3.2 Sign In Link
- **Label:** "Already have an account? Sign in"
- **Style:** Text link
- **Color:** Orange (#F36A4F)
- **Action:** Navigates to Sign In screen

### 3.4 Account Creation Flow

1. User fills in all required fields
2. User checks Terms & Conditions checkbox
3. User clicks "Create account & continue"
4. Frontend validates all fields:
   - Name: not empty
   - Email: not empty, valid format
   - Phone: not empty, exactly 10 digits
   - Password: meets complexity requirements
   - Confirm Password: matches password
5. If validation fails: inline errors displayed
6. If validation passes:
   - Account creation request sent to backend
   - Backend creates user record
   - User is auto-logged in
   - Success toast shown
   - User redirected to Dashboard

---

## 4. SIGN IN SCREEN

**Screen:** Sign In  
**Route:** `/sign-in`  
**Purpose:** Authentication for existing registered donors

### 4.1 Page Header

#### 4.1.1 Back Button
- **Icon:** Arrow Left
- **Label:** "Back"
- **Action:** Returns to Entry Page

#### 4.1.2 Page Title
- **Title:** "Sign In"
- **Subtitle:** "Welcome back! Sign in to continue"

### 4.2 Form Fields

#### 4.2.1 Email Field
- **Label:** "Email ID"
- **Field Type:** Email input
- **Placeholder:** "Enter your email"
- **Mandatory:** Yes
- **Validation:**
  - Must not be empty
  - Email format validation

#### 4.2.2 Password Field
- **Label:** "Password"
- **Field Type:** Password input (with visibility toggle)
- **Placeholder:** "Enter your password"
- **Mandatory:** Yes
- **Show/Hide Toggle:** Eye/EyeOff icon button

### 4.3 Form Actions

#### 4.3.1 Sign In Button
- **Label:** "Sign in & continue"
- **Style:** Primary button (full width)
- **Action:**
  - Validates credentials with backend
  - On success:
    - Success toast: "Signed in successfully!"
    - Navigates to Dashboard after 500ms
  - On failure:
    - Error toast: "Invalid credentials"

#### 4.3.2 Create Account Link
- **Label:** "Don't have an account? Create one"
- **Style:** Text link
- **Color:** Orange (#F36A4F)
- **Action:** Navigates to Create Account screen

### 4.4 Sign In Flow

1. User enters email and password
2. User clicks "Sign in & continue"
3. Frontend sends credentials to backend
4. Backend validates credentials
5. If valid:
   - Session created
   - User state updated to logged in
   - Success toast displayed
   - Redirect to Dashboard
6. If invalid:
   - Error toast displayed
   - User can retry

---

## 5. DASHBOARD SCREEN (LOGGED-IN DONOR)

**Screen:** Dashboard  
**Route:** `/dashboard`  
**Access:** Requires authentication  
**Purpose:** Overview of donor's donation history and quick access to donate

### 5.1 Header Navigation

**Component:** Portal Header  
**Position:** Top of screen, full width

#### 5.1.1 Navigation Menu Items
- **Dashboard:** Active/current page
- **Donate:** Link to donation form
- **Reports:** Link to reports and tax documents
- **Profile:** Link to profile settings

#### 5.1.2 User Profile Section
- **Display:** User name shown
- **Logout Button:** Dropdown or direct logout action
- **Action:** Logs out user, returns to Entry Page

### 5.2 Welcome Hero Card

**Background:** White card with padding

#### 5.2.1 Content
- **Greeting:** "Welcome back, [User Name]!"
- **Subtitle:** "Your contributions are making a real difference in our community"
- **Action Button:**
  - Label: "Donate Now"
  - Icon: Heart icon
  - Style: Primary button
  - Action: Navigates to Donate screen (/donate)

### 5.3 Summary Statistics Cards (4-column grid)

#### 5.3.1 Total Donated Card
- **Label:** "Total Donated"
- **Value:** "₹8,500" (large, bold, orange color)
- **Calculation:** Sum of all successful donations by this donor

#### 5.3.2 Donations Count Card
- **Label:** "Donations Count"
- **Value:** "3" (large, bold, black)
- **Calculation:** Total number of donations

#### 5.3.3 Last Donation Date Card
- **Label:** "Last Donation Date"
- **Value:** "2025-01-15" (medium font)
- **Source:** Date of most recent donation

#### 5.3.4 80G Eligible Card
- **Label:** "80G Eligible (FY 2024-25)"
- **Value:** "₹8,500" (large, bold, brown color)
- **Calculation:** Sum of donations eligible for 80G tax benefit in current financial year
- **Purpose:** Shows tax-deductible donation amount

### 5.4 My Donations Table

**Card Title:** "My Donations"  
**Layout:** Full-width table with horizontal scroll on mobile

#### 5.4.1 Table Columns

**Date**
- Data Type: Date
- Format: "2025-01-15"
- Header Style: Bold, gray background

**Receipt No**
- Data Type: Text
- Format: "AR2501150001"
- Example: Unique receipt identifier

**Donation Type**
- Data Type: Text
- Examples: "Education Fund", "Medical Fund", "General Fund"

**Amount**
- Data Type: Currency (INR)
- Format: "₹5,000"
- Font Weight: Bold

**Status**
- Data Type: Badge
- Value: "Success" (green badge)
- Other possible values: "Failed", "Pending"

**Download**
- Display: Download button with Receipt icon
- Label: "Receipt"
- Action: Downloads receipt PDF for that donation

#### 5.4.2 Table Behavior
- **Rows:** Each donation displayed as separate row
- **Row Height:** 52px
- **Row Separator:** 1px border between rows
- **Empty State:** If no donations, message: "No donations yet" with button "Make your first donation"

### 5.5 Upcoming Special Events Section

**Card Title:** "Upcoming Special Events / Donation Requests"

**Purpose:** Display foundation events or special donation drives

#### 5.5.1 Event Card Structure

Each event displayed as card:
- **Background:** Light orange (#FEF7F6)
- **Border:** Orange border
- **Padding:** 16px

**Event Information:**
- **Event Title:** Bold, 16px (e.g., "Annual Medical Camp 2025")
- **Date:** With calendar icon (e.g., "2025-02-15")
- **Description:** Brief description (e.g., "Support our community health initiative")

**Action Button:**
- **Label:** "Donate"
- **Style:** Primary button
- **Action:** Navigates to Donate screen

**Empty State:**
- Message: "No upcoming events"

### 5.6 Impact / Funds Utilized Section

**Card Title:** "Impact / Funds Utilized"  
**Purpose:** Show how donations are being used

**Content:**
- **Paragraph:** "Your contributions have helped us serve the community across multiple programs."

**Statistics Grid (3 columns):**

**Education Programs**
- **Value:** "45%"
- **Color:** Orange (#F36A4F)
- **Background:** Gray (#F3F3F3)

**Medical Assistance**
- **Value:** "30%"
- **Color:** Orange

**Community Building**
- **Value:** "25%"
- **Color:** Orange

---

## 6. DONATE SCREEN (LOGGED-IN DONOR)

**Screen:** Donate (Logged In)  
**Route:** `/donate`  
**Access:** Requires authentication  
**Purpose:** Donation form for logged-in users with pre-filled personal information

### 6.1 Page Header
- **Title:** "Make a Donation"
- **Subtitle:** "Your support helps us continue our mission"

### 6.2 Pre-filled User Information (Read-Only Section)

**Background:** Gray (#F3F3F3)  
**Border Radius:** 16px  
**Layout:** 3-column grid

**Displayed Fields:**
- **Name:** [User's registered name]
- **Email:** [User's registered email]
- **Phone:** [User's registered phone]

**Display Style:**
- Labels: 13px, gray
- Values: 14px, bold, black
- Not editable (read-only display)

**Purpose:**
- Shows donor that their profile information will be used
- Saves time by not re-entering data
- Ensures consistency with account information

### 6.3 Donation Amount Selection

#### 6.3.1 Section Label
- **Label:** "Donation Amount *"
- **Asterisk:** Red (indicates required)
- **Font Size:** 13px
- **Font Weight:** Medium

#### 6.3.2 Preset Amount Buttons

**Default Preset Values:** ₹500, ₹1,000, ₹2,500, ₹5,000

**Button Styling:**
- **Unselected State:**
  - Border: Gray (#DBDBDB)
  - Background: White
  - Text Color: Dark gray (#3D3D3D)
  - Hover: Border changes to orange

- **Selected State:**
  - Border: Orange (#F36A4F)
  - Background: Light orange (#FEF1EE)
  - Text Color: Orange (#F36A4F)

**Button Behavior:**
- Click selects preset amount
- Clears custom amount field if previously filled
- Only one preset can be selected at a time

#### 6.3.3 Custom Amount Field
- **Field Type:** Number input
- **Placeholder:** "Enter custom amount"
- **Behavior:**
  - When user types: deselects any preset amount
  - Only numeric values accepted
- **Helper Text:** "Min: ₹100, Max: ₹50,000"
- **Validation:**
  - Must be ≥ ₹100
  - Must be ≤ ₹50,000
  - Error Message: "Minimum donation amount is ₹100" or "Maximum donation amount is ₹50,000"

### 6.4 Additional Required Fields

#### 6.4.1 Address Field
- **Field Type:** Textarea
- **Label:** "Address *"
- **Placeholder:** "Enter your complete address"
- **Rows:** 3
- **Mandatory:** Yes
- **Validation:**
  - Must not be empty
  - Error Message: "Address is required"

#### 6.4.2 PAN Number Field
- **Label:** "PAN Number *"
- **Field Type:** Text input
- **Placeholder:** "AAAAA0000A"
- **Mandatory:** Yes
- **Auto-Transform:** Converts to uppercase as user types
- **Helper Text:** "Format: AAAAA0000A"
- **Validation:**
  - Must not be empty
  - Must match pattern: ^[A-Z]{5}[0-9]{4}[A-Z]{1}$
  - Error Messages:
    - "PAN number is required"
    - "Invalid PAN format (e.g., AAAAA0000A)"

#### 6.4.3 Country Field
- **Field Type:** Select dropdown
- **Label:** "Country *"
- **Default:** "India"
- **Options:**
  - India
  - United States
  - United Kingdom
  - Canada
- **Mandatory:** Yes
- **Validation:**
  - Must have selection
  - Error Message: "Country is required"

#### 6.4.4 Donation Type Field
- **Field Type:** Select dropdown
- **Label:** "Donation Type *"
- **Placeholder:** "Select donation type"
- **Mandatory:** Yes
- **Options:**
  - Aram Sei Fund
  - Building Fund
  - Education Fund
  - General Fund
  - Medical Fund
  - Sairam SAP
- **Validation:**
  - Must have selection
  - Error Message: "Please select a donation type"

### 6.5 Informational Messages

**Info Box:**
- **Background:** Light orange (#FEF1EE)
- **Border:** Orange (#FCD9D3)
- **Padding:** 16px

**Messages:**
- ✓ Receipt will be generated after successful payment
- ✓ 80G documents available in Reports section

### 6.6 Form Actions

#### 6.6.1 Pay Button
- **Label:** "Pay ₹[amount]" (dynamic based on selected/entered amount)
- **Style:** Primary button
- **Width:** Flex-grow (takes most of horizontal space)
- **Disabled State:** If amount < ₹100
- **Validation:** On click:
  - Validates all required fields
  - If validation passes:
    - Submits donation data
    - Navigates to Payment Processing screen
  - If validation fails:
    - Shows inline error messages

#### 6.6.2 Reset Button
- **Label:** "Reset"
- **Style:** Secondary button
- **Action:**
  - Clears all form inputs (except pre-filled user info)
  - Deselects preset amounts
  - Clears custom amount
  - Clears address, PAN, and donation type
  - Resets country to default (India)
  - Clears all error messages

### 6.7 Logged-In Donation Flow

1. User navigates to Donate screen from Dashboard or header
2. User information is pre-filled (name, email, phone)
3. User selects preset amount or enters custom amount
4. User enters address
5. User enters PAN number (auto-uppercased)
6. User selects country (defaults to India)
7. User selects donation type
8. User clicks "Pay ₹[amount]" button
9. Frontend validates all fields
10. If valid:
    - Donation data prepared with user profile info
    - User navigated to Payment Processing screen
11. If invalid:
    - Error messages displayed
    - User corrects and retries

---

## 7. GUEST DONATION SCREEN

**Screen:** Donate as Guest  
**Route:** `/donate-guest`  
**Access:** Public (no authentication required)  
**Purpose:** Allow one-time donations without account creation

### 7.1 Page Header
- **Back Button:** Returns to Entry Page
- **Title:** "Donate Without Signup"
- **Subtitle:** "Enter accurate details for receipt and 80G document delivery."

### 7.2 Personal Information Section

**Section Header:** "Personal Information"

#### 7.2.1 Name Field
- **Label:** "Name *"
- **Field Type:** Text input
- **Placeholder:** "Enter your full name"
- **Mandatory:** Yes
- **Validation:**
  - Must not be empty
  - Error Message: "Name is required"

#### 7.2.2 Email Field
- **Label:** "Email ID *"
- **Field Type:** Email input
- **Placeholder:** "Enter your email"
- **Mandatory:** Yes
- **Validation:**
  - Must not be empty
  - Must be valid email format
  - Error Messages:
    - "Email is required"
    - "Invalid email format"

#### 7.2.3 Mobile Number Field
- **Label:** "Mobile Number *"
- **Field Type:** Tel input
- **Placeholder:** "10-digit mobile number"
- **Mandatory:** Yes
- **Validation:**
  - Must not be empty
  - Must be exactly 10 digits
  - Error Messages:
    - "Mobile number is required"
    - "Mobile must be 10 digits"

#### 7.2.4 Address Field
- **Label:** "Address *"
- **Field Type:** Textarea
- **Placeholder:** "Enter your complete address"
- **Rows:** 3
- **Mandatory:** Yes
- **Validation:**
  - Must not be empty
  - Error Message: "Address is required"

### 7.3 Donation Details Section

**Section Header:** "Donation Details"

All fields identical to Logged-In Donate screen:
- Amount Selection (presets + custom)
- PAN Number field
- Country field
- Donation Type field

### 7.4 Informational Messages

**Info Box:**
- ✓ Receipt will be generated after successful payment
- ✓ 80G documents will be sent to your email

**Note:** Emphasizes that documents will be emailed since user doesn't have account access

### 7.5 Form Actions

#### 7.5.1 Pay Button
- Same as logged-in donate
- **Label:** "Pay ₹[amount]"
- **Validation:** Validates all personal information AND donation fields

#### 7.5.2 Reset Button
- **Label:** "Reset"
- **Action:** Clears ALL form fields (including personal information)

### 7.6 Guest Donation Flow

1. User clicks "Donate as Guest" from Entry Page
2. Guest donation form loaded
3. User enters personal information:
   - Name
   - Email
   - Mobile number
   - Address
4. User selects/enters donation amount
5. User enters PAN number
6. User selects country
7. User selects donation type
8. User clicks "Pay ₹[amount]"
9. Frontend validates ALL fields
10. If valid:
    - Donation data prepared
    - User navigated to Payment Processing screen
11. If invalid:
    - Error messages displayed for all invalid fields
    - User corrects and retries

**Key Difference from Logged-In Flow:**
- Guest must manually enter ALL information
- Receipt emailed instead of being available in Reports section
- No donation history stored in portal (only in backend for foundation records)

---

## 8. PAYMENT PROCESSING SCREEN

**Screen:** Payment Processing  
**Route:** `/payment-processing`  
**Access:** Follows donation submission  
**Purpose:** Display payment status (processing, success, or failure)

### 8.1 Processing State

**Display Condition:** Initial state after donation submission

#### 8.1.1 UI Elements
- **Loading Animation:** Spinner or animated icon
- **Status Message:** "Processing your payment..."
- **Sub-message:** "Please wait while we confirm your transaction"

**Behavior:**
- Shown for 2-3 seconds (simulating backend processing)
- Automatically transitions to success or failure state

### 8.2 Success State

**Display Condition:** Payment successfully processed

#### 8.2.1 UI Elements
- **Icon:** Green checkmark or success icon (large)
- **Status Message:** "Payment Successful!"
- **Sub-message:** "Thank you for your generous donation"

**Transaction Details:**
- **Amount:** "₹[amount]" (large, bold)
- **Donation Type:** [Selected category]
- **Receipt Number:** "AR2501150001" (unique identifier)

**Action Buttons:**

**Download Receipt Button**
- **Icon:** Download icon
- **Label:** "Download Receipt"
- **Style:** Primary button
- **Action:** Downloads receipt PDF
- **Toast:** "Downloading receipt..."

**Go to Dashboard Button**
- **Label:** "Go to Dashboard"
- **Style:** Outline button
- **Action:**
  - If user is logged in: Navigate to Dashboard
  - If user is guest: Navigate to Entry Page

### 8.3 Failure State

**Display Condition:** Payment failed

#### 8.3.1 UI Elements
- **Icon:** Red X or error icon (large)
- **Status Message:** "Payment Failed"
- **Sub-message:** "We couldn't process your payment. Please try again."

**Error Details (if available):**
- Error reason or code displayed
- Example: "Insufficient funds" or "Bank declined transaction"

**Action Buttons:**

**Try Again Button**
- **Label:** "Try Again"
- **Style:** Primary button
- **Action:**
  - If user is logged in: Navigate to /donate
  - If user is guest: Navigate to /donate-guest
  - Pre-fills form with previously entered data

**Go to Dashboard/Home Button**
- **Label:** "Go to Dashboard" (logged in) or "Go Home" (guest)
- **Style:** Outline button
- **Action:** Navigate accordingly

### 8.4 Payment Processing Flow

1. User submits donation from Donate or Guest Donate screen
2. Payment Processing screen loads with "Processing" state
3. Backend processes payment via payment gateway
4. After 2-3 seconds (or when backend responds):
   - If payment successful:
     - Success state displayed
     - Receipt number generated
     - Receipt PDF created
     - User can download receipt or return to dashboard
   - If payment failed:
     - Failure state displayed
     - Error message shown
     - User can retry or return home

---

## 9. REPORTS SCREEN (LOGGED-IN DONOR)

**Screen:** Reports  
**Route:** `/reports`  
**Access:** Requires authentication  
**Purpose:** View and download donation receipts and 80G tax documents

### 9.1 Page Header
- **Title:** "Reports & Documents"
- **Subtitle:** "Download receipts and tax documents"

### 9.2 Tab Navigation

**Available Tabs:**
1. Receipts (default)
2. 80G Reports
3. Tax Documents

**Tab Styling:**
- Active Tab: Orange underline border, orange text
- Inactive Tabs: Gray text, no underline, hover effect

### 9.3 Receipts Tab

**Purpose:** View and download individual donation receipts

#### 9.3.1 Filter Section

**Search Field:**
- **Placeholder:** "Search by receipt number"
- **Icon:** Search icon (right-side)
- **Behavior:** Filters table in real-time

**Financial Year Dropdown:**
- **Options:**
  - FY 2024-25
  - FY 2023-24
  - FY 2022-23
- **Default:** Current financial year

**Donation Type Dropdown:**
- **Options:**
  - All Types (default)
  - Aram Sei Fund
  - Building Fund
  - Education Fund
  - General Fund
  - Medical Fund
  - Sairam SAP
- **Behavior:** Filters receipts by selected type

#### 9.3.2 Receipts Table

**Table Columns:**

**Date**
- Format: "2025-01-15"
- Sortable: Yes

**Receipt No**
- Format: "AR2501150001"
- Font Weight: Bold
- Searchable

**Type**
- Donation category
- Example: "Education Fund"

**Amount**
- Format: "₹5,000"
- Font Weight: Bold
- Alignment: Right

**80G**
- Values: "Yes" (bold, brown color) or "No" (gray)
- Indicates 80G tax benefit eligibility

**Download**
- **Button Label:** "PDF"
- **Icon:** Download icon
- **Action:** Downloads receipt PDF for that specific donation
- **Color:** Orange

**Empty State:**
- Icon: File Text icon (gray, large)
- Message: "No receipts available yet"

### 9.4 80G Reports Tab

**Purpose:** Download annual 80G summary documents for tax purposes

#### 9.4.1 Summary Card

**Title:** "Annual 80G Summary"  
**Subtitle:** "These documents are generated based on successful donations."

**Action Button:**
- **Label:** "Download 80G Summary (FY 2024-25)"
- **Icon:** Download icon
- **Style:** Primary button
- **Action:** Downloads consolidated 80G PDF for current financial year

#### 9.4.2 Generated 80G Documents Table

**Title:** "Generated 80G Documents"

**Table Columns:**

**Financial Year**
- Format: "FY 2024-25"
- Font Weight: Bold

**Generated Date**
- Format: "2025-01-20"
- Shows when document was created

**Total Amount**
- Format: "₹8,500"
- Font Weight: Bold
- Sum of all 80G-eligible donations for that FY

**Download**
- **Button Label:** "Download PDF"
- **Icon:** Download icon
- **Action:** Downloads 80G PDF for that financial year
- **Color:** Orange

### 9.5 Tax Documents Tab

**Purpose:** Placeholder for future tax documents

**Empty State:**
- **Icon:** File Text icon (gray, large, 64px)
- **Title:** "No Tax Documents Available"
- **Message:** "Tax documents will appear here once generated"

### 9.6 Reports Access Flow

1. Logged-in donor navigates to Reports from header or dashboard
2. Receipts tab loaded by default
3. User can:
   - Search for specific receipt
   - Filter by financial year
   - Filter by donation type
   - Download individual receipt PDFs
4. User switches to 80G Reports tab:
   - Views annual summary
   - Downloads current year 80G document
   - Views historical 80G documents
   - Downloads past year documents
5. User switches to Tax Documents tab:
   - Sees empty state (future feature)

---

## 10. PROFILE SCREEN (LOGGED-IN DONOR)

**Screen:** Profile  
**Route:** `/profile`  
**Access:** Requires authentication  
**Purpose:** Manage account information, password, preferences, and privacy settings

### 10.1 Page Header
- **Title:** "Profile Settings"
- **Subtitle:** "Manage your account information and preferences"

### 10.2 Profile Information Card

**Card Title:** "Profile Information"  
**Card Subtitle:** "Update your personal details"

#### 10.2.1 Profile Photo Section

**Avatar Display:**
- **Shape:** Circular
- **Size:** 80px diameter
- **Background:** Gray (#F3F3F3)
- **Content:** First letter of user name (large, bold, orange)

**Upload Photo Button:**
- **Label:** "Upload Photo"
- **Icon:** Upload icon
- **Style:** Secondary button
- **Action:** Opens file picker (future implementation)

#### 10.2.2 Editable Fields

**Name Field:**
- **Label:** "Name"
- **Field Type:** Text input
- **Value:** Current user name
- **Editable:** Yes

**Email Field:**
- **Label:** "Email"
- **Field Type:** Email input
- **Value:** Current user email
- **Editable:** No (disabled/read-only)
- **Helper Text:** "Email cannot be changed"

**Phone Field:**
- **Label:** "Phone"
- **Field Type:** Tel input
- **Value:** Current user phone
- **Editable:** Yes
- **Helper Text:** "Verification required for changes"

#### 10.2.3 Profile Information Actions

**Save Changes Button:**
- **Style:** Primary button
- **Action:**
  - Validates name and phone
  - Updates profile information in backend
  - Success toast: "Profile updated successfully!"

**Cancel Button:**
- **Style:** Secondary button
- **Action:**
  - Resets name and phone to original values
  - Discards unsaved changes

### 10.3 Change Password Card

**Card Title:** "Change Password"  
**Card Subtitle:** "Update your password to keep your account secure"

#### 10.3.1 Password Fields

**Current Password:**
- **Label:** "Current Password"
- **Field Type:** Password input
- **Placeholder:** "Enter current password"

**New Password:**
- **Label:** "New Password"
- **Field Type:** Password input
- **Placeholder:** "Enter new password"
- **Helper Text:** "Min 8 characters, uppercase, number, special character"

**Confirm New Password:**
- **Label:** "Confirm New Password"
- **Field Type:** Password input
- **Placeholder:** "Re-enter new password"

#### 10.3.2 Update Password Action

**Update Password Button:**
- **Label:** "Update Password"
- **Style:** Primary button
- **Width:** Fit content (not full width)
- **Validation:**
  - New password must meet complexity requirements
  - Confirm password must match new password
- **Action:**
  - Validates all password fields
  - If valid:
    - Updates password in backend
    - Success toast: "Password updated successfully!"
    - Clears all password fields
  - If invalid:
    - Error alert: "Passwords do not match" or other specific error

### 10.4 Appearance Card

**Card Title:** "Appearance"  
**Card Subtitle:** "Choose your preferred theme"

#### 10.4.1 Theme Selection

**Layout:** 2-column button group

**Light Theme Button:**
- **Icon:** Sun icon (24px)
- **Label:** "Light"
- **Border:** 2px border
- **Selected State:**
  - Border Color: Orange (#F36A4F)
  - Background: Light orange (#FEF1EE)
  - Icon Color: Orange
  - Text Color: Orange
- **Unselected State:**
  - Border Color: Gray (#DBDBDB)
  - Background: White
  - Icon Color: Gray
  - Text Color: Gray

**Dark Theme Button:**
- **Icon:** Moon icon (24px)
- **Label:** "Dark"
- **Selected/Unselected:** Same styling as Light theme button

**Behavior:**
- Click selects theme (future feature - currently visual only)
- Only one theme can be selected at a time

### 10.5 Privacy & Data Card

**Card Title:** "Privacy & Data"  
**Card Subtitle:** "Manage your data and account"

#### 10.5.1 Download Data Option

**Download My Donation History Button:**
- **Icon:** Download icon
- **Label:** "Download My Donation History"
- **Style:** Secondary button
- **Width:** Fit content
- **Action:** Downloads CSV/PDF of all donations

#### 10.5.2 Delete Account Option

**Delete Account Button:**
- **Label:** "Delete Account"
- **Style:** Text button (no background)
- **Color:** Red/Orange (#F36A4F)
- **Font Weight:** Bold
- **Action:** Shows delete warning box

**Delete Warning Box:**
- **Display Condition:** Only when "Delete Account" is clicked
- **Background:** Light orange (#FEF1EE)
- **Border:** Orange (#FCD9D3)
- **Padding:** 16px

**Warning Content:**
- **Icon:** Alert Triangle icon (orange, 20px)
- **Title:** "Are you sure you want to delete your account?"
- **Message:** "This action cannot be undone. All your data, including donation history, will be permanently deleted."

**Warning Actions:**

**Yes, Delete Account Button:**
- **Style:** Danger button (red)
- **Action:** Deletes account (requires backend confirmation)

**Cancel Button:**
- **Style:** Secondary button
- **Action:** Hides warning box, cancels deletion

### 10.6 Profile Management Flow

**Update Profile:**
1. User navigates to Profile screen
2. User edits Name or Phone
3. User clicks "Save Changes"
4. Frontend validates changes
5. Backend updates user record
6. Success toast shown
7. Profile display refreshed

**Change Password:**
1. User enters current password
2. User enters new password (meets requirements)
3. User confirms new password
4. User clicks "Update Password"
5. Frontend validates:
   - New password meets complexity
   - Confirm matches new
6. Backend verifies current password
7. Backend updates password
8. Success toast shown
9. All password fields cleared

**Delete Account:**
1. User clicks "Delete Account"
2. Warning box appears
3. User reads warning
4. User clicks "Yes, Delete Account"
5. Confirmation modal (if implemented)
6. Backend deletes account
7. User logged out
8. Redirected to Entry Page

---

## 11. END-TO-END USER FLOWS

### 11.1 Guest Donation Flow (Complete)

1. **Entry:** User lands on Entry Page
2. **Decision:** User clicks "Donate as Guest"
3. **Form:** Guest Donation form loads
4. **Personal Info:** User enters name, email, phone, address
5. **Donation Details:** User selects amount, enters PAN, selects country and type
6. **Submit:** User clicks "Pay ₹[amount]"
7. **Validation:** Frontend validates all fields
8. **Payment:** User redirected to Payment Processing
9. **Processing:** Payment gateway processes transaction
10. **Success:**
    - Success screen shown
    - Receipt number generated
    - User downloads receipt PDF
    - User returns to Entry Page
11. **Follow-up:** Receipt and 80G doc emailed to user's email address

### 11.2 New User Registration & First Donation Flow

1. **Entry:** User lands on Entry Page
2. **Navigate:** User clicks "Login to Donate"
3. **Sign In:** Sign In screen loads
4. **Create Account:** User clicks "Create Account" link
5. **Registration:** Create Account form loads
6. **Fill Form:** User enters name, email, phone, password, confirms password
7. **Terms:** User checks Terms & Conditions checkbox
8. **Submit:** User clicks "Create account & continue"
9. **Validation:** Frontend validates all fields (email format, password complexity, etc.)
10. **Account Created:** Backend creates account, user auto-logged in
11. **Dashboard:** User redirected to Dashboard
12. **Donate:** User clicks "Donate Now" button
13. **Donation Form:** Donate screen loads with pre-filled name, email, phone
14. **Amount:** User selects preset or enters custom amount
15. **Details:** User enters address, PAN, selects country and donation type
16. **Submit:** User clicks "Pay ₹[amount]"
17. **Validation:** Frontend validates donation fields
18. **Payment:** Payment Processing screen shown
19. **Success:** Payment successful, receipt generated
20. **Receipt:** User downloads receipt
21. **Dashboard:** User returns to Dashboard, sees first donation in table

### 11.3 Returning Donor Flow

1. **Entry:** User lands on Entry Page
2. **Navigate:** User clicks "Login to Donate"
3. **Sign In:** User enters email and password
4. **Authenticate:** User clicks "Sign in & continue"
5. **Dashboard:** User redirected to Dashboard
6. **View History:** User sees previous donations in "My Donations" table
7. **View Stats:** User sees Total Donated, Donation Count, Last Date, 80G amount
8. **Donate Again:** User clicks "Donate Now"
9. **Quick Donation:** Donate form pre-filled with user info
10. **Select Amount:** User selects amount
11. **Enter Details:** User enters address, PAN, selects type
12. **Submit:** User clicks "Pay"
13. **Payment:** Payment processed
14. **Success:** New donation added to history
15. **View Receipt:** User navigates to Reports tab, downloads receipt
16. **80G Document:** User downloads 80G summary for tax filing

### 11.4 Receipt and Tax Document Access Flow

1. **Login:** User signs in and lands on Dashboard
2. **Navigate:** User clicks "Reports" in header
3. **Receipts Tab:** Default tab loads showing all donations
4. **Filter:** User selects financial year (e.g., FY 2024-25)
5. **Filter Type:** User filters by donation type (e.g., Education Fund)
6. **Search:** User searches for specific receipt by number
7. **Download Receipt:** User clicks Download button next to a donation
8. **Receipt PDF:** PDF downloads with donation details, donor info, receipt number
9. **80G Tab:** User switches to "80G Reports" tab
10. **View Summary:** User sees "Download 80G Summary (FY 2024-25)" button
11. **Download 80G:**User clicks button, downloads annual 80G PDF
12. **Historical Docs:** User views table of past FY 80G documents
13. **Download Past:** User downloads 80G document for FY 2023-24
14. **Tax Filing:** User uses 80G documents for income tax filing

---

## 12. VALIDATION RULES SUMMARY

### 12.1 Account Creation Validations

| Field | Validation Rules | Error Message |
|-------|-----------------|---------------|
| Name | Must not be empty | "Name is required" |
| Email | Must not be empty; must match email format | "Email is required" / "Email format is invalid" |
| Phone | Must not be empty; must be exactly 10 digits | "Phone number is required" / "Phone must be 10 digits" |
| Password | Must be ≥8 chars; must have uppercase; must have number; must have special char | Various specific messages |
| Confirm Password | Must match Password field | "Passwords do not match" |

### 12.2 Sign In Validations

| Field | Validation Rules | Error Message |
|-------|-----------------|---------------|
| Email | Must not be empty; must match email format | "Email is required" / "Invalid email format" |
| Password | Must not be empty | "Password is required" |

### 12.3 Donation Form Validations (Guest or Logged-In)

| Field | Validation Rules | Error Message |
|-------|-----------------|---------------|
| Amount | Must be ≥ ₹100; must be ≤ ₹50,000 | "Minimum donation amount is ₹100" / "Maximum donation amount is ₹50,000" |
| Address | Must not be empty | "Address is required" |
| PAN Number | Must not be empty; must match format ^[A-Z]{5}[0-9]{4}[A-Z]{1}$ | "PAN number is required" / "Invalid PAN format (e.g., AAAAA0000A)" |
| Country | Must have selection | "Country is required" |
| Donation Type | Must have selection | "Please select a donation type" |

**Guest Donation Additional Validations:**

| Field | Validation Rules | Error Message |
|-------|-----------------|---------------|
| Name | Must not be empty | "Name is required" |
| Email | Must not be empty; must match email format | "Email is required" / "Invalid email format" |
| Mobile | Must not be empty; must be exactly 10 digits | "Mobile number is required" / "Mobile must be 10 digits" |

### 12.4 Profile Update Validations

| Field |Validation Rules | Error Message |
|-------|-----------------|---------------|
| Name | Must not be empty | "Name is required" |
| Phone | Must be exactly 10 digits | "Phone must be 10 digits" |
| New Password | Same as account creation password rules | Various specific messages |
| Confirm Password | Must match New Password | "Passwords do not match" |

---

## 13. NOTIFICATION & COMMUNICATION (DONOR PERSPECTIVE)

### 13.1 Toast Notifications

**Position:** Top-right corner of screen  
**Duration:** 3-5 seconds (auto-dismiss)

**Success Toasts (Green):**
- "Account created successfully!"
- "Signed in successfully!"
- "Profile updated successfully!"
- "Password updated successfully!"
- "Payment successful!"

**Error Toasts (Red):**
- "Payment failed. Please try again."
- "Invalid credentials"
- Form validation errors (if not inline)

**Info Toasts (Blue):**
- "Downloading receipt..."
- "Logged out successfully"

### 13.2 Email Notifications (Backend-Triggered)

**Trigger Points:**
- Account created: Welcome email
- Password changed: Confirmation email
- Donation successful: Receipt email (for guest donors)
- 80G document generated: Email with PDF attachment

**Email Behavior (Donor Perspective):**
- Guest donors receive receipt via email
- Logged-in donors can access receipts in portal (also receive email)
- 80G documents emailed at end of financial year

### 13.3 Inline Validation Messages

**Display:** Below each field with error  
**Color:** Red  
**Font Size:** 12px  
**Behavior:** Appears only after user interacts with field or attempts submission

---

## 14. UI COMPONENT SPECIFICATIONS

### 14.1 Aram Components (Custom Design System)

#### AramButton
- **Variants:**
  - Primary: Orange background, white text
  - Secondary: White background, gray border
  - Danger: Red background, white text
- **Height:** 44px
- **Border Radius:** 999px (fully rounded)
- **Padding:** 0px 24px
- **Font Size:** 14px
- **Font Weight:** 600

#### AramCard
- **Background:** White (#FFFFFF)
- **Border Radius:** 24px
- **Padding:** 24px
- **Border:** 1px solid #DBDBDB
- **Shadow:** Subtle elevation
- **noPadding prop:** If set, removes default padding

#### AramInput
- **Height:** 48px
- **Border Radius:** 16px
- **Border:** 1px solid #DBDBDB
- **Padding:** 12px 16px
- **Font Size:** 16px
- **Focus State:** Orange border (#F36A4F)

#### AramTextarea
- **Border Radius:** 16px
- **Border:** 1px solid #DBDBDB
- **Padding:** 12px 16px
- **Font Size:** 16px
- **Focus State:** Orange border
- **Resize:** Vertical only

#### AramSelect
- **Height:** 48px
- **Border Radius:** 16px
- **Border:** 1px solid #DBDBDB
- **Padding:** 12px 16px
- **Font Size:** 16px
- **Caret:** Chevron down icon
- **Focus State:** Orange border

### 14.2 Portal Header Component

**Height:** 72px  
**Background:** White with bottom border  
**Position:** Sticky/fixed at top

**Navigation Items:**
- Dashboard
- Donate
- Reports
- Profile

**Active State:** Orange text and underline  
**Hover State:** Orange text

**User Section:**
- Displays user name
- Logout action

### 14.3 Typography

**Headings:**
- h1: 32px, bold
- h2: 24px, bold
- h3: 18px, semibold
- h4: 16px, semibold

**Body:**
- Regular: 16px, line-height 24px
- Small: 14px, line-height 20px
- Label: 13px, line-height 18px, medium weight
- Helper: 12px, line-height 16px

**Colors:**
- Primary Text: #0D0D0D (black)
- Secondary Text: #3D3D3D (dark gray)
- Tertiary Text: #6E6E6E (gray)

### 14.4 Color Palette

**Primary:**
- Orange: #F36A4F
- Dark Orange: #D7563D
- Light Orange: #FEF1EE, #FEF7F6
- Brown: #734F48

**Neutrals:**
- Black: #0D0D0D
- Dark Gray: #3D3D3D
- Gray: #6E6E6E
- Light Gray: #DBDBDB
- Background Gray: #F3F3F3
- White: #FFFFFF

---

## 15. CONDITIONAL BEHAVIORS & TOGGLES

### 15.1 Preset Amount Selection
- **WHEN PRESET SELECTED:** Custom amount field is cleared
- **WHEN CUSTOM AMOUNT ENTERED:** All preset selections are deselected
- **BEHAVIOR:** Only one method (preset OR custom) can be active at once

### 15.2 Password Visibility Toggle
- **WHEN EYE ICON CLICKED:** Password text becomes visible (type="text")
- **WHEN EYE-OFF ICON CLICKED:** Password text becomes masked (type="password")
- **BEHAVIOR:** Individual toggles for each password field (password, confirm password)

### 15.3 Delete Account Warning
- **WHEN DELETE ACCOUNT CLICKED:** Warning box slides in/appears
- **WHEN CANCEL CLICKED:** Warning box disappears
- **WHEN YES CLICKED:** Account deletion process initiated

### 15.4 Payment Status Display
- **INITIAL STATE:** Processing spinner and message
- **AFTER 2-3 SECONDS:**
  - If success: Success icon, message, receipt details, download option
  - If failure: Error icon, message, retry option

---

## 16. COMPLIANCE & DATA PRIVACY (UI PERSPECTIVE)

### 16.1 Data Collection Transparency

**Create Account Screen:**
- Terms & Conditions checkbox required
- Mentions "Terms of Service and Privacy Policy"

**Guest Donation:**
- Info message: "Enter accurate details for receipt and 80G document delivery"
- Transparency about data usage

### 16.2 Data Access & Portability

**Profile Screen:**
- "Download My Donation History" button
- Allows user to export their data
- Supports data portability rights

### 16.3 Account Deletion

**Profile Screen:**
- "Delete Account" option available
- Clear warning about data loss
- Confirmation required before deletion
- Supports right to be forgotten

### 16.4 Email Validation

**Purpose:**
- Ensures valid email for receipt delivery
- Required for guest donations (no account)
- Email format validation on all email fields

### 16.5 PAN Number Security

**Behavior:**
- Auto-uppercase transformation
- Format validation
- Stored securely (backend concern, but UI enforces format)

---

## 17. SCREEN NAVIGATION MAP

```
Entry Page
  ├─ Sign In
  │    ├─ Dashboard (on success)
  │    └─ Create Account
  │         └─ Dashboard (on success)
  │
  └─ Donate as Guest
       └─ Payment Processing
            ├─ Entry Page (on success or failure)
            └─ Donate as Guest (retry)

Dashboard (Logged-In)
  ├─ Header Navigation
  │    ├─ Dashboard (current)
  │    ├─ Donate → Donate (Logged-In)
  │    ├─ Reports → Reports Screen
  │    └─ Profile → Profile Screen
  │
  ├─ Donate Now Button → Donate (Logged-In)
  │
  └─ My Donations Table
       └─ Download Receipt (per row)

Donate (Logged-In)
  └─ Pay Button → Payment Processing
       ├─ Dashboard (on success)
       └─ Donate (retry on failure)

Reports Screen
  ├─ Receipts Tab
  │    └─ Download Receipt PDFs
  ├─ 80G Reports Tab
  │    ├─ Download Annual 80G Summary
  │    └─ Download Historical 80G Documents
  └─ Tax Documents Tab (empty)

Profile Screen
  ├─ Update Profile Information
  ├─ Change Password
  ├─ Choose Theme
  ├─ Download Donation History
  └─ Delete Account
```

---

## 18. APPENDIX

### 18.1 Glossary

- **80G:** Tax deduction under Section 80G of Indian Income Tax Act for donations
- **Badge:** UI component to display status (e.g., Success, Failed)
- **FY:** Financial Year (April 1 to March 31 in India)
- **Guest Donor:** User who donates without creating an account
- **PAN:** Permanent Account Number (Indian tax identifier)
- **Receipt:** Official document for donation with unique receipt number
- **Toast:** Temporary notification message

### 18.2 Donation Types

1. **Aram Sei Fund:** General foundation operations
2. **Building Fund:** Infrastructure development
3. **Education Fund:** Educational programs and scholarships
4. **General Fund:** Unrestricted use
5. **Medical Fund:** Healthcare and medical assistance
6. **Sairam SAP:** Specific program

All donation types are 80G eligible by default.

### 18.3 Technology Stack

- **Framework:** React with TypeScript
- **Routing:** React Router (SPA)
- **UI Components:** Custom Aram design system (AramButton, AramCard, AramInput, etc.)
- **Icons:** Lucide React
- **Styling:** TailwindCSS + custom styles
- **Notifications:** Sonner (toast library)

### 18.4 Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 3.0 | January 2026 | Technical Team | Comprehensive UI specification based on implementation |

---

**END OF DOCUMENT**
