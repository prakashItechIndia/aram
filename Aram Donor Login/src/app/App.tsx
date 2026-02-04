import React, { useState } from 'react';
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

// Components
import { PortalHeader } from '@/app/components/aram/PortalHeader';

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
  | 'profile';

type PaymentStatus = 'processing' | 'success' | 'failed';

interface UserData {
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('entry');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('processing');
  const [lastDonation, setLastDonation] = useState<any>(null);
  const [user, setUser] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    isLoggedIn: false,
  });

  // Entry Page Handlers
  const handleLoginToDonate = () => {
    setCurrentScreen('sign-in');
  };

  const handleGuestDonate = () => {
    setCurrentScreen('donate-guest');
  };

  // Create Account Handler
  const handleCreateAccount = (data: any) => {
    setUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      isLoggedIn: true,
    });
    toast.success('Account created successfully!');
    setTimeout(() => {
      setCurrentScreen('dashboard');
    }, 500);
  };

  // Sign In Handler
  const handleSignIn = (email: string, password: string) => {
    // Mock sign in - in real app, would verify credentials
    setUser({
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '9876543210',
      isLoggedIn: true,
    });
    toast.success('Signed in successfully!');
    setTimeout(() => {
      setCurrentScreen('dashboard');
    }, 500);
  };

  // Logout Handler
  const handleLogout = () => {
    setUser({
      name: '',
      email: '',
      phone: '',
      isLoggedIn: false,
    });
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
  };

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
            onBack={() => setCurrentScreen('entry')}
          />
        );

      case 'donate-guest':
        return <DonateGuest onPay={handlePaymentSubmit} onBack={() => setCurrentScreen('entry')} />;

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
            />
            <main className="max-w-[1392px] mx-auto p-[24px]">
              <DonateLoggedIn
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

export default App;