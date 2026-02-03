import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { createAramApi, type AramApiClient, type HttpClientMinState } from '@aram/shared';

export const getApiBaseUrl = (): string => {
  try {
    const meta = import.meta as { env?: { VITE_API_URL?: string } };
    return meta?.env?.VITE_API_URL ?? 'http://localhost:3000/api';
  } catch {
    return 'http://localhost:3000/api';
  }
};

const ADMIN_AUTH_STORAGE_KEY = 'aram_admin_auth';

function getStoredAdminAuth(): AuthUser {
  try {
    if (typeof window === 'undefined') return null;
    const s = sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (!s) return null;
    const parsed = JSON.parse(s) as { accessToken?: string; refreshToken?: string };
    if (parsed?.accessToken) {
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken ?? '',
        id: parsed.id,
        name: parsed.name,
        email: parsed.email,
        userType: parsed.userType
      };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function setStoredAdminAuth(user: AuthUser): void {
  try {
    if (typeof window === 'undefined') return;
    if (user?.accessToken) sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

type AuthUser = {
  accessToken: string;
  refreshToken: string;
  id?: number;
  name?: string;
  email?: string;
  userType?: string;
  profilePicture?: string;
} | null;

type ApiContextValue = {
  api: AramApiClient;
  user: AuthUser;
  isAuthenticated: boolean;
  /** Authenticated fetch for API mutate (POST, PATCH, DELETE). Uses Bearer token from context. Pass body as FormData for file uploads (Content-Type omitted). */
  apiFetch: (path: string, options?: { method?: string; body?: string | FormData }) => Promise<Response>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; resetLink?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
};

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser>(() => getStoredAdminAuth());
  const userRef = useRef<AuthUser>(null);
  userRef.current = user;

  const authTokenVersionRef = useRef(0);

  const logout = useCallback(() => {
    setStoredAdminAuth(null);
    setUserState(null);
  }, []);

  const exchangeOnlyOnce = useCallback(async () => {
    // Optional: call refresh token API when backend supports it
  }, []);

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

  const apiFetch = useCallback(
    (path: string, options?: { method?: string; body?: string | FormData }) => {
      const basePath = getApiBaseUrl();
      const url = path.startsWith('http') ? path : `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
      const token = userRef.current?.accessToken;
      const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      if (options?.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
      }
      return fetch(url, { method: options?.method ?? 'GET', headers, body: options?.body });
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const basePath = getApiBaseUrl();
        const res = await fetch(`${basePath}/auth/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = (await res.json()) as {
          access_token?: string;
          user?: {
            id: number;
            name: string;
            email: string;
            userType: string;
          };
          message?: string | string[];
          statusCode?: number;
        };
        const accessToken = data?.access_token;
        if (!accessToken) {
          const message =
            Array.isArray(data?.message) ? data.message.join(', ') : data?.message ?? 'Invalid email or password';
          return { success: false, error: message };
        }
        authTokenVersionRef.current += 1;
        const authUser: AuthUser = {
          accessToken,
          refreshToken: '',
          id: data.user?.id,
          name: data.user?.name,
          email: data.user?.email,
          userType: data.user?.userType,
        };
        setUserState(authUser);
        setStoredAdminAuth(authUser);
        return { success: true };
      } catch (err: unknown) {
        const message = (err as Error)?.message ?? 'Login failed';
        return { success: false, error: String(message) };
      }
    },
    [],
  );

  const forgotPassword = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string; resetLink?: string }> => {
      try {
        const basePath = getApiBaseUrl();
        const res = await fetch(`${basePath}/auth/admin/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = (await res.json()) as { message?: string; resetLink?: string };
        if (!res.ok) {
          const msg = Array.isArray(data?.message) ? data.message.join(', ') : data?.message ?? 'Request failed';
          return { success: false, error: msg };
        }
        return {
          success: true,
          resetLink: data?.resetLink,
          error: undefined,
        };
      } catch (err: unknown) {
        return { success: false, error: (err as Error)?.message ?? 'Request failed' };
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const basePath = getApiBaseUrl();
        const res = await fetch(`${basePath}/auth/admin/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword }),
        });
        const data = (await res.json()) as { message?: string | string[] };
        if (!res.ok) {
          const msg = Array.isArray(data?.message) ? data.message.join(', ') : data?.message ?? 'Reset failed';
          return { success: false, error: msg };
        }
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: (err as Error)?.message ?? 'Request failed' };
      }
    },
    [],
  );

  const setUser = useCallback((u: AuthUser) => {
    setUserState(u);
    setStoredAdminAuth(u);
  }, []);

  const value: ApiContextValue = useMemo(
    () => ({
      api,
      user,
      isAuthenticated: !!user?.accessToken,
      apiFetch,
      login,
      forgotPassword,
      resetPassword,
      logout,
      setUser,
    }),
    [api, user, apiFetch, login, forgotPassword, resetPassword, logout, setUser],
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
