# Aram Foundation Donor Portal - User Guide

## Portal Overview
A comprehensive donor portal for Aram Foundation with dual entry paths: Login to Donate and Guest Donate.

## Design System

### Typography
- **Font Family**: Barlow (imported from Google Fonts)
- **Base Size**: 16px / 24px line-height
- **H1**: 28px / 36px, weight 700, #0D0D0D
- **H2**: 22px / 30px, weight 700, #0D0D0D
- **H3**: 18px / 26px, weight 600, #0D0D0D
- **Body**: 16px / 24px, weight 400, #3D3D3D
- **Label**: 13px / 18px, weight 500, #6E6E6E
- **Table/Input**: 14px / 20px, weight 400, #3D3D3D

### Colors
**Primary:**
- Primary: #F36A4F
- Primary Hover: #D7563D
- Primary Lighter: #FF8870
- Primary 50: #F9B5A7
- Primary 25: #FCD9D3
- Primary 10: #FEF1EE
- Primary 5: #FEF7F6

**Neutral:**
- 100: #0D0D0D (headings)
- 80: #3D3D3D (default text)
- 60: #6E6E6E (labels)
- 40: #9E9E9E
- 20: #CFCFCF
- 15: #DBDBDB (borders)
- 10: #E7E7E7
- 5: #F3F3F3 (subtle bg)
- 0: #FFFFFF (canvas)

**Secondary:**
- Secondary: #734F48
- 80: #8F726D
- 60: #AB9591
- 40: #C7B9B6
- 20: #E3DCDA
- 10: #F1EEED
- 5: #F8F6F6

### Layout
- **Desktop Frame**: 1440 × 900
- **Page Padding**: 24px
- **Card Radius**: 16px
- **Button Radius**: 999px (pill)
- **Input Height**: 44px
- **Border**: 1px #DBDBDB
- **Spacing Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48

## Screens (9 Total)

### 1. Entry Page
- **Path**: Landing page
- **Purpose**: Choose between Login to Donate or Guest Donate
- **Features**:
  - Centered card (520px width)
  - Two primary CTAs
  - Info text about 80G documents

### 2. Create Account
- **Path**: From Entry → Login to Donate
- **Fields**:
  - Name (required)
  - Email ID (required, validated)
  - Phone Number (required, 10 digits)
  - Password (required, min 8 chars, uppercase, number, special char)
  - Confirm Password (required, must match)
  - Terms checkbox (optional)
- **Validation**: Real-time form validation
- **States**: Default, error, success

### 3. Sign In
- **Path**: From Create Account or Entry
- **Fields**:
  - Email or Phone (required)
  - Password (required)
- **Features**:
  - Forgot password link
  - Create account link
  - Loading state

### 4. Dashboard (Logged-in)
- **Components**:
  - Welcome hero with Donate Now CTA
  - 4 summary cards:
    - Total Donated
    - Donations Count
    - Last Donation Date
    - 80G Eligible (FY)
  - My Donations table with download receipts
  - Upcoming events section
  - Impact/Funds utilization section
- **Empty States**: No donations, No events

### 5. Donate Now (Logged-in)
- **Pre-filled**: Name, Email, Phone (read-only)
- **Fields**:
  - Amount (presets: ₹500, ₹1000, ₹2500, ₹5000 + custom)
  - Address (textarea, required)
  - PAN Number (format: AAAAA0000A, required)
  - Donation Type (dropdown, 6 options, required)
  - Country (dropdown, required)
- **Validation**:
  - Min amount: ₹100
  - Max amount: ₹50,000
  - PAN format check
- **Actions**: Pay, Reset

### 6. Donate Without Signup (Guest)
- **All Fields Required**:
  - Name
  - Email ID
  - Mobile Number (10 digits)
  - Address
  - Amount (same presets)
  - PAN Number
  - Donation Type
  - Country
- **Helper**: "Enter accurate details for receipt and 80G document delivery"

### 7. Payment Processing States (3 states)
- **Processing**: Spinner + "Redirecting to payment gateway..."
- **Success**: 
  - Success icon
  - Display amount, type, receipt number
  - Actions: Download Receipt, Go to Dashboard
- **Failed**:
  - Error icon
  - Error message
  - Actions: Try Again, Contact Support

### 8. Reports
- **Tabs**: Receipts, 80G Reports, Tax Documents
- **Receipts Tab**:
  - Filters: Search receipt number, FY dropdown, Donation type
  - Table: Date, Receipt No, Type, Amount, 80G Yes/No, Download PDF
  - Pagination
- **80G Reports Tab**:
  - Download 80G Summary (FY) button
  - Table of generated annual documents
  - Note about document generation
- **Tax Documents Tab**: Empty state

### 9. Profile
- **Sections**:
  - Profile Information:
    - Avatar upload
    - Name (editable)
    - Email (read-only)
    - Phone (editable, verification note)
  - Change Password:
    - Current, New, Confirm passwords
  - Appearance:
    - Light/Dark theme toggle with preview tiles
  - Privacy & Data:
    - Download donation history
    - Delete account (with warning modal)

## Portal Header (Logged-in Pages)
- **Height**: 72px
- **Logo**: Gradient circle with "A"
- **Navigation**: Dashboard, Donate, Reports, Profile
- **Search**: Global search bar (420px width)
- **Icons**: Notifications (with badge), Profile menu
- **Profile Menu**: Profile, My Reports, Settings, Logout

## Donation Types (Dropdown Options)
1. Aram Sei Fund
2. Building Fund
3. Education Fund
4. General Fund
5. Medical Fund
6. Sairam SAP

## Key Features
- ✅ Dual entry paths (Login vs Guest)
- ✅ Complete form validation
- ✅ Amount presets with custom input
- ✅ PAN number validation
- ✅ Donation tracking and receipts
- ✅ 80G document management
- ✅ Profile management
- ✅ Theme switcher
- ✅ Responsive design (desktop-first 1440px)
- ✅ Toast notifications
- ✅ Empty states
- ✅ Loading states
- ✅ Error handling

## Component Structure
```
/src/app/
  ├── App.tsx (Main router)
  └── components/
      ├── aram/
      │   ├── AramButton.tsx
      │   ├── AramCard.tsx
      │   ├── AramInput.tsx
      │   ├── AramTextarea.tsx
      │   ├── AramSelect.tsx
      │   └── PortalHeader.tsx
      └── screens/
          ├── EntryPage.tsx
          ├── CreateAccount.tsx
          ├── SignIn.tsx
          ├── Dashboard.tsx
          ├── DonateLoggedIn.tsx
          ├── DonateGuest.tsx
          ├── PaymentProcessing.tsx
          ├── Reports.tsx
          └── Profile.tsx
```

## Mock Data
- Sample donations with receipts
- Sample upcoming events
- Sample 80G documents
- Impact statistics

## User Flow Examples

### Flow 1: Guest Donation
Entry → Donate without Signup → Fill Form → Payment Processing → Success/Failed

### Flow 2: Login & Donate
Entry → Sign In → Dashboard → Donate Now → Fill Form → Payment Processing → Success → Dashboard

### Flow 3: New User Registration
Entry → Login to Donate → Create Account → Dashboard → Donate Now

## Notes
- All screens follow exact design system specifications
- Pixel-perfect spacing and sizing
- Custom Barlow font implementation
- Color tokens from CSS variables
- Toast notifications for user feedback
- Mock data for demonstration purposes
- Payment simulation (90% success rate for demo)
