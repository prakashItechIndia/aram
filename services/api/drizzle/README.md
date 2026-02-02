# Migrations (Single File – Manual Run)

We use **one migration file** only. Any schema changes are appended here and run **manually** in the database (no automatic migration execution).

## Workflow

1. **Add/change tables or columns** in `src/database/models/` (Drizzle schema).
2. **Append the equivalent SQL** to `0000_single_migration.sql` below the latest block.
3. **Run the new SQL block manually** against the target database (e.g. in SSMS or Azure Data Studio).
4. Do **not** run `drizzle-kit migrate` in CI or at startup.

## Pulling existing schema

To sync local models from the existing database (read-only, no DB changes):

```bash
# From repo root
pnpm --filter @aram/api db:pull
```

Then merge the generated schema from `drizzle/` into `src/database/models/` as needed.
