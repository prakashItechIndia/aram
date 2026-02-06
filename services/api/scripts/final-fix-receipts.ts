
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

        // 1. Update Receipt Settings config_json
        const settingsResult = await pool.request().query('SELECT id, config_json FROM receipt_settings');
        const settings = settingsResult.recordset[0];

        if (settings) {
            let configJson = {};
            try {
                configJson = settings.config_json ? JSON.parse(settings.config_json) : {};
            } catch (e) { }

            configJson['receiptPrefix'] = prefix;
            const updatedConfig = JSON.stringify(configJson);

            console.log(`Updating settings ID ${settings.id} config_json to: ${updatedConfig}`);
            await pool.request()
                .input('id', sql.Int, settings.id)
                .input('configJson', sql.NVarChar, updatedConfig)
                .query('UPDATE receipt_settings SET config_json = @configJson WHERE id = @id');
        }

        // 2. Fix ANY receipts in e_challans that are just numeric
        const result = await pool.request().query("SELECT id, challan_number FROM e_challans WHERE challan_number NOT LIKE 'ARAM%'");
        const records = result.recordset;

        console.log(`Found ${records.length} records in e_challans to fix`);

        for (const record of records) {
            // Check if it's just numeric (allowing for some padding mismatch if any)
            if (/^\d+$/.test(record.challan_number)) {
                const newNumber = `${prefix}${record.challan_number}`;
                console.log(`Updating e_challans ID ${record.id}: ${record.challan_number} -> ${newNumber}`);
                await pool.request()
                    .input('id', sql.Int, record.id)
                    .input('newNumber', sql.NVarChar, newNumber)
                    .query('UPDATE e_challans SET challan_number = @newNumber WHERE id = @id');
            }
        }

        console.log('Final fix complete');
        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
