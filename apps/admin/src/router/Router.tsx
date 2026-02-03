import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../app/components/layout/LoadingScreen';
import { ErrorBoundary } from '../app/components/common/ErrorBoundary';
import { AuthenticatedLayout } from '../app/components/layout/AuthenticatedLayout';

function ScreenUnderDevelopment() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#FEF1EE] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-[#F36A4F] text-2xl">🚧</span>
        </div>
        <h2 className="text-[22px] leading-[30px] font-bold text-[#0D0D0D] mb-2">
          Screen Under Development
        </h2>
        <p className="text-[16px] leading-[24px] text-[#6E6E6E] mb-2">
          Path: {location.pathname}
        </p>
        <p className="text-[14px] leading-[20px] text-[#6E6E6E] max-w-md mx-auto">
          This screen is part of the Aram Foundation Admin Portal. Navigate using the sidebar to explore implemented features.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] hover:bg-[#D7563D] transition-colors font-semibold text-[14px]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// Lazy load pages with code splitting
const DashboardPage = lazy(() => import('../app/pages/Dashboard'));
const TransactionsPage = lazy(() => import('../app/pages/Transactions'));
const DonorsPage = lazy(() => import('../app/pages/Donors'));
const FundCollectionReportPage = lazy(() => import('../app/pages/FundCollectionReport'));
const DonationFormSettingsPage = lazy(() => import('../app/pages/DonationFormSettings'));
const UsersRolesPage = lazy(() => import('../app/pages/UsersRoles'));
const UsersPage = lazy(() => import('../app/pages/Users'));
const ReconciliationPage = lazy(() => import('../app/pages/Reconciliation'));
const GatewaySettingsPage = lazy(() => import('../app/pages/GatewaySettings'));
const ReceiptManagementPage = lazy(() => import('../app/pages/ReceiptManagement'));
const DonationCategoriesPage = lazy(() => import('../app/pages/DonationCategories'));
const ReceiptRegisterPage = lazy(() => import('../app/pages/ReceiptRegister'));
const EnquiriesPage = lazy(() => import('../app/pages/Enquiries'));
const TemplatesPage = lazy(() => import('../app/pages/Templates'));
const AutomationPage = lazy(() => import('../app/pages/Automation'));
const ContentPage = lazy(() => import('../app/pages/Content'));
const SponsorsPage = lazy(() => import('../app/pages/Sponsors'));
const GalleryPage = lazy(() => import('../app/pages/Gallery'));
const EChallanEntryPage = lazy(() => import('../app/pages/EChallanEntry'));

const PageSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen message="Loading..." />}>
    <ErrorBoundary>{children}</ErrorBoundary>
  </Suspense>
);

export const Router = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<AuthenticatedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<PageSuspense><DashboardPage /></PageSuspense>} />
          <Route path="payments/transactions" element={<PageSuspense><TransactionsPage /></PageSuspense>} />
          <Route path="donors/all" element={<PageSuspense><DonorsPage /></PageSuspense>} />
          <Route path="reports/fund-collection" element={<PageSuspense><FundCollectionReportPage /></PageSuspense>} />
          <Route path="settings/donation-form" element={<PageSuspense><DonationFormSettingsPage /></PageSuspense>} />
          <Route path="settings/users-roles" element={<PageSuspense><UsersRolesPage /></PageSuspense>} />
          <Route path="settings/users" element={<PageSuspense><UsersPage /></PageSuspense>} />
          <Route path="payments/reconciliation" element={<PageSuspense><ReconciliationPage /></PageSuspense>} />
          <Route path="payments/gateway-settings" element={<PageSuspense><GatewaySettingsPage /></PageSuspense>} />
          <Route path="receipts/management" element={<PageSuspense><ReceiptManagementPage /></PageSuspense>} />
          <Route path="master-data/donation-categories" element={<PageSuspense><DonationCategoriesPage /></PageSuspense>} />
          <Route path="reports/receipt-register" element={<PageSuspense><ReceiptRegisterPage /></PageSuspense>} />
          <Route path="communications/enquiries" element={<PageSuspense><EnquiriesPage /></PageSuspense>} />
          <Route path="communications/templates" element={<PageSuspense><TemplatesPage /></PageSuspense>} />
          <Route path="communications/automation" element={<PageSuspense><AutomationPage /></PageSuspense>} />
          <Route path="website/content" element={<PageSuspense><ContentPage /></PageSuspense>} />
          <Route path="website/sponsors" element={<PageSuspense><SponsorsPage /></PageSuspense>} />
          <Route path="website/gallery" element={<PageSuspense><GalleryPage /></PageSuspense>} />
          <Route path="payments/e-challan-entry" element={<PageSuspense><EChallanEntryPage /></PageSuspense>} />
          <Route path="*" element={<ScreenUnderDevelopment />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};
