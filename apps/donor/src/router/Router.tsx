import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../app/components/common/LoadingScreen';
import { ErrorBoundary } from '../app/components/common/ErrorBoundary';

// Lazy load pages with code splitting
const EntryPage = lazy(() => import('../app/pages/Entry'));
const CreateAccountPage = lazy(() => import('../app/pages/CreateAccount'));
const SignInPage = lazy(() => import('../app/pages/SignIn'));
const DashboardPage = lazy(() => import('../app/pages/Dashboard'));
const DonatePage = lazy(() => import('../app/pages/Donate'));
const DonateGuestPage = lazy(() => import('../app/pages/DonateGuest'));
const PaymentProcessingPage = lazy(() => import('../app/pages/PaymentProcessing'));
const ReportsPage = lazy(() => import('../app/pages/Reports'));
const ProfilePage = lazy(() => import('../app/pages/Profile'));

export const Router = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <EntryPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/create-account"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <CreateAccountPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/signin"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <SignInPage />
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
          path="/donate"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <DonatePage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/donate-guest"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <DonateGuestPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/payment-processing"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <PaymentProcessingPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/reports"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <ReportsPage />
              </ErrorBoundary>
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <ErrorBoundary>
                <ProfilePage />
              </ErrorBoundary>
            </Suspense>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};
