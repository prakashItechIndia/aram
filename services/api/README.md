# ARAM Backend API

NestJS API with **Drizzle ORM** and **SQL Server (MSSQL)**.

## Setup

1. **Install dependencies** (from repo root):
   ```bash
   pnpm install
   # If lockfile is out of sync: pnpm install --no-frozen-lockfile
   ```

2. **Database (SQL Server)**  
   Copy `.env.example` to `.env` and set either:
   - **Option A:** `DATABASE_URL` – full connection string (quote the value if the password contains `#` or `(`).
   - **Option B:** `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.  
     If the password contains `#` or `(`, quote it: `DB_PASSWORD="D3v#AraMM38e(haIN"`.  
   For self-signed certs, the config uses `TrustServerCertificate=true` when using `DB_*` vars.

3. **Pull existing schema (read-only, no DB changes)**:
   ```bash
   pnpm db:pull
   ```
   This introspects the database and writes schema under `drizzle/`. Merge any new tables/columns into `src/database/models/` as needed.  
   If you see **"Login failed for user"**, check credentials and that the SQL Server allows connections from your IP (firewall/VPN).


4. **Migrations**  
   We use a **single migration file** (`drizzle/0000_single_migration.sql`). All changes are appended there and run **manually** in the database (no automatic migration execution).

## Run

- **Development:** `pnpm start:dev` (or from root: `pnpm dev:api` / `pnpm dev:backend`)
- **Build:** `pnpm build`
- **Production:** `pnpm start:prod`

## Feature configuration

Admin-controlled feature flags and donation form settings are stored in `feature_config` (and optionally `donation_form_settings`). They drive:

- **Logic** – validation, PAN rules, amount limits
- **Inputs** – required/optional fields
- **UI visibility** – hide/show fields and sections
- **SMS / Email** – whether to send receipts, 80G, etc.

- **Public config (donation form):** `GET /config/donation-form` and `GET /config/donation-form/flat`
- Use `FeatureConfigService` in other modules for server-side checks (e.g. before sending SMS/email).

## Project structure

- `src/database/models/` – Drizzle schema (one file per table/domain)
- `src/database/schema/index.ts` – re-exports all models
- `src/modules/` – feature modules (see below)
- `drizzle/` – single migration file (`0000_single_migration.sql`) and pull output

## Modules (BRD-based)

| Module | Path | Purpose |
|--------|------|---------|
| auth | `/auth` | Admin login, JWT, 2FA |
| config (FeatureConfig) | `/config` | Donation form & feature flags |
| donors | `/donors` | Donor profiles (admin + donor portal) |
| donation-categories | `/donation-categories` | Master categories |
| transactions | `/transactions` | Payments / donations |
| receipts | `/receipts` | Unified receipt engine |
| refunds | `/refunds` | Refund requests & approval |
| enquiries | `/enquiries` | Contact form inbox |
| communication-templates | `/communication-templates` | Email/SMS templates |
| e-challans | `/e-challans` | Offline donations |
| payment-gateway | `/payment-gateway` | Gateway settings |
| reconciliation | `/reconciliation` | Settlement batches |
| campaigns | `/campaigns` | Campaigns (Phase 2) |
| audit | `/audit` | User activity log |
| notifications | `/notifications` | Dashboard alerts |
| website | `/website/content`, `/website/sponsors`, `/website/gallery` | CMS, sponsors, gallery |
| export-log | `/export-log` | Report export audit |

APIs and integrations can be added per module; then each page/section can be handled without missing anything.
