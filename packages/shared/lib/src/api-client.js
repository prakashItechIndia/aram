/**
 * Factory to create Aram API client with optional auth interceptors.
 * Use from admin/donor apps with basePath from VITE_API_URL and optional auth state.
 */
import { Configuration } from './_api/configuration';
import { createHttpClient, setupHttpInterceptors } from './common/http-client';
import { AramApi, AuditApi, AuthApi, CampaignsApi, CommunicationTemplatesApi, ConfigApi, DonationCategoriesApi, DonorsApi, EChallansApi, EnquiriesApi, ExportLogApi, GalleryApi, NotificationsApi, PaymentGatewayApi, ReceiptsApi, ReconciliationApi, RefundsApi, SponsorsApi, TransactionsApi, WebsiteContentApi, } from './_api/api';
export function createAramApi(config) {
    const { basePath, httpClientMinState } = config;
    const axios = createHttpClient();
    if (httpClientMinState) {
        setupHttpInterceptors(axios, httpClientMinState);
    }
    const configuration = new Configuration({ basePath });
    return {
        authApi: new AuthApi(configuration, basePath, axios),
        configApi: new ConfigApi(configuration, basePath, axios),
        donorsApi: new DonorsApi(configuration, basePath, axios),
        transactionsApi: new TransactionsApi(configuration, basePath, axios),
        campaignsApi: new CampaignsApi(configuration, basePath, axios),
        donationCategoriesApi: new DonationCategoriesApi(configuration, basePath, axios),
        receiptsApi: new ReceiptsApi(configuration, basePath, axios),
        eChallansApi: new EChallansApi(configuration, basePath, axios),
        enquiriesApi: new EnquiriesApi(configuration, basePath, axios),
        communicationTemplatesApi: new CommunicationTemplatesApi(configuration, basePath, axios),
        galleryApi: new GalleryApi(configuration, basePath, axios),
        paymentGatewayApi: new PaymentGatewayApi(configuration, basePath, axios),
        reconciliationApi: new ReconciliationApi(configuration, basePath, axios),
        refundsApi: new RefundsApi(configuration, basePath, axios),
        sponsorsApi: new SponsorsApi(configuration, basePath, axios),
        websiteContentApi: new WebsiteContentApi(configuration, basePath, axios),
        auditApi: new AuditApi(configuration, basePath, axios),
        exportLogApi: new ExportLogApi(configuration, basePath, axios),
        notificationsApi: new NotificationsApi(configuration, basePath, axios),
        aramApi: new AramApi(configuration, basePath, axios),
    };
}
