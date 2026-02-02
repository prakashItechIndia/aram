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

type AuthUser = { accessToken: string; refreshToken: string } | null;

type ApiContextValue = {
  api: AramApiClient;
  user: AuthUser;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
};

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser>(null);
  const userRef = useRef<AuthUser>(null);
  userRef.current = user;

  const authTokenVersionRef = useRef(0);

  const logout = useCallback(() => {
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

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await api.authApi.authControllerLogin({ email, password });
        const data = (res as { data?: { access_token?: string; refresh_token?: string } })?.data;
        const accessToken = data?.access_token;
        if (!accessToken) {
          return { success: false, error: 'Invalid response from server' };
        }
        authTokenVersionRef.current += 1;
        setUserState({
          accessToken,
          refreshToken: data?.refresh_token ?? '',
        });
        return { success: true };
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string }; status?: number } })?.response?.data
            ?.message ?? (err as Error)?.message ?? 'Login failed';
        return { success: false, error: String(message) };
      }
    },
    [api.authApi],
  );

  const setUser = useCallback((u: AuthUser) => {
    setUserState(u);
  }, []);

  const value: ApiContextValue = useMemo(
    () => ({
      api,
      user,
      isAuthenticated: !!user?.accessToken,
      login,
      logout,
      setUser,
    }),
    [api, user, login, logout, setUser],
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
