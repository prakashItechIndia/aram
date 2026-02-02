# Migrations (Single File – Manual Run)

We use **one migration file** only: **`0000_single_migration.sql`**. Any schema changes are appended there and run **manually** in the database (no automatic migration execution).

## Workflow

1. **Add/change tables or columns** in `src/database/models/` (Drizzle schema).
2. **Append the equivalent SQL** to `0000_single_migration.sql` below the latest block.
3. **Run the new SQL block manually** against the target database (e.g. in Beekeeper Studio, SSMS, or Azure Data Studio).
4. Do **not** run `drizzle-kit migrate` in CI or at startup.

## Running the migration (create missing tables)

If you see **Invalid object name 'donors'** or **Invalid object name 'transactions'**, run the migration:

```bash
# From repo root
pnpm --filter @aram/api db:migrate
# Or from services/api
pnpm run db:migrate
```

This executes **`0000_single_migration.sql`** against the database (using `.env`). All blocks use `IF NOT EXISTS`, so safe to re-run. Alternatively, open the file in Beekeeper Studio / SSMS and execute it manually.

## Pulling existing schema

To sync local models from the existing database (read-only, no DB changes):

```bash
# From repo root
pnpm --filter @aram/api db:pull
```

Then merge the generated schema from `drizzle/` into `src/database/models/` as needed.
