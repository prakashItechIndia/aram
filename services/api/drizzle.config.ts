import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit config for SQL Server (MSSQL).
 * Schema is pulled from the existing database via: pnpm db:pull
 * Migrations: We maintain a single migration file; run manually in the database.
 * Uses server/port/user/password/database so options.trustServerCertificate is applied (required for self-signed certs).
 */
const hasDbEnv =
  process.env.DB_HOST &&
  process.env.DB_DATABASE &&
  process.env.DB_USERNAME &&
  process.env.DB_PASSWORD;

export default defineConfig({
  dialect: 'mssql',
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dbCredentials: hasDbEnv
    ? {
        server: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT) || 1433,
        database: process.env.DB_DATABASE!,
        user: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      }
    : {
        url: process.env.DATABASE_URL!,
      },
});
