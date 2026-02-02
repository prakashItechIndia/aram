/**
 * Run the single migration file (0000_single_migration.sql) against the database.
 * Loads .env from services/api and uses the same DB config as the app.
 *
 * Usage: from services/api directory:
 *   pnpm run db:migrate
 *   or: npx ts-node scripts/run-migration.ts
 */
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sql = require('mssql');

// Load .env from services/api
dotenv.config({ path: path.join(__dirname, '..', '.env') });

interface MssqlConfig {
  server: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  options?: { encrypt?: boolean; trustServerCertificate?: boolean };
}

function getConfig(): MssqlConfig {
  const host = process.env.DB_HOST;
  const database = process.env.DB_DATABASE;
  const user = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  if (host && database && user && password !== undefined && password !== '') {
    const port = parseInt(String(process.env.DB_PORT || 1433), 10) || 1433;
    const encrypt = process.env.DB_ENCRYPT === 'true' || process.env.DB_ENCRYPT === '1';
    const trustServerCertificate =
      process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false' && process.env.DB_TRUST_SERVER_CERTIFICATE !== '0';
    return {
      server: host,
      port,
      database,
      user,
      password,
      options: {
        encrypt,
        trustServerCertificate,
      },
    };
  }
  const url = process.env.DATABASE_URL;
  if (url) {
    const pairs: Record<string, string> = {};
    for (const part of url.split(';')) {
      const eq = part.indexOf('=');
      if (eq <= 0) continue;
      const key = part.slice(0, eq).trim();
      let value = part.slice(eq + 1).trim();
      if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }
      pairs[key] = value;
    }
    const serverPart = (pairs['Server'] ?? pairs['Data Source'] ?? '').trim();
    const [server, portStr] = serverPart.includes(',') ? serverPart.split(',') : [serverPart, '1433'];
    const port = parseInt(portStr, 10) || 1433;
    return {
      server: server.trim(),
      port,
      database: pairs['Database'] ?? pairs['Initial Catalog'] ?? '',
      user: pairs['User Id'] ?? pairs['User ID'] ?? pairs['UID'] ?? '',
      password: pairs['Password'] ?? pairs['PWD'] ?? '',
      options: {
        encrypt: (pairs['Encrypt'] ?? 'false').toLowerCase() === 'true',
        trustServerCertificate: (pairs['TrustServerCertificate'] ?? 'false').toLowerCase() === 'true',
      },
    };
  }
  throw new Error('Set DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD (or DATABASE_URL) in .env');
}

function splitBatches(content: string): string[] {
  return content
    .split(/\r?\nGO\r?\n/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function run(): Promise<void> {
  const config = getConfig();
  const migrationPath = path.join(__dirname, '..', 'drizzle', '0000_single_migration.sql');
  const sqlContent = fs.readFileSync(migrationPath, 'utf8');
  const batches = splitBatches(sqlContent);

  console.log(`[db:migrate] Connecting to ${config.server}:${config.port}/${config.database}...`);
  const pool = new sql.ConnectionPool(config);
  await pool.connect();
  console.log(`[db:migrate] Running ${batches.length} batch(es) from 0000_single_migration.sql`);

  let done = 0;
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    if (!batch) continue;
    try {
      await pool.request().query(batch);
      done += 1;
      if ((i + 1) % 20 === 0 || i === batches.length - 1) {
        console.log(`[db:migrate] Executed ${i + 1}/${batches.length} batch(es)`);
      }
    } catch (err) {
      console.error(`[db:migrate] Batch ${i + 1} failed:`, (err as Error).message);
      throw err;
    }
  }

  await pool.close();
  console.log(`[db:migrate] Done. ${done} batch(es) executed.`);
}

run().catch((err) => {
  console.error('[db:migrate]', err);
  process.exit(1);
});
