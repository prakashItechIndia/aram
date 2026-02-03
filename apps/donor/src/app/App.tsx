import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@aram/shared';
import { toast, Toaster } from 'sonner';

// Screens
import { generateReceiptPDF } from '@/app/utils/pdfGenerator';
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
import { OtpScreen } from '@/app/components/screens/OtpScreen';

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
  | 'reset-password'
  | 'otp';

type PaymentStatus = 'processing' | 'success' | 'failed';

interface UserData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  pan?: string;
  isLoggedIn: boolean;
  profilePicture?: string;
}

import { ResetPassword } from './components/screens/ResetPassword';

function AppContent() {
  const {
    api,
    user: authUser,
    isAuthenticated,
    login: apiLogin,
    sendOtp,
    verifyOtp,
    register: apiRegister,
    logout: apiLogout,
    forgotPassword,
    resetPassword,
    fetchUnreadNotificationsCount,
    refreshNotifications,

    processDonation,
    changePassword,
    uploadProfileImage,
    updateProfile
  } = useApi();
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    // Check for reset password token in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token')) return 'reset-password';
    return isAuthenticated ? 'dashboard' : 'entry';
  });
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('processing');
  const [lastDonation, setLastDonation] = useState<any>(null);
  const [intendedRedirect, setIntendedRedirect] = useState<Screen | null>(null);
  const [tempPhone, setTempPhone] = useState<string>('');
  const [user, setUser] = useState<UserData>(() => ({
    id: authUser?.id,
    name: authUser?.name ?? '',
    email: authUser?.email ?? '',
    phone: authUser?.phone ?? '',
    address: authUser?.address ?? '',
    profilePicture: authUser?.profilePicture,
    isLoggedIn: isAuthenticated,
  }));

  // Sync local user state whenever authUser from context changes (e.g. after profile fetch in login)
  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.name ?? '',
        email: authUser.email ?? '',
        phone: authUser.phone ?? '',
        address: authUser.address ?? '',
        profilePicture: authUser.profilePicture,
        isLoggedIn: true,
      });
    }
  }, [authUser]);

  // After reload: ensure profile is fetched if details (like name) are missing
  useEffect(() => {
    if (!isAuthenticated || (user.isLoggedIn && user.name)) return;
    api.authApi
      .authControllerGetProfile()
      .then((profileRes: unknown) => {
        const profile = (profileRes as { data?: { id?: number; name?: string; email?: string; mobileNumber?: string; location?: string; profilePicture?: string } })?.data;
        setUser((prev: UserData) => ({
          ...prev,
          id: profile?.id,
          name: profile?.name ?? prev.name,
          email: profile?.email ?? prev.email,
          phone: profile?.mobileNumber ?? prev.phone,
          address: profile?.location ?? prev.address,
          profilePicture: profile?.profilePicture ?? prev.profilePicture,
          isLoggedIn: true,
        }));

        // Refresh notification count via context
        if (profile?.id) {
          refreshNotifications();
        }
      })
      .catch((err: Error) => {
        console.error('Profile fetch failed:', err);
        setUser((prev) => ({ ...prev, isLoggedIn: true }));
      });
  }, [isAuthenticated, user.isLoggedIn, user.name, api.authApi, fetchUnreadNotificationsCount]);

  const handleLoginToDonate = () => {
    if (isAuthenticated) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('sign-in');
    }
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
        const profile = (profileRes as { data?: { id?: number; name?: string; email?: string; mobileNumber?: string; pan?: string; address?: string; profilePicture?: string } })?.data;
        setUser({
          id: profile?.id,
          name: profile?.name ?? email.split('@')[0],
          email: profile?.email ?? email,
          phone: profile?.mobileNumber ?? '',
          pan: profile?.pan,
          address: profile?.address,
          profilePicture: profile?.profilePicture,
          isLoggedIn: true,
        });
      } catch {
        setUser({ name: email.split('@')[0], email, phone: '', isLoggedIn: true });
      }
      toast.success('Signed in successfully!');
      setCurrentScreen('donate');
      setIntendedRedirect(null);
    } else {
      toast.error(result.error ?? 'Sign in failed');
    }
  };

  const handleLogout = () => {
    apiLogout();
    setUser({ name: '', email: '', phone: '', isLoggedIn: false });
    toast.success('Logged out successfully');
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

        if (user.isLoggedIn) {
          toast.success('Payment successful!');
        } else {
          toast.success('Temporary password sent via mail successfully');
        }

        // Trigger real persistence and notification (only for logged-in users)
        // Guest donations are already handled in the guest-donate API call
        if (user.isLoggedIn) {
          processDonation({
            amount: donationData.amount,
            address: donationData.address,
            donationType: donationData.donationType,
            name: donationData.name,
            pan: donationData.panNumber,
            country: donationData.country,
          }).then((res: { success: boolean }) => {
            if (res.success) {
              refreshNotifications();
            }
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
  const handleSaveProfile = async (data: any) => {
    const res = await updateProfile({
      name: data.name,
      mobileNumber: data.phone,
    });

    if (res.success) {
      setUser({
        ...user,
        name: data.name,
        phone: data.phone,
      });
      toast.success('Profile updated successfully!');
    } else {
      toast.error(res.error || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async (data: any): Promise<{ success: boolean; error?: string }> => {
    const res = await changePassword(data);
    if (res.success) {
      toast.success(res.message || 'Password updated successfully!');
      refreshNotifications();
    } else {
      // Only show toast if it's NOT a current password error (which is handled inline in Profile)
      if (!res.error?.toLowerCase().includes('current password')) {
        toast.error(res.error || 'Failed to update password');
      }
    }
    return res;
  };

  const handleUploadProfileImage = async (file: File) => {
    const res = await uploadProfileImage(file);
    if (res.success) {
      toast.success('Profile photo updated!');
      // User state is auto-updated by context, forcing re-render via effect or direct state update in context
      // If context updates userRef, we need to sync local user state.
      // The useEffect at line 87 syncs local user when authUser changes.
    } else {
      toast.error(res.error || 'Failed to upload photo');
    }
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
      setCurrentScreen(intendedRedirect || 'dashboard');
      setIntendedRedirect(null);
    }
  }, [isAuthenticated, currentScreen, intendedRedirect]);

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
            onGetOtp={async (phone) => {
              const res = await sendOtp(phone);
              if (res.success) {
                toast.success('OTP sent successfully');
                setTempPhone(phone);
                setCurrentScreen('otp');
              } else {
                toast.error(res.error || 'Failed to send OTP');
              }
            }}
            onCreateAccount={() => setCurrentScreen('create-account')}
            onForgotPassword={() => setCurrentScreen('forgot-password')}
            onBack={() => setCurrentScreen('entry')}
            initialEmailOrPhone={tempPhone}
          />
        );

      case 'otp':
        return (
          <OtpScreen
            phoneNumber={tempPhone}
            onVerify={async (otp) => {
              const res = await verifyOtp(tempPhone, otp);
              if (res.success) {
                toast.success('Successfully signed in with OTP');
                setCurrentScreen('dashboard');
              } else {
                toast.error(res.error || 'Verification failed');
              }
            }}
            onEditPhone={() => {
              setCurrentScreen('sign-in');
            }}
            onBack={() => setCurrentScreen('sign-in')}
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
            onReset={async (pwd) => {
              const res = await resetPassword(urlParams.get('token') || '', pwd);
              if (res.success) {
                refreshNotifications();
              }
              return res;
            }}
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
            onDownloadReceipt={() => {
              if (lastDonation) {
                generateReceiptPDF(
                  {
                    receiptNo: lastDonation.receiptNo,
                    date: new Date().toISOString().split('T')[0],
                    eligible80G: true, // Assuming true for now, logically checks donation type
                    type: lastDonation.donationType || lastDonation.type,
                    amount: lastDonation.amount,
                  },
                  {
                    name: lastDonation.name || user.name,
                    email: lastDonation.email || user.email,
                    phone: lastDonation.phone || lastDonation.mobile || user.phone,
                    pan: lastDonation.panNumber || lastDonation.pan || user.pan,
                    address: lastDonation.address || user.address,
                  }
                );
              }
            }}
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
              onLogout={handleLogout}
            />
            <main className="max-w-[1392px] mx-auto p-[24px]">
              <Dashboard onDonateNow={handleDonateNow} userName={user.name} user={user} />
            </main>
          </div>
        );

      case 'donate':
        return (
          <div className="min-h-screen bg-[#FFFFFF]">
            <PortalHeader
              currentPage="donate"
              onNavigate={handleNavigate}
              onLogout={handleLogout}
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
              onLogout={handleLogout}
            />
            <main className="max-w-[1392px] mx-auto p-[24px]">
              <Reports user={user} />
            </main>
          </div>
        );

      case 'profile':
        return (
          <div className="min-h-screen bg-[#FFFFFF]">
            <PortalHeader
              currentPage="profile"
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
            <main className="max-w-[1392px] mx-auto p-[24px]">
              <Profile
                userName={user.name}
                userEmail={user.email}
                userPhone={user.phone}
                onSaveProfile={handleSaveProfile}
                onUpdatePassword={handleUpdatePassword}
                profileImage={user.profilePicture}
                onUploadImage={handleUploadProfileImage}
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
    <div className="w-full min-h-[900px] mx-auto bg-white">
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