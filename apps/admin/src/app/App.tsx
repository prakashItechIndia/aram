import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@aram/shared';
import { ApiProvider, useApi } from './context/ApiContext';
import { Router } from '../router/Router';
import { Login, TwoFactorAuth } from './components/screens/Login';
import { ForgotPassword } from './components/screens/ForgotPassword';
import { ResetPassword } from './components/screens/ResetPassword';
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
  };

  const handleForgotSubmit = async (email: string) => {
    return forgotPassword(email);
  };

  const handleResetSubmit = async (token: string, newPassword: string) => {
    return resetPassword(token, newPassword);
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

  // Render main application via Router (layout + routes)
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ApiProvider>
    </QueryClientProvider>
  );
}