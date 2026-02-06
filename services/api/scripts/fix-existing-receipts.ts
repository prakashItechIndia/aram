
import * as sql from 'mssql';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function run() {
    const config = {
        server: process.env.DB_HOST || '',
        database: process.env.DB_DATABASE || '',
        user: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
        },
    };

    const prefix = 'ARAM/2025-26/';

    try {
        const pool = await sql.connect(config);
        console.log('Connected to DB');

        // 1. Find receipts that don't have the prefix (just numeric)
        const result = await pool.request().query("SELECT id, challan_number FROM e_challans WHERE challan_number NOT LIKE 'ARAM%'");
        const records = result.recordset;

        console.log(`Found ${records.length} records to fix`);

        for (const record of records) {
            if (/^\d+$/.test(record.challan_number)) {
                const newNumber = `${prefix}${record.challan_number}`;
                console.log(`Updating ID ${record.id}: ${record.challan_number} -> ${newNumber}`);
                await pool.request()
                    .input('id', sql.Int, record.id)
                    .input('newNumber', sql.NVarChar, newNumber)
                    .query('UPDATE e_challans SET challan_number = @newNumber WHERE id = @id');
            }
        }

        console.log('Fix complete');
        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
