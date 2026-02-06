
import * as sql from 'mssql';
import { ConfigService } from '@nestjs/config';
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

    try {
        const pool = await sql.connect(config);
        console.log('Connected to DB');

        const result = await pool.request().query('SELECT TOP 10 * FROM e_challans ORDER BY id DESC');
        console.log('Latest 10 donations:');
        console.table(result.recordset.map(r => ({
            id: r.id,
            challan_number: r.challan_number,
            amount: r.amount,
            donation_date: r.donation_date
        })));

        const settings = await pool.request().query('SELECT * FROM receipt_settings');
        console.log('Receipt Settings:');
        console.table(settings.recordset.map(s => ({
            id: s.id,
            config_json: s.config_json,
            padding_length: s.padding_length
        })));

        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
