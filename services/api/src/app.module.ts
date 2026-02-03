import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { S3Module } from './modules/s3/s3.module';
import { AuthModule } from './modules/auth/auth.module';
import { FeatureConfigModule } from './modules/config/config.module';
import { DonorsModule } from './modules/donors/donors.module';
import { DonationCategoriesModule } from './modules/donation-categories/donation-categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { ReceiptSettingsModule } from './modules/receipt-settings/receipt-settings.module';
import { RefundsModule } from './modules/refunds/refunds.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { CommunicationTemplatesModule } from './modules/communication-templates/communication-templates.module';
import { EChallansModule } from './modules/e-challans/e-challans.module';
import { DonationFormSettingsModule } from './modules/donation-form-settings/donation-form-settings.module';
import { PaymentGatewayModule } from './modules/payment-gateway/payment-gateway.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebsiteModule } from './modules/website/website.module';
import { ExportLogModule } from './modules/export-log/export-log.module';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { AdminUsersModule } from './modules/admin-users/admin-users.module';
import { SmsModule } from './modules/sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    S3Module,
    AuthModule,
    FeatureConfigModule,
    DonorsModule,
    DonationCategoriesModule,
    TransactionsModule,
    ReceiptsModule,
    ReceiptSettingsModule,
    RefundsModule,
    EnquiriesModule,
    CommunicationTemplatesModule,
    EChallansModule,
    DonationFormSettingsModule,
    PaymentGatewayModule,
    ReconciliationModule,
    CampaignsModule,
    AuditModule,
    NotificationsModule,
    WebsiteModule,
    ExportLogModule,
    UserRolesModule,
    AdminUsersModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
