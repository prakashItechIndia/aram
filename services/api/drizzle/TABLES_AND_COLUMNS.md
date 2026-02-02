# ARAM Application – Tables and Columns Reference

Derived from: ARAM admin.md, ARAM donor.md, Aram Foundation Site Revamp BRD 3.docx, Aram_Foundation_Admin_Portal_Specification (Detailed) 1.docx.

---

## 1. users (Admin portal authentication)

| Column        | Type         | Notes                          |
|---------------|--------------|--------------------------------|
| id            | INT PK IDENTITY |                               |
| email         | NVARCHAR(255) UNIQUE NOT NULL |     |
| password      | NVARCHAR(255) NOT NULL | (hashed)           |
| name          | NVARCHAR(255) NULL |                    |
| role_id       | INT NULL FK → user_roles |     |
| created_at    | DATETIME2(3) DEFAULT GETDATE() |  |
| updated_at    | DATETIME2(3) NULL |               |

---

## 2. user_roles (RBAC)

| Column     | Type           | Notes        |
|------------|----------------|-------------|
| id         | INT PK IDENTITY |             |
| name       | NVARCHAR(64) NOT NULL UNIQUE | super_admin, admin, finance_manager, etc. |
| description| NVARCHAR(255) NULL |          |

---

## 3. donors (Donor profiles – admin + donor portal)

| Column             | Type           | Notes |
|--------------------|----------------|-------|
| id                 | INT PK IDENTITY |      |
| name               | NVARCHAR(255) NOT NULL | |
| email              | NVARCHAR(255) NOT NULL | |
| mobile             | NVARCHAR(20) NULL |    |
| pan                | NVARCHAR(10) NULL | AAAAA0000A |
| address            | NVARCHAR(MAX) NULL |   |
| country            | NVARCHAR(128) NULL DEFAULT 'India' | |
| state              | NVARCHAR(128) NULL |   |
| pincode            | NVARCHAR(20) NULL |   |
| status             | NVARCHAR(32) NULL | active, lapsed, blocked |
| tags               | NVARCHAR(MAX) NULL | JSON array e.g. ["VIP","80G"] |
| first_donation_at  | DATETIME2(3) NULL |  |
| last_donation_at   | DATETIME2(3) NULL |  |
| total_donated      | DECIMAL(18,2) DEFAULT 0 | |
| donation_count     | INT DEFAULT 0 |     |
| is_guest           | BIT DEFAULT 0 | no portal account |
| password_hash     | NVARCHAR(255) NULL | for donor portal login |
| created_at         | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at         | DATETIME2(3) NULL | |

---

## 4. donation_categories (Master data)

| Column             | Type           | Notes |
|--------------------|----------------|-------|
| id                 | INT PK IDENTITY |      |
| category_code      | NVARCHAR(32) NOT NULL UNIQUE | EDU001, HEALTH001 |
| display_name       | NVARCHAR(128) NOT NULL |     |
| public_visibility  | BIT DEFAULT 1 |       |
| sort_order         | INT DEFAULT 0 |       |
| is_80g_eligible    | BIT DEFAULT 1 |       |
| suggested_amounts  | NVARCHAR(MAX) NULL | JSON [500,1000,2500] |
| is_deleted         | BIT DEFAULT 0 | soft delete |
| created_at         | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at         | DATETIME2(3) NULL | |

---

## 5. campaigns (Phase 2 – Campaign management)

| Column                  | Type           | Notes |
|-------------------------|----------------|-------|
| id                      | INT PK IDENTITY |      |
| name                    | NVARCHAR(128) NOT NULL | internal |
| public_title            | NVARCHAR(255) NULL | shown on donation page |
| campaign_code           | NVARCHAR(32) NOT NULL UNIQUE | |
| donation_category_id   | INT NULL FK → donation_categories | |
| campaign_type          | NVARCHAR(32) NULL | time_bound, recurring_annual, emergency, evergreen |
| target_amount          | DECIMAL(18,2) NULL |      |
| current_amount        | DECIMAL(18,2) DEFAULT 0 |      |
| donor_count_target    | INT NULL |        |
| show_progress_on_public | BIT DEFAULT 1 |   |
| is_active              | BIT DEFAULT 1 |  |
| created_at             | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at             | DATETIME2(3) NULL | |

---

## 6. transactions (Payments / donations)

| Column                | Type           | Notes |
|-----------------------|----------------|-------|
| id                    | INT PK IDENTITY |      |
| payment_id            | NVARCHAR(128) NULL | gateway payment ID |
| order_id              | NVARCHAR(128) NULL | gateway order ID |
| donor_id               | INT NOT NULL FK → donors | |
| amount                | DECIMAL(18,2) NOT NULL |   |
| gateway_fee           | DECIMAL(18,2) DEFAULT 0 | |
| net_amount            | DECIMAL(18,2) NULL | amount - gateway_fee |
| currency              | NVARCHAR(3) DEFAULT 'INR' | |
| status                | NVARCHAR(32) NOT NULL | created, processing, success, failed, refunded, disputed |
| payment_method        | NVARCHAR(32) NULL | card, upi, netbanking, wallet, cash, cheque, dd, bank_transfer |
| donation_category_id  | INT NULL FK → donation_categories | |
| campaign_id           | INT NULL FK → campaigns | |
| receipt_id            | INT NULL FK → receipts | |
| gateway_provider      | NVARCHAR(32) NULL | razorpay, paytm, payu |
| gateway_response      | NVARCHAR(MAX) NULL | JSON |
| is_recurring          | BIT DEFAULT 0 |   |
| is_offline            | BIT DEFAULT 0 | e-challan |
| created_at            | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at            | DATETIME2(3) NULL | |

---

## 7. receipts (Unified receipt engine)

| Column         | Type           | Notes |
|----------------|----------------|-------|
| id             | INT PK IDENTITY |      |
| receipt_number | NVARCHAR(64) NOT NULL UNIQUE | ARAM/2025-26/XXXXX |
| transaction_id | INT NULL FK → transactions | |
| donor_id       | INT NOT NULL FK → donors | |
| amount         | DECIMAL(18,2) NOT NULL |   |
| category_id    | INT NULL FK → donation_categories | |
| receipt_type   | NVARCHAR(32) NOT NULL | online, e_challan_cash, e_challan_cheque, e_challan_dd, e_challan_bank_transfer |
| financial_year | NVARCHAR(16) NULL | 2025-26 |
| pdf_path       | NVARCHAR(512) NULL | storage path/URL |
| is_80g         | BIT DEFAULT 1 |     |
| generated_at   | DATETIME2(3) DEFAULT GETDATE() | |
| created_at     | DATETIME2(3) DEFAULT GETDATE() | |

---

## 8. donation_form_settings (Versioned form config)

| Column      | Type           | Notes |
|-------------|----------------|-------|
| id          | INT PK IDENTITY |      |
| version     | NVARCHAR(32) NOT NULL | v1.5 |
| config_json | NVARCHAR(MAX) NOT NULL | full form config JSON |
| is_active   | BIT DEFAULT 0 | only one active version |
| created_at  | DATETIME2(3) DEFAULT GETDATE() | |
| created_by  | NVARCHAR(128) NULL |       |

---

## 9. feature_config (Feature flags / key-value)

| Column     | Type           | Notes |
|------------|----------------|-------|
| id         | INT PK IDENTITY |      |
| key        | NVARCHAR(128) NOT NULL UNIQUE | |
| value      | NVARCHAR(MAX) NULL | JSON or scalar |
| is_enabled | BIT DEFAULT 1 |       |
| updated_at | DATETIME2(3) DEFAULT GETDATE() | |
| updated_by | NVARCHAR(128) NULL |       |

---

## 10. payment_gateway_settings (Gateway config)

| Column               | Type           | Notes |
|----------------------|----------------|-------|
| id                   | INT PK IDENTITY |      |
| provider             | NVARCHAR(32) NOT NULL | razorpay, paytm, payu |
| environment          | NVARCHAR(16) NOT NULL | test, live |
| api_key_encrypted    | NVARCHAR(MAX) NULL |  |
| api_secret_encrypted | NVARCHAR(MAX) NULL |  |
| webhook_secret       | NVARCHAR(255) NULL |  |
| merchant_id          | NVARCHAR(128) NULL |  |
| gateway_fee_config   | NVARCHAR(MAX) NULL | JSON |
| retry_policy         | NVARCHAR(MAX) NULL | JSON |
| is_active            | BIT DEFAULT 1 |  |
| created_at           | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at           | DATETIME2(3) NULL | |

---

## 11. refund_requests (Refunds + approval for >10k)

| Column                | Type           | Notes |
|-----------------------|----------------|-------|
| id                    | INT PK IDENTITY |      |
| transaction_id        | INT NOT NULL FK → transactions | |
| amount                | DECIMAL(18,2) NOT NULL |   |
| reason                | NVARCHAR(MAX) NOT NULL |  |
| status                | NVARCHAR(32) NOT NULL | pending, approved, rejected |
| requested_by_user_id  | INT NULL FK → users |   |
| approved_by_user_id   | INT NULL FK → users |   |
| created_at            | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at            | DATETIME2(3) NULL | |

---

## 12. enquiries (Contact form / Communications inbox)

| Column               | Type           | Notes |
|----------------------|----------------|-------|
| id                   | INT PK IDENTITY |      |
| name                 | NVARCHAR(255) NOT NULL | |
| email                | NVARCHAR(255) NOT NULL | |
| organization         | NVARCHAR(255) NULL |   |
| subject              | NVARCHAR(255) NULL |   |
| message              | NVARCHAR(MAX) NULL |   |
| status               | NVARCHAR(32) NOT NULL | new, open, in_progress, waiting, resolved, spam |
| assigned_to_user_id   | INT NULL FK → users |  |
| created_at           | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at           | DATETIME2(3) NULL | |

---

## 13. communication_templates (Email / SMS templates)

| Column          | Type           | Notes |
|-----------------|----------------|-------|
| id              | INT PK IDENTITY |      |
| name            | NVARCHAR(128) NOT NULL | |
| category        | NVARCHAR(32) NULL | transactional, marketing, operational |
| type            | NVARCHAR(16) NOT NULL | email, sms |
| subject         | NVARCHAR(255) NULL | email only |
| body_content    | NVARCHAR(MAX) NULL | |
| variables_json  | NVARCHAR(MAX) NULL | merge tags |
| dlt_template_id | NVARCHAR(64) NULL | SMS DLT (India) |
| is_active       | BIT DEFAULT 1 |  |
| created_at      | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at      | DATETIME2(3) NULL | |

---

## 14. e_challans (Offline donations – E-Challan entry)

| Column               | Type           | Notes |
|----------------------|----------------|-------|
| id                   | INT PK IDENTITY |      |
| challan_number       | NVARCHAR(64) NOT NULL |   |
| donor_id             | INT NOT NULL FK → donors | |
| amount               | DECIMAL(18,2) NOT NULL |   |
| category_id          | INT NULL FK → donation_categories | |
| cheque_number        | NVARCHAR(64) NULL | if payment_mode = cheque |
| payment_mode         | NVARCHAR(32) NOT NULL | cash, cheque, dd, bank_transfer |
| donation_date        | DATE NOT NULL |       |
| receipt_id           | INT NULL FK → receipts | |
| created_at           | DATETIME2(3) DEFAULT GETDATE() | |
| created_by_user_id   | INT NULL FK → users |   |

---

## 15. audit_log (User activity – Super Admin)

| Column      | Type           | Notes |
|-------------|----------------|-------|
| id          | INT PK IDENTITY |      |
| user_id     | INT NULL FK → users |   |
| action      | NVARCHAR(64) NOT NULL |     |
| entity_type | NVARCHAR(64) NULL |   |
| entity_id   | NVARCHAR(64) NULL |   |
| details_json| NVARCHAR(MAX) NULL |  |
| ip_address  | NVARCHAR(45) NULL |   |
| created_at  | DATETIME2(3) DEFAULT GETDATE() | |

---

## 16. admin_notifications (Dashboard alerts)

| Column    | Type           | Notes |
|-----------|----------------|-------|
| id        | INT PK IDENTITY |      |
| type      | NVARCHAR(32) NOT NULL | error, warning, info |
| title     | NVARCHAR(255) NOT NULL | |
| message   | NVARCHAR(MAX) NULL |   |
| read_at   | DATETIME2(3) NULL |   |
| created_at| DATETIME2(3) DEFAULT GETDATE() | |

---

## 17. user_otp (2FA / OTP verification)

| Column    | Type           | Notes |
|-----------|----------------|-------|
| id        | INT PK IDENTITY |      |
| user_id   | INT NULL FK → users |   |
| email     | NVARCHAR(255) NULL |   |
| phone     | NVARCHAR(20) NULL |   |
| otp_code  | NVARCHAR(10) NOT NULL |   |
| expires_at| DATETIME2(3) NOT NULL | |
| created_at| DATETIME2(3) DEFAULT GETDATE() | |

---

## 18. reconciliation_batches (Payments reconciliation)

| Column          | Type           | Notes |
|-----------------|----------------|-------|
| id              | INT PK IDENTITY |      |
| gateway_provider| NVARCHAR(32) NOT NULL | |
| period_start    | DATETIME2(3) NOT NULL | |
| period_end      | DATETIME2(3) NOT NULL | |
| status          | NVARCHAR(32) NOT NULL | pending, matched, mismatch |
| matched_count   | INT DEFAULT 0 |     |
| mismatch_count  | INT DEFAULT 0 |     |
| created_at      | DATETIME2(3) DEFAULT GETDATE() | |

---

## 19. website_content (CMS – Phase 2)

| Column       | Type           | Notes |
|--------------|----------------|-------|
| id           | INT PK IDENTITY |      |
| section_key  | NVARCHAR(64) NOT NULL | hero, mission_vision, etc. |
| content_json | NVARCHAR(MAX) NOT NULL |   |
| version      | INT DEFAULT 1 |       |
| published_at | DATETIME2(3) NULL |   |
| created_at   | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at   | DATETIME2(3) NULL | |

---

## 20. sponsors (Website – Phase 3)

| Column           | Type           | Notes |
|------------------|----------------|-------|
| id               | INT PK IDENTITY |      |
| name             | NVARCHAR(255) NOT NULL | |
| logo_url         | NVARCHAR(512) NULL |   |
| website_url      | NVARCHAR(512) NULL |   |
| contribution_type| NVARCHAR(32) NULL | financial, in_kind, service, strategic |
| tier             | NVARCHAR(32) NULL | platinum, gold, silver, bronze, associate |
| display_order    | INT DEFAULT 0 |     |
| is_active        | BIT DEFAULT 1 |  |
| show_on_homepage | BIT DEFAULT 0 |  |
| created_at       | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at       | DATETIME2(3) NULL | |

---

## 21. gallery (Website – Phase 3)

| Column      | Type           | Notes |
|-------------|----------------|-------|
| id          | INT PK IDENTITY |      |
| title       | NVARCHAR(255) NOT NULL | |
| description | NVARCHAR(MAX) NULL |   |
| alt_text    | NVARCHAR(255) NULL |   |
| image_path  | NVARCHAR(512) NOT NULL | |
| album_id    | INT NULL | self or separate albums table |
| tags_json   | NVARCHAR(MAX) NULL |   |
| sort_order  | INT DEFAULT 0 |     |
| created_at  | DATETIME2(3) DEFAULT GETDATE() | |
| updated_at  | DATETIME2(3) NULL | |

---

## 22. export_log (Report export audit)

| Column     | Type           | Notes |
|------------|----------------|-------|
| id         | INT PK IDENTITY |      |
| user_id    | INT NULL FK → users |   |
| report_type| NVARCHAR(64) NULL |   |
| format     | NVARCHAR(16) NULL | xlsx, csv, pdf |
| ip_address | NVARCHAR(45) NULL |   |
| created_at | DATETIME2(3) DEFAULT GETDATE() | |

---

## BRD-derived additions (ARAM admin.md, ARAM donor.md)

- **donor_notes:** donor_id FK → donors, created_by_user_id FK → users, note_text (Admin Donor drawer Notes tab).
- **donors.theme_preference:** NVARCHAR(16) NULL (Donor Profile Appearance: light | dark).
- **donation_form_settings.changes_description:** NVARCHAR(500) NULL (Version History drawer).
- **campaigns.start_date, end_date, event_description:** DATE/NVARCHAR(MAX) (Donor Dashboard Upcoming Special Events).

See **BRD_TO_DB_CHECKLIST.md** for full screen-by-screen, tab-by-tab, modal-by-modal mapping.
