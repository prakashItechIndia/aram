/**
 * Run the add_user_id_to_admin_notifications migration
 * Usage: npx ts-node scripts/run-add-user-id-migration.ts
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
  throw new Error('Set DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env');
}

async function run(): Promise<void> {
  const config = getConfig();
  const migrationPath = path.join(
    __dirname,
    '..',
    'drizzle',
    '20260202172018_add_user_id_to_admin_notifications',
    'migration.sql'
  );
  
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found: ${migrationPath}`);
  }
  
  const sqlContent = fs.readFileSync(migrationPath, 'utf8');
  
  // Split by statement-breakpoint
  const statements = sqlContent
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  console.log(`[migration] Connecting to ${config.server}:${config.port}/${config.database}...`);
  const pool = new sql.ConnectionPool(config);
  await pool.connect();
  console.log(`[migration] Running ${statements.length} statement(s) from add_user_id_to_admin_notifications`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;
    try {
      console.log(`[migration] Executing statement ${i + 1}/${statements.length}...`);
      await pool.request().query(statement);
    } catch (err) {
      console.error(`[migration] Statement ${i + 1} failed:`, (err as Error).message);
      console.error('Statement:', statement);
      throw err;
    }
  }

  await pool.close();
  console.log(`[migration] Done. Successfully added user_id column to admin_notifications table.`);
}

run().catch((err) => {
  console.error('[migration] Error:', err);
  process.exit(1);
});
