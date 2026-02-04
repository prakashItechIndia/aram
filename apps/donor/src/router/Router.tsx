import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoadingScreen } from '../app/components/common/LoadingScreen';
import { ErrorBoundary } from '../app/components/common/ErrorBoundary';
import { Layout } from '../app/components/layout/Layout';

// Lazy load pages
const EntryPage = lazy(() => import('../app/components/screens/EntryPage').then(module => ({ default: module.EntryPage })));
const CreateAccount = lazy(() => import('../app/components/screens/CreateAccount').then(module => ({ default: module.CreateAccount })));
const SignIn = lazy(() => import('../app/components/screens/SignIn').then(module => ({ default: module.SignIn })));
const Dashboard = lazy(() => import('../app/components/screens/Dashboard').then(module => ({ default: module.Dashboard })));
const DonateLoggedIn = lazy(() => import('../app/components/screens/DonateLoggedIn').then(module => ({ default: module.DonateLoggedIn })));
const DonateGuest = lazy(() => import('../app/components/screens/DonateGuest').then(module => ({ default: module.DonateGuest })));
const PaymentProcessing = lazy(() => import('../app/components/screens/PaymentProcessing').then(module => ({ default: module.PaymentProcessing })));
const Reports = lazy(() => import('../app/components/screens/Reports').then(module => ({ default: module.Reports })));
const Profile = lazy(() => import('../app/components/screens/Profile').then(module => ({ default: module.Profile })));
const OtpScreen = lazy(() => import('../app/components/screens/OtpScreen').then(module => ({ default: module.OtpScreen })));
const ForgotPassword = lazy(() => import('../app/components/screens/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('../app/components/screens/ResetPassword').then(module => ({ default: module.ResetPassword })));

export const Router = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen message="Loading..." />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<EntryPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/donate-guest" element={<DonateGuest />} />
          <Route path="/payment-processing" element={<PaymentProcessing />} />
          <Route path="/verify-otp" element={<OtpScreen />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Authenticated Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/donate" element={<DonateLoggedIn />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
