import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { FeatureConfigModule } from './modules/config/config.module';
import { DonorsModule } from './modules/donors/donors.module';
import { DonationCategoriesModule } from './modules/donation-categories/donation-categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { RefundsModule } from './modules/refunds/refunds.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { CommunicationTemplatesModule } from './modules/communication-templates/communication-templates.module';
import { EChallansModule } from './modules/e-challans/e-challans.module';
import { PaymentGatewayModule } from './modules/payment-gateway/payment-gateway.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebsiteModule } from './modules/website/website.module';
import { ExportLogModule } from './modules/export-log/export-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    FeatureConfigModule,
    DonorsModule,
    DonationCategoriesModule,
    TransactionsModule,
    ReceiptsModule,
    RefundsModule,
    EnquiriesModule,
    CommunicationTemplatesModule,
    EChallansModule,
    PaymentGatewayModule,
    ReconciliationModule,
    CampaignsModule,
    AuditModule,
    NotificationsModule,
    WebsiteModule,
    ExportLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
