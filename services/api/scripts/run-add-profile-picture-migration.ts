/**
 * Migration to add Profile_Picture column to T_USER table
 * Usage: npx ts-node scripts/run-add-profile-picture-migration.ts
 */
import * as path from 'path';
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

    console.log(`[migration] Connecting to ${config.server}:${config.port}/${config.database}...`);
    const pool = new sql.ConnectionPool(config);
    await pool.connect();

    try {
        console.log(`[migration] Checking if Profile_Picture column exists in T_USER...`);
        const checkResult = await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('T_USER') AND name = 'Profile_Picture'
      )
      BEGIN
        ALTER TABLE T_USER ADD Profile_Picture NVARCHAR(500) NULL;
        SELECT 'Column added' as Status;
      END
      ELSE
      BEGIN
        SELECT 'Column already exists' as Status;
      END
    `);

        console.log(`[migration] Result:`, checkResult.recordset[0].Status);
    } catch (err) {
        console.error(`[migration] Failed to add column:`, (err as Error).message);
        throw err;
    }

    await pool.close();
    console.log(`[migration] Done.`);
}

run().catch((err) => {
    console.error('[migration] Error:', err);
    process.exit(1);
});
