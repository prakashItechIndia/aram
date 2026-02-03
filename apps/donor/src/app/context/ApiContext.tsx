import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { createAramApi, type AramApiClient, type HttpClientMinState } from '@aram/shared';

const getApiBaseUrl = (): string => {
  try {
    const meta = import.meta as { env?: { VITE_API_URL?: string } };
    return meta?.env?.VITE_API_URL ?? 'http://localhost:3000/api';
  } catch {
    return 'http://localhost:3000/api';
  }
};

const DONOR_AUTH_STORAGE_KEY = 'aram_donor_auth';

type AuthUser = {
  accessToken: string;
  refreshToken: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  id?: number;
} | null;

export type Notification = {
  id: number;
  userId: number;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};

function getStoredDonorAuth(): AuthUser {
  try {
    if (typeof window === 'undefined') return null;
    const s = sessionStorage.getItem(DONOR_AUTH_STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s) as AuthUser;
  } catch {
    /* ignore */
  }
  return null;
}

function setStoredDonorAuth(user: AuthUser): void {
  try {
    if (typeof window === 'undefined') return;
    if (user?.accessToken) sessionStorage.setItem(DONOR_AUTH_STORAGE_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(DONOR_AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

type ApiContextValue = {
  api: AramApiClient;
  user: AuthUser;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (data: any) => Promise<{ success: boolean; error?: string; message?: string }>;
  uploadProfileImage: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  updateProfile: (data: { name?: string; mobileNumber?: string }) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
  fetchUnreadNotificationsCount: (userId: number) => Promise<number>;
  fetchNotifications: (userId: number) => Promise<Notification[]>;
  refreshNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: number) => Promise<{ success: boolean; error?: string }>;
  createNotification: (data: { userId?: number; type: string; title: string; message: string }) => Promise<{ success: boolean; error?: string }>;
  processDonation: (data: any) => Promise<{ success: boolean; error?: string; challanNumber?: string }>;
  notificationCount: number;
  notifications: Notification[];
};

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser>(() => getStoredDonorAuth());
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userRef = useRef<AuthUser>(null);
  userRef.current = user;

  const authTokenVersionRef = useRef(0);

  const logout = useCallback(() => {
    setStoredDonorAuth(null);
    setUserState(null);
  }, []);

  const exchangeOnlyOnce = useCallback(async () => { }, []);

  const httpClientMinState: HttpClientMinState = useMemo(
    () => ({
      get user() {
        return userRef.current;
      },
      get authTokenVersion() {
        return authTokenVersionRef.current;
      },
      exchangeOnlyOnce,
      logout,
    }),
    [exchangeOnlyOnce, logout],
  );

  const api = useMemo(() => {
    const basePath = getApiBaseUrl();
    return createAramApi({ basePath, httpClientMinState });
  }, [httpClientMinState]);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string; data?: unknown }> => {
      try {
        const res = await api.authApi.authControllerLogin({ email, password });
        const data = (res as { data?: { access_token?: string; refresh_token?: string } })?.data;
        const accessToken = data?.access_token;
        if (!accessToken) {
          return { success: false, error: 'Invalid response from server' };
        }

        authTokenVersionRef.current += 1;
        const tempAuthUser: AuthUser = {
          accessToken,
          refreshToken: data?.refresh_token ?? '',
        };
        setUserState(tempAuthUser);
        userRef.current = tempAuthUser; // Immediately update ref for interceptors
        setStoredDonorAuth(tempAuthUser);

        // Fetch profile immediately to store full details
        let profile: any = {};
        try {
          const profileRes = await api.authApi.authControllerGetProfile();
          profile = (profileRes as { data?: any })?.data || {};
        } catch (e) {
          console.warn('Failed to fetch profile during login, using partial data');
        }

        const authUser: AuthUser = {
          ...tempAuthUser,
          accessToken, // Ensuring it's still there
          id: profile?.id,
          name: profile?.name,
          email: profile?.email ?? email,
          phone: profile?.mobileNumber || profile?.mobile_number, // Handle different casing if any
          address: profile?.location,
          profilePicture: profile?.profilePicture,
        };
        setUserState(authUser);
        userRef.current = authUser; // Update again with final data
        setStoredDonorAuth(authUser);
        return { success: true, data };
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          (err as Error)?.message ??
          'Login failed';
        return { success: false, error: String(message) };
      }
    },
    [api.authApi],
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
    }): Promise<{ success: boolean; error?: string }> => {
      try {
        await api.authApi.authControllerRegister({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        return { success: true };
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          (err as Error)?.message ??
          'Registration failed';
        return { success: false, error: String(message) };
      }
    },
    [api.authApi],
  );

  const setUser = useCallback((u: AuthUser) => {
    setUserState(u);
    setStoredDonorAuth(u);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const baseUrl = getApiBaseUrl();
      console.log('Sending forgot password request to:', `${baseUrl}/auth/forgot-password`, { email });
      const res = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Forgot password response status:', res.status);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('Forgot password error response:', data);
        throw new Error(data.message || 'Request failed');
      }

      const data = await res.json();
      console.log('Forgot password success:', data);
      return { success: true, message: data.message };
    } catch (err: unknown) {
      console.error('Forgot password exception:', err);
      return { success: false, error: (err as Error).message };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Request failed');
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }, []);

  const fetchUnreadNotificationsCount = useCallback(async (userId: number) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/notifications/unread-count/${userId}`, {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
        },
      });
      if (!res.ok) return 0;
      const count = await res.json();
      const result = typeof count === 'number' ? count : 0;
      setNotificationCount(result);
      return result;
    } catch {
      return 0;
    }
  }, [user]);

  const fetchNotifications = useCallback(async (userId: number) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/notifications?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
        },
      });
      if (!res.ok) return [];
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      // Sort by date descending
      const sortedList = list.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedList);
      return sortedList;
    } catch {
      return [];
    }
  }, [user]);

  const refreshNotifications = useCallback(async () => {
    if (user?.id) {
      await Promise.all([
        fetchUnreadNotificationsCount(user.id),
        fetchNotifications(user.id)
      ]);
    }
  }, [user, fetchUnreadNotificationsCount, fetchNotifications]);

  const markNotificationAsRead = useCallback(async (notificationId: number) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to mark notification as read');

      // Optimistic UI update
      setNotifications((prev: Notification[]) => prev.map((n: Notification) => n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n));
      setNotificationCount((prev: number) => Math.max(0, prev - 1));

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }, [user?.accessToken]);

  React.useEffect(() => {
    if (user?.id) {
      refreshNotifications();
    }
  }, [user?.id, refreshNotifications]);

  const createNotification = useCallback(async (data: { userId?: number; type: string; title: string; message: string }) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create notification');
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }, [user?.accessToken]);

  const processDonation = useCallback(async (data: any) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/donors/process-donation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to process donation');
      const result = await res.json();
      return { success: true, ...result };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }, [user?.accessToken]);

  const changePassword = useCallback(async (data: any) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update password');
      }
      return { success: true, message: 'Password updated successfully' };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }, [user?.accessToken]);

  const uploadProfileImage = useCallback(async (file: File) => {
    try {
      const baseUrl = getApiBaseUrl();
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${baseUrl}/auth/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to upload image');
      }

      const data = await res.json();
      // Update local user state with new image
      if (data.url && user) {
        const updatedUser = { ...user, profilePicture: data.url };
        setUserState(updatedUser);
        userRef.current = updatedUser;
        setStoredDonorAuth(updatedUser);
      }

      return { success: true, url: data.url };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }, [user]);

  const updateProfile = useCallback(async (data: { name?: string; mobileNumber?: string }) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/auth/profile`, {
        method: 'POST', // Matches AuthController.updateProfile which used @Post('profile')
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update profile');
      }

      const resData = await res.json();

      // Update local user state if successful
      if (user) {
        const updatedUser = {
          ...user,
          name: data.name ?? user.name,
          phone: data.mobileNumber ?? user.phone
        };
        setUserState(updatedUser);
        userRef.current = updatedUser;
        setStoredDonorAuth(updatedUser);
      }

      return { success: true, message: resData.message };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }, [user]);

  const value: ApiContextValue = useMemo(
    () => ({
      api,
      user,
      isAuthenticated: !!user?.accessToken,
      login,
      register,
      changePassword,
      uploadProfileImage,
      updateProfile,
      logout,
      setUser,
      forgotPassword,
      resetPassword,
      fetchUnreadNotificationsCount,
      fetchNotifications,
      refreshNotifications,
      markNotificationAsRead,
      createNotification,
      processDonation,
      notificationCount,
      notifications,
    }),
    [
      api,
      user,
      login,
      register,
      changePassword,
      uploadProfileImage,
      updateProfile,
      logout,
      setUser,
      forgotPassword,
      resetPassword,
      fetchUnreadNotificationsCount,
      fetchNotifications,
      refreshNotifications,
      markNotificationAsRead,
      createNotification,
      processDonation,
      notificationCount,
      notifications
    ],
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextValue {
  const ctx = React.useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used within ApiProvider');
  return ctx;
}

export function useApiOptional(): ApiContextValue | null {
  return React.useContext(ApiContext);
}
