import type { HttpClientMinState } from './type';
import { AramApi, AuditApi, AuthApi, CampaignsApi, CommunicationTemplatesApi, ConfigApi, DonationCategoriesApi, DonorsApi, EChallansApi, EnquiriesApi, ExportLogApi, GalleryApi, NotificationsApi, PaymentGatewayApi, ReceiptsApi, ReconciliationApi, RefundsApi, SponsorsApi, TransactionsApi, WebsiteContentApi } from './_api/api';
export interface AramApiClientConfig {
    basePath: string;
    /** When provided, request interceptor adds Bearer token and response interceptor handles 401/logout. */
    httpClientMinState?: HttpClientMinState;
}
export interface AramApiClient {
    authApi: AuthApi;
    configApi: ConfigApi;
    donorsApi: DonorsApi;
    transactionsApi: TransactionsApi;
    campaignsApi: CampaignsApi;
    donationCategoriesApi: DonationCategoriesApi;
    receiptsApi: ReceiptsApi;
    eChallansApi: EChallansApi;
    enquiriesApi: EnquiriesApi;
    communicationTemplatesApi: CommunicationTemplatesApi;
    galleryApi: GalleryApi;
    paymentGatewayApi: PaymentGatewayApi;
    reconciliationApi: ReconciliationApi;
    refundsApi: RefundsApi;
    sponsorsApi: SponsorsApi;
    websiteContentApi: WebsiteContentApi;
    auditApi: AuditApi;
    exportLogApi: ExportLogApi;
    notificationsApi: NotificationsApi;
    aramApi: AramApi;
}
export declare function createAramApi(config: AramApiClientConfig): AramApiClient;
//# sourceMappingURL=api-client.d.ts.map