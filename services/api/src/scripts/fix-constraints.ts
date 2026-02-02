import { drizzle } from 'drizzle-orm/node-mssql';
import * as mssql from 'mssql';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = await mssql.connect(connectionString);
  
  const sqlCommands = [
    // 1. e_challans
    "ALTER TABLE [e_challans] DROP CONSTRAINT IF EXISTS [FK_e_challans_created_by];",
    "ALTER TABLE [e_challans] ADD CONSTRAINT [FK_e_challans_created_by] FOREIGN KEY ([created_by_user_id]) REFERENCES [T_USER]([Id]);",
    
    // 2. audit_log
    "ALTER TABLE [audit_log] DROP CONSTRAINT IF EXISTS [FK_audit_log_user];",
    "ALTER TABLE [audit_log] ADD CONSTRAINT [FK_audit_log_user] FOREIGN KEY ([user_id]) REFERENCES [T_USER]([Id]);",
    
    // 3. donor_notes
    "ALTER TABLE [donor_notes] DROP CONSTRAINT IF EXISTS [FK_donor_notes_user];",
    "ALTER TABLE [donor_notes] ADD CONSTRAINT [FK_donor_notes_user] FOREIGN KEY ([created_by_user_id]) REFERENCES [T_USER]([Id]);",
    
    // 4. enquiries
    "ALTER TABLE [enquiries] DROP CONSTRAINT IF EXISTS [FK_enquiries_assigned_to];",
    "ALTER TABLE [enquiries] ADD CONSTRAINT [FK_enquiries_assigned_to] FOREIGN KEY ([assigned_to_user_id]) REFERENCES [T_USER]([Id]);",
    
    // 5. enquiry_replies
    "ALTER TABLE [enquiry_replies] DROP CONSTRAINT IF EXISTS [FK_enquiry_replies_user];",
    "ALTER TABLE [enquiry_replies] ADD CONSTRAINT [FK_enquiry_replies_user] FOREIGN KEY ([from_user_id]) REFERENCES [T_USER]([Id]);",
    
    // 6. export_log
    "ALTER TABLE [export_log] DROP CONSTRAINT IF EXISTS [FK_export_log_user];",
    "ALTER TABLE [export_log] ADD CONSTRAINT [FK_export_log_user] FOREIGN KEY ([user_id]) REFERENCES [T_USER]([Id]);",
    
    // 7. refund_requests
    "ALTER TABLE [refund_requests] DROP CONSTRAINT IF EXISTS [FK_refund_requests_approved_by];",
    "ALTER TABLE [refund_requests] ADD CONSTRAINT [FK_refund_requests_approved_by] FOREIGN KEY ([approved_by_user_id]) REFERENCES [T_USER]([Id]);",
    "ALTER TABLE [refund_requests] DROP CONSTRAINT IF EXISTS [FK_refund_requests_requested_by];",
    "ALTER TABLE [refund_requests] ADD CONSTRAINT [FK_refund_requests_requested_by] FOREIGN KEY ([requested_by_user_id]) REFERENCES [T_USER]([Id]);",
    
    // 8. user_otp
    "ALTER TABLE [user_otp] DROP CONSTRAINT IF EXISTS [FK_user_otp_user];",
    "ALTER TABLE [user_otp] ADD CONSTRAINT [FK_user_otp_user] FOREIGN KEY ([user_id]) REFERENCES [T_USER]([Id]);"
  ];

  for (const cmd of sqlCommands) {
    try {
      console.log(`Executing: ${cmd}`);
      await pool.request().query(cmd);
      console.log('Success');
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
    }
  }

  await pool.close();
  console.log('Finished.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
