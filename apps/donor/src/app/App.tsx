import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@aram/shared';
import { toast, Toaster } from 'sonner';

// Screens
import { EntryPage } from '@/app/components/screens/EntryPage';
import { CreateAccount } from '@/app/components/screens/CreateAccount';
import { SignIn } from '@/app/components/screens/SignIn';
import { Dashboard } from '@/app/components/screens/Dashboard';
import { DonateLoggedIn } from '@/app/components/screens/DonateLoggedIn';
import { DonateGuest } from '@/app/components/screens/DonateGuest';
import { PaymentProcessing } from '@/app/components/screens/PaymentProcessing';
import { Reports } from '@/app/components/screens/Reports';
import { Profile } from '@/app/components/screens/Profile';
import { ForgotPassword } from '@/app/components/screens/ForgotPassword';

// Components & context
import { PortalHeader } from '@/app/components/aram/PortalHeader';
import { ApiProvider, useApi } from '@/app/context/ApiContext';

const queryClient = createQueryClient();

type Screen =
  | 'entry'
  | 'create-account'
  | 'sign-in'
  | 'dashboard'
  | 'donate'
  | 'donate-guest'
  | 'payment-processing'
  | 'payment-success'
  | 'payment-failed'
  | 'reports'
  | 'profile'
  | 'forgot-password'
  | 'reset-password';

type PaymentStatus = 'processing' | 'success' | 'failed';

interface UserData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
}

import { ResetPassword } from './components/screens/ResetPassword';

function AppContent() {
  const { api, login: apiLogin, register: apiRegister, logout: apiLogout, isAuthenticated, forgotPassword, resetPassword, fetchUnreadNotificationsCount, createNotification } = useApi();
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    // Check for reset password token in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token')) return 'reset-password';
    return isAuthenticated ? 'dashboard' : 'entry';
  });
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('processing');
  const [lastDonation, setLastDonation] = useState<any>(null);
  const [user, setUser] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    isLoggedIn: false,
  });
  const [notificationCount, setNotificationCount] = useState(0);

  // After reload: restore session from token and fetch profile so dashboard shows user name
  useEffect(() => {
    if (!isAuthenticated || user.isLoggedIn) return;
    api.authApi
      .authControllerGetProfile()
      .then((profileRes: unknown) => {
        const profile = (profileRes as { data?: { id?: number; name?: string; email?: string; mobileNumber?: string } })?.data;
        setUser({
          id: profile?.id,
          name: profile?.name ?? '',
          email: profile?.email ?? '',
          phone: profile?.mobileNumber ?? '',
          isLoggedIn: true,
        });
        
        // Fetch persistent notification count
        if (profile?.id) {
          fetchUnreadNotificationsCount(profile.id).then((count: number) => {
            setNotificationCount(count);
          });
        }
      })
      .catch(() => {
        setUser((prev) => ({ ...prev, isLoggedIn: true }));
      });
  }, [isAuthenticated, user.isLoggedIn, api.authApi, fetchUnreadNotificationsCount]);

  const handleLoginToDonate = () => {
    setCurrentScreen('sign-in');
  };

  const handleGuestDonate = () => {
    setCurrentScreen('donate-guest');
  };

  const handleCreateAccount = async (data: any) => {
    const result = await apiRegister({
      name: data.name,
      email: data.email,
      password: data.password ?? '',
    });
    if (result.success) {
      setUser({
        name: data.name,
        email: data.email,
        phone: data.phone ?? '',
        isLoggedIn: true,
      });
      toast.success('Account created successfully!');
      setCurrentScreen('dashboard');
    } else {
      toast.error(result.error ?? 'Registration failed');
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    if (result.success) {
      try {
        const profileRes = await api.authApi.authControllerGetProfile();
        const profile = (profileRes as { data?: { name?: string; email?: string } })?.data;
        setUser({
          name: profile?.name ?? email.split('@')[0],
          email: profile?.email ?? email,
          phone: '',
          isLoggedIn: true,
        });
      } catch {
        setUser({ name: email.split('@')[0], email, phone: '', isLoggedIn: true });
      }
      toast.success('Signed in successfully!');
      setCurrentScreen('dashboard');
    } else {
      toast.error(result.error ?? 'Sign in failed');
    }
  };

  const handleLogout = () => {
    apiLogout();
    setUser({ name: '', email: '', phone: '', isLoggedIn: false });
    toast.info('Logged out successfully');
    setCurrentScreen('entry');
  };

  // Donation Handlers
  const handleDonateNow = () => {
    setCurrentScreen('donate');
  };

  const handlePaymentSubmit = (donationData: any) => {
    setLastDonation({
      ...donationData,
      receiptNo: `AR${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    });
    setPaymentStatus('processing');
    setCurrentScreen('payment-processing');

    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate for demo
      const success = Math.random() > 0.1;
      if (success) {
        setPaymentStatus('success');
        toast.success('Payment successful!');
        
        // Trigger persistent notification
        if (user.id) {
          createNotification({
            userId: user.id,
            type: 'success',
            title: 'Donated',
            message: `Thank you for your donation of ₹${donationData.amount.toLocaleString()}! Receipt ${lastDonation?.receiptNo || ''} has been generated.`,
          }).then(() => {
             // Refresh count immediately
             fetchUnreadNotificationsCount(user.id!).then(setNotificationCount);
          });
        }
      } else {
        setPaymentStatus('failed');
        toast.error('Payment failed. Please try again.');
      }
    }, 2000);
  };

  // Navigation Handler for Logged-in Portal
  const handleNavigate = (page: string) => {
    setCurrentScreen(page as Screen);
  };

  // Profile Handlers
  const handleSaveProfile = (data: any) => {
    setUser({
      ...user,
      name: data.name,
      phone: data.phone,
    });
    toast.success('Profile updated successfully!');
  };

  const handleUpdatePassword = (data: any) => {
    toast.success('Password updated successfully!');
    setNotificationCount((prev: number) => prev + 1);
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    const result = await forgotPassword(email);
    return {
      success: result.success,
      error: result.error,
      // No reset link for production flow in temp password mode, but for UI compatibility we can pass something if needed, 
      // or the UI handles success message. ForgotPassword.tsx expects { success, error, resetLink? }.
      // Since we send a temp password, we don't return a link.
      // But we should check ForgotPassword.tsx to see if it handles success without link correctly.
      // Looking at line 40 of ForgotPassword.tsx: if (result.success) setSent(true); if (result.resetLink) setResetLink...
      // So resetLink is optional. It will show "Check your email".
    };
  };

  // When authenticated (e.g. after reload), show dashboard not entry
  useEffect(() => {
    if (isAuthenticated && (currentScreen === 'entry' || currentScreen === 'sign-in' || currentScreen === 'create-account')) {
      setCurrentScreen('dashboard');
    }
  }, [isAuthenticated, currentScreen]);

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'entry':
        return (
          <EntryPage
            onLoginToDonate={handleLoginToDonate}
            onGuestDonate={handleGuestDonate}
          />
        );

      case 'create-account':
        return (
          <CreateAccount
            onCreateAccount={handleCreateAccount}
            onSignIn={() => setCurrentScreen('sign-in')}
            onBack={() => setCurrentScreen('entry')}
          />
        );

      case 'sign-in':
        return (
          <SignIn
            onSignIn={handleSignIn}
            onCreateAccount={() => setCurrentScreen('create-account')}
            onForgotPassword={() => setCurrentScreen('forgot-password')}
            onBack={() => setCurrentScreen('entry')}
          />
        );

      case 'forgot-password':
        return (
          <ForgotPassword
            onSubmit={handleForgotPasswordSubmit}
            onBack={() => setCurrentScreen('sign-in')}
          />
        );
      case 'reset-password':
        const urlParams = new URLSearchParams(window.location.search);
        return (
            <ResetPassword
                token={urlParams.get('token') || ''}
                onBack={() => {
                    // Clear query param
                    window.history.replaceState({}, '', window.location.pathname);
                    setCurrentScreen('sign-in');
                }}
                onReset={(pwd) => resetPassword(urlParams.get('token') || '', pwd)}
            />
        );

      case 'donate-guest':
        return <DonateGuest api={api} onPay={handlePaymentSubmit} onBack={() => setCurrentScreen('entry')} />;

      case 'payment-processing':
        return (
          <PaymentProcessing
            status={paymentStatus}
            donationData={lastDonation ? {
              amount: lastDonation.amount,
              type: lastDonation.donationType,
              receiptNo: lastDonation.receiptNo,
            } : undefined}
            onDownloadReceipt={() => toast.info('Downloading receipt...')}
            onGoToDashboard={() => setCurrentScreen(user.isLoggedIn ? 'dashboard' : 'entry')}
            onTryAgain={() => setCurrentScreen(user.isLoggedIn ? 'donate' : 'donate-guest')}
          />
        );

      // Logged-in Portal Screens
      case 'dashboard':
        return (
          <div className="min-h-screen bg-[#FFFFFF]">
            <PortalHeader
              currentPage="dashboard"
              onNavigate={handleNavigate}
              userName={user.name}
              onLogout={handleLogout}
              notificationCount={notificationCount}
            />
            <main className="max-w-[1392px] mx-auto p-[24px]">
              <Dashboard onDonateNow={handleDonateNow} userName={user.name} />
            </main>
          </div>
        );

      case 'donate':
        return (
          <div className="min-h-screen bg-[#FFFFFF]">
            <PortalHeader
              currentPage="donate"
              onNavigate={handleNavigate}
              userName={user.name}
              onLogout={handleLogout}
              notificationCount={notificationCount}
            />
            <main className="max-w-[1392px] mx-auto p-[24px]">
              <DonateLoggedIn
                api={api}
                onPay={handlePaymentSubmit}
                userName={user.name}
                userEmail={user.email}
                userPhone={user.phone}
              />
            </main>
          </div>
        );

      case 'reports':
        return (
          <div className="min-h-screen bg-[#FFFFFF]">
            <PortalHeader
              currentPage="reports"
              onNavigate={handleNavigate}
              userName={user.name}
              onLogout={handleLogout}
              notificationCount={notificationCount}
            />
            <main className="max-w-[1392px] mx-auto p-[24px]">
              <Reports />
            </main>
          </div>
        );

      case 'profile':
        return (
          <div className="min-h-screen bg-[#FFFFFF]">
            <PortalHeader
              currentPage="profile"
              onNavigate={handleNavigate}
              userName={user.name}
              onLogout={handleLogout}
              notificationCount={notificationCount}
            />
            <main className="max-w-[1392px] mx-auto p-[24px]">
              <Profile
                userName={user.name}
                userEmail={user.email}
                userPhone={user.phone}
                onSaveProfile={handleSaveProfile}
                onUpdatePassword={handleUpdatePassword}
              />
            </main>
          </div>
        );

      default:
        return (
          <EntryPage
            onLoginToDonate={handleLoginToDonate}
            onGuestDonate={handleGuestDonate}
          />
        );
    }
  };

  return (
    <div className="w-[1440px] min-h-[900px] mx-auto bg-white">
      {renderScreen()}
      <Toaster position="top-right" richColors />
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