/**
 * Run a specific migration file against the database.
 */
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
const sql = require('mssql');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

function getConfig() {
    const host = process.env.DB_HOST;
    const database = process.env.DB_DATABASE;
    const user = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
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

async function run(): Promise<void> {
    const config = getConfig();
    const migrationPath = path.join(__dirname, '..', 'drizzle', '20260204120000_add_sender_id_to_admin_notifications', 'migration.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    console.log(`[manual-migrate] Connecting to ${config.server}:${config.port}/${config.database}...`);
    const pool = new sql.ConnectionPool(config);
    await pool.connect();

    console.log(`[manual-migrate] Running migration: 20260204120000_add_sender_id_to_admin_notifications`);

    const batches = sqlContent.split(';').map(b => b.trim()).filter(b => b.length > 0);

    for (const batch of batches) {
        console.log(`Executing: ${batch}`);
        await pool.request().query(batch);
    }

    await pool.close();
    console.log(`[manual-migrate] Done.`);
}

run().catch((err) => {
    console.error('[manual-migrate]', err);
    process.exit(1);
});
