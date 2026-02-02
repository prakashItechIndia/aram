import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@aram/shared';
import { ApiProvider, useApi } from './context/ApiContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Login, TwoFactorAuth } from './components/screens/Login';
import { ForgotPassword } from './components/screens/ForgotPassword';
import { ResetPassword } from './components/screens/ResetPassword';
import { Dashboard } from './components/screens/Dashboard';
import { Transactions } from './components/screens/Transactions';
import { Donors } from './components/screens/Donors';
import { FundCollectionReport } from './components/screens/FundCollectionReport';
import { DonationFormSettings } from './components/screens/DonationFormSettings';
import { UsersRoles } from './screens/UsersRoles';
import { Reconciliation } from './screens/Reconciliation';
import { GatewaySettings } from './screens/GatewaySettings';
import { ReceiptManagement } from './screens/ReceiptManagement';
import { DonationCategories } from './screens/DonationCategories';
import { ReceiptRegisterScreen } from './screens/ReceiptRegisterScreen';
import { EnquiriesScreen } from './screens/EnquiriesScreen';
import { TemplatesScreen } from './screens/TemplatesScreen';
import { AutomationScreen } from './screens/AutomationScreen';
import { ContentScreen } from './screens/ContentScreen';
import { SponsorsScreen } from './screens/SponsorsScreen';
import { GalleryScreen } from './screens/GalleryScreen';
import { EChallanEntryScreen } from './screens/EChallanEntryScreen';
import { Toaster } from './components/ui/toast';

const queryClient = createQueryClient();

type AuthState = 'login' | 'forgot' | 'reset' | '2fa' | 'authenticated';

function getResetTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

function AppContent() {
  const { login: apiLogin, forgotPassword, resetPassword, logout: apiLogout, isAuthenticated } = useApi();
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (isAuthenticated) return 'authenticated';
    return getResetTokenFromUrl() ? 'reset' : 'login';
  });
  const [resetToken, setResetToken] = useState<string | null>(() => getResetTokenFromUrl());
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const handleLogin = async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    if (result.success) {
      setAuthState('authenticated');
    }
    return result;
  };

  const handleShow2FA = () => {
    setAuthState('2fa');
  };

  const handleVerify2FA = (_code: string) => {
    setAuthState('authenticated');
  };

  const handleResend = () => {
    // Resend 2FA code – wire to API when backend supports it
  };

  const handleLogout = () => {
    apiLogout();
    setAuthState('login');
    setResetToken(null);
    setCurrentPath('/dashboard');
  };

  const handleForgotSubmit = async (email: string) => {
    return forgotPassword(email);
  };

  const handleResetSubmit = async (token: string, newPassword: string) => {
    return resetPassword(token, newPassword);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  // Render auth screens when not authenticated
  if (!isAuthenticated) {
    if (authState === '2fa') {
      return (
        <>
          <TwoFactorAuth onVerify={handleVerify2FA} onResend={handleResend} />
          <Toaster />
        </>
      );
    }
    if (authState === 'forgot') {
      return (
        <>
          <ForgotPassword onSubmit={handleForgotSubmit} onBack={() => setAuthState('login')} />
          <Toaster />
        </>
      );
    }
    if (authState === 'reset' && resetToken) {
      return (
        <>
          <ResetPassword
            token={resetToken}
            onSubmit={handleResetSubmit}
            onBack={() => {
              setResetToken(null);
              setAuthState('login');
              window.history.replaceState({}, '', window.location.pathname);
            }}
          />
          <Toaster />
        </>
      );
    }
    if (authState === 'reset' && !resetToken) {
      return (
        <>
          <Login
            onLogin={handleLogin}
            onShow2FA={handleShow2FA}
            onForgotPassword={() => setAuthState('forgot')}
          />
          <Toaster />
        </>
      );
    }
    return (
      <>
        <Login
          onLogin={handleLogin}
          onShow2FA={handleShow2FA}
          onForgotPassword={() => setAuthState('forgot')}
        />
        <Toaster />
      </>
    );
  }

  // Render main application
  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      <Header onLogout={handleLogout} />
      
      {/* Main Content - Always 280px margin since header stays full width */}
      <div className="ml-[280px] mt-[72px] p-[24px]">
        {currentPath === '/dashboard' && <Dashboard onNavigate={handleNavigate} />}
        {currentPath === '/settings/donation-form' && <DonationFormSettings />}
        {currentPath === '/payments/transactions' && <Transactions />}
        {currentPath === '/donors/all' && <Donors />}
        {currentPath === '/reports/fund-collection' && <FundCollectionReport />}
        {currentPath === '/reports/receipt-register' && <ReceiptRegisterScreen />}
        {currentPath === '/settings/users-roles' && <UsersRoles />}
        {currentPath === '/payments/reconciliation' && <Reconciliation />}
        {currentPath === '/payments/gateway-settings' && <GatewaySettings />}
        {currentPath === '/receipts/management' && <ReceiptManagement />}
        {currentPath === '/master-data/donation-categories' && <DonationCategories />}
        {currentPath === '/communications/enquiries' && <EnquiriesScreen />}
        {currentPath === '/communications/templates' && <TemplatesScreen />}
        {currentPath === '/communications/automation' && <AutomationScreen />}
        {currentPath === '/website/content' && <ContentScreen />}
        {currentPath === '/website/sponsors' && <SponsorsScreen />}
        {currentPath === '/website/gallery' && <GalleryScreen />}
        {currentPath === '/payments/e-challan-entry' && <EChallanEntryScreen />}
        
        {/* Placeholder for other screens */}
        {!['dashboard', 'settings/donation-form', 'payments/transactions', 'donors/all', 'reports/fund-collection', 'reports/receipt-register', 'settings/users-roles', 'payments/reconciliation', 'payments/gateway-settings', 'receipts/management', 'master-data/donation-categories', 'communications/enquiries', 'communications/templates', 'communications/automation', 'website/content', 'website/sponsors', 'website/gallery', 'payments/e-challan-entry'].some(path => currentPath.includes(path)) && (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FEF1EE] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#F36A4F] text-2xl">🚧</span>
              </div>
              <h2 className="text-[22px] leading-[30px] font-bold text-[#0D0D0D] mb-2">
                Screen Under Development
              </h2>
              <p className="text-[16px] leading-[24px] text-[#6E6E6E] mb-2">
                Path: {currentPath}
              </p>
              <p className="text-[14px] leading-[20px] text-[#6E6E6E] max-w-md mx-auto">
                This screen is part of the Aram Foundation Admin Portal. Navigate using the sidebar to explore implemented features.
              </p>
              <button
                onClick={() => handleNavigate('/dashboard')}
                className="mt-6 h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] hover:bg-[#D7563D] transition-colors font-semibold text-[14px]"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <AppContent />
      </ApiProvider>
    </QueryClientProvider>
  );
}