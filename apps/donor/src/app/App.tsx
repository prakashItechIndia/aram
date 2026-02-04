import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@aram/shared';
import { toast, Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import { Router } from '@/router/Router';

// Components & context
import { ApiProvider, useApi } from '@/app/context/ApiContext';

const queryClient = createQueryClient();

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

function AppContent() {
  const { authUser, isAuthenticated, refreshNotifications } = useApi();
  const [user, setUser] = useState<UserData>(() => ({
    id: authUser?.id,
    name: authUser?.name ?? '',
    email: authUser?.email ?? '',
    phone: authUser?.phone ?? '',
    address: authUser?.address ?? '',
    profilePicture: authUser?.profilePicture,
    isLoggedIn: isAuthenticated,
  }));

  // Sync local user state whenever authUser from context changes
  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.name ?? '',
        email: authUser.email ?? '',
        phone: authUser.phone ?? '',
        address: authUser.address ?? '',
        pan: authUser.pan,
        profilePicture: authUser.profilePicture,
        isLoggedIn: true,
      });
      // Refresh notifications when user is authenticated
      refreshNotifications();
    }
  }, [authUser, refreshNotifications]);

  return (
    <BrowserRouter>
      <div className="w-full min-h-[900px] mx-auto bg-white">
        <Router />
        <Toaster position="top-right" richColors />
      </div>
    </BrowserRouter>
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