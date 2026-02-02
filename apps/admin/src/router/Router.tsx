import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../app/components/layout/LoadingScreen';
import { ErrorBoundary } from '../app/components/common/ErrorBoundary';

// Lazy load pages with code splitting
const DashboardPage = lazy(() => import('../app/pages/Dashboard'));
const TransactionsPage = lazy(() => import('../app/pages/Transactions'));
const DonorsPage = lazy(() => import('../app/pages/Donors'));
const FundCollectionReportPage = lazy(() => import('../app/pages/FundCollectionReport'));
const DonationFormSettingsPage = lazy(() => import('../app/pages/DonationFormSettings'));
const UsersRolesPage = lazy(() => import('../app/pages/UsersRoles'));
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

export const Router = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <DashboardPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <DashboardPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/payments/transactions"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <TransactionsPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/donors/all"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <DonorsPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/reports/fund-collection"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <FundCollectionReportPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/settings/donation-form"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <DonationFormSettingsPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/settings/users-roles"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <UsersRolesPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/payments/reconciliation"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <ReconciliationPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/payments/gateway-settings"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <GatewaySettingsPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/receipts/management"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <ReceiptManagementPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/master-data/donation-categories"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <DonationCategoriesPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/reports/receipt-register"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <ReceiptRegisterPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/communications/enquiries"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <EnquiriesPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/communications/templates"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <TemplatesPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/communications/automation"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <AutomationPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/website/content"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <ContentPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/website/sponsors"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <SponsorsPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/website/gallery"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <GalleryPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/payments/e-challan-entry"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <EChallanEntryPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};
