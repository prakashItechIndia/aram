/**
 * Centralized Token Refresh Service
 *
 * This service handles automatic token refresh across all products/apps
 * in the same browser. It uses:
 * - Shared cookie storage (already implemented in secureTokenStorage)
 * - Storage events for cross-tab synchronization
 * - Proactive refresh before token expiration
 *
 * All products should use this service instead of implementing their own refresh logic.
 */

import { secureTokenStorage } from '../utils/secureTokenStorage';

// Helper function to ensure base URL includes /api prefix
function ensureApiPrefix(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, ''); // Remove trailing slashes
  if (!trimmed.endsWith('/api')) {
    return `${trimmed}/api`;
  }
  return trimmed;
}

const SSO_BASE_URL: string = resolveSSOBaseUrl();

const REFRESH_INTERVAL = 4 * 60 * 1000; // Check every 4 minutes
const REFRESH_THRESHOLD = 5 * 60 * 1000; // Refresh if expires in less than 5 minutes

let refreshIntervalId: ReturnType<typeof setInterval> | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const maskToken = (token?: string | null): string => {
  if (!token) return '<none>';
  if (token.length <= 12) return token;
  return `${token.slice(0, 6)}…${token.slice(-6)}`;
};

/**
 * Refresh access token using refresh token
 * Uses axios directly to avoid circular dependencies
 */
async function refreshAccessToken(): Promise<string | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = await secureTokenStorage.getRefreshToken();
  if (!refreshToken) {
    console.warn('[Token Refresh] No refresh token available');
    return null;
  }

  // Validate refresh token format (should be a non-empty string)
  if (typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
    console.error('[Token Refresh] Invalid refresh token format');
    return null;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      console.log('[Token Refresh] Attempting to refresh token...');
      console.log(
        '[Token Refresh] Using refresh token (masked):',
        maskToken(refreshToken),
      );

      // Create a separate axios instance for refresh to avoid interceptors
      // This prevents circular refresh attempts if the refresh endpoint requires auth
      // Use dynamic import to avoid circular dependencies
      const refreshAxios = (await import('axios')).default.create({
        headers: {
          'Content-Type': 'application/json',
        },
        // Don't use credentials to avoid cookie conflicts
        withCredentials: false,
      });

      const response = await refreshAxios.post(`${SSO_BASE_URL}/auth/refresh`, {
        refreshToken,
        productCode: 'accounts', // Default product code, can be overridden
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data as {
        accessToken: string;
        refreshToken?: string;
      };

      if (!accessToken) {
        console.error('[Token Refresh] No access token in response');
        return null;
      }

      console.log('[Token Refresh] Token refreshed successfully');

      // Decode the new token to extract fresh user data (especially role)
      let updatedUser = await secureTokenStorage.getUser();
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1])) as {
          sub?: string;
          email?: string;
          role?: string;
          tenantId?: string | null;
          firstName?: string;
          lastName?: string;
        };

        // Update user data from the new token to ensure role and other info are current
        if (payload.sub && payload.email && payload.role) {
          updatedUser = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            tenantId: payload.tenantId ?? null,
            firstName: payload.firstName ?? updatedUser?.firstName,
            lastName: payload.lastName ?? updatedUser?.lastName,
          };
        }
      } catch (decodeError) {
        console.warn(
          '[Token Refresh] Failed to decode token payload, using existing user data:',
          decodeError,
        );
        // If decoding fails, use existing user data
        if (!updatedUser) {
          updatedUser = await secureTokenStorage.getUser();
        }
      }

      // Update tokens securely with fresh user data (this will sync to cookies automatically)
      await secureTokenStorage.setTokens(
        accessToken,
        newRefreshToken,
        updatedUser ?? undefined,
      );

      // Broadcast token refresh event to other tabs/windows
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          'icaptur_token_refresh',
          JSON.stringify({ timestamp: Date.now(), accessToken }),
        );
        // Remove immediately to trigger storage event
        window.localStorage.removeItem('icaptur_token_refresh');
      }

      return accessToken;
    } catch (error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: unknown;
        };
        message?: string;
      };

      console.error('[Token Refresh] Failed:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
        refreshToken: maskToken(refreshToken),
      });

      // Only clear tokens if refresh token is invalid/expired (401 or 403)
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        console.warn(
          '[Token Refresh] Refresh token invalid/expired, logging out user',
        );

        // Clear tokens immediately
        secureTokenStorage.clearTokens();

        // Broadcast logout event to all tabs (this will trigger logout in all apps)
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(
            'icaptur_logout',
            JSON.stringify({ timestamp: Date.now() }),
          );
          window.localStorage.removeItem('icaptur_logout');
        }

        // Redirect current tab to SSO login
        if (typeof window !== 'undefined') {
          // Resolve SSO App URL (function is defined later but hoisted)
          let ssoAppUrl = '';
          if (typeof window !== 'undefined') {
            const win = window as typeof window & { __SSO_APP_URL__?: string };
            if (win.__SSO_APP_URL__) {
              ssoAppUrl = win.__SSO_APP_URL__;
            } else {
              ssoAppUrl =
                (import.meta.env?.VITE_SSO_APP_URL as string | undefined) ?? '';
            }
          }
          if (ssoAppUrl) {
            const theme = localStorage.getItem('icaptur-theme') || 'system';
            window.location.href = `${ssoAppUrl}/signin?logout=true&theme=${theme}`;
          }
        }
      }

      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Check if token needs refresh and refresh if needed
 */
async function checkAndRefreshToken(): Promise<string | null> {
  const token = await secureTokenStorage.getAccessToken();
  const refreshToken = await secureTokenStorage.getRefreshToken();

  if (!token || !refreshToken) {
    return token;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as {
      exp?: number;
    };
    const exp = payload.exp ? payload.exp * 1000 : 0;
    const now = Date.now();
    const timeUntilExpiry = exp - now;

    // Refresh if token expires in less than 5 minutes or is already expired
    if (timeUntilExpiry < REFRESH_THRESHOLD) {
      return await refreshAccessToken();
    }
  } catch {
    // Invalid token format - try to refresh if we have refresh token
    if (refreshToken) {
      return await refreshAccessToken();
    }
  }

  return token;
}

/**
 * Start proactive token refresh mechanism
 * This will check and refresh tokens periodically
 */
export function startTokenRefresh(): () => void {
  // Clear any existing interval
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
  }

  // Don't check immediately - wait a bit to avoid race conditions after login
  // The AuthGuard will handle initial token validation
  // Set up interval to check every 4 minutes
  refreshIntervalId = setInterval(() => {
    void checkAndRefreshToken();
  }, REFRESH_INTERVAL);

  // Return cleanup function
  return () => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      refreshIntervalId = null;
    }
  };
}

/**
 * Stop proactive token refresh
 */
export function stopTokenRefresh(): void {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

/**
 * Setup cross-tab synchronization
 * Listens for token refresh and logout events from other tabs
 */
export function setupCrossTabSync(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorageEvent = async (e: StorageEvent) => {
    // Handle token refresh from other tabs
    if (e.key === 'icaptur_token_refresh' && e.newValue) {
      try {
        // Parse refresh data to validate it's valid JSON (even if we don't use all fields)
        JSON.parse(e.newValue) as {
          timestamp?: number;
          accessToken?: string;
        };

        // Token was refreshed in another tab, update our local state
        // The cookie is already updated, so we just need to refresh our in-memory state
        const newToken = await secureTokenStorage.getAccessToken(); // This will read from cookie

        // If we have the new token, decode it and update user data
        if (newToken) {
          try {
            const payload = JSON.parse(atob(newToken.split('.')[1])) as {
              sub?: string;
              email?: string;
              role?: string;
              tenantId?: string | null;
              firstName?: string;
              lastName?: string;
            };

            // Update user data from the new token to ensure role and other info are current
            if (payload.sub && payload.email && payload.role) {
              const updatedUser = {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                tenantId: payload.tenantId ?? null,
                firstName: payload.firstName,
                lastName: payload.lastName,
              };

              // Get refresh token and update both tokens with fresh user data
              const refreshToken = await secureTokenStorage.getRefreshToken();
              await secureTokenStorage.setTokens(
                newToken,
                refreshToken ?? undefined,
                updatedUser,
              );
            }
          } catch (decodeError) {
            console.warn(
              '[Cross-Tab Sync] Failed to decode token payload:',
              decodeError,
            );
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    // Handle logout from other tabs
    if (e.key === 'icaptur_logout' && e.newValue) {
      secureTokenStorage.clearTokens();
      // Redirect to SSO login
      const SSO_APP_URL = resolveSSOAppUrl();
      const theme = localStorage.getItem('icaptur-theme') || 'system';
      window.location.href = `${SSO_APP_URL}/signin?logout=true&theme=${theme}`;
    }
  };

  window.addEventListener('storage', handleStorageEvent);

  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageEvent);
  };
}

/**
 * Centralized logout - clears tokens and broadcasts to all tabs
 */
export async function centralizedLogout(): Promise<void> {
  const refreshToken = await secureTokenStorage.getRefreshToken();

  // Try to revoke refresh token on SSO API
  if (refreshToken) {
    try {
      const axios = (await import('axios')).default;
      const SSO_BASE_URL_LOCAL = resolveSSOBaseUrl();

      await axios.post(
        `${SSO_BASE_URL_LOCAL}/auth/logout`,
        {
          refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.warn('Failed to revoke refresh token on SSO API:', error);
    }
  }

  // Clear local tokens aggressively
  try {
    const { forceClearAuthStorage } =
      await import('../utils/secureTokenStorage');
    forceClearAuthStorage();
  } catch {
    secureTokenStorage.clearTokens();
  }

  // Broadcast logout event to all tabs
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(
      'icaptur_logout',
      JSON.stringify({ timestamp: Date.now() }),
    );
    window.localStorage.removeItem('icaptur_logout');
  }

  // Redirect to SSO
  const SSO_APP_URL = resolveSSOAppUrl();
  const theme = typeof window !== 'undefined' ? (localStorage.getItem('icaptur-theme') || 'system') : 'system';
  window.location.href = `${SSO_APP_URL}/signin?logout=true&theme=${theme}`;
}

/**
 * Resolve SSO App URL without relying on import.meta.env
 * Priority:
 * 1. window.__SSO_APP_URL__ (set by host app at runtime)
 * 2. fallback to localhost dev URL
 */
function resolveSSOAppUrl(): string {
  if (typeof window !== 'undefined') {
    const win = window as typeof window & { __SSO_APP_URL__?: string };
    if (win.__SSO_APP_URL__) return win.__SSO_APP_URL__;
  }
  return (import.meta.env?.VITE_SSO_APP_URL as string | undefined) ?? '';
}

/**
 * Resolve SSO API Base URL without relying on import.meta.env
 * Priority:
 * 1. window.__SSO_BASE_URL__ (set by host app at runtime)
 * 2. fallback to localhost dev API URL
 */
function resolveSSOBaseUrl(): string {
  let baseUrl = (import.meta.env?.VITE_SSO_API_URL as string | undefined) ?? '';
  if (typeof window !== 'undefined') {
    const win = window as typeof window & { __SSO_BASE_URL__?: string };
    if (win.__SSO_BASE_URL__) {
      baseUrl = win.__SSO_BASE_URL__;
    }
  }
  return ensureApiPrefix(baseUrl);
}

/**
 * Get access token, refreshing if needed
 * This is the main function products should use
 */
export async function getAccessToken(
  forceRefresh = false,
): Promise<string | null> {
  if (forceRefresh) {
    return await refreshAccessToken();
  }
  return await checkAndRefreshToken();
}

/**
 * Initialize centralized token refresh system
 * Call this once when your app starts
 */
export function initializeTokenRefresh(): () => void {
  const stopRefresh = startTokenRefresh();
  const stopSync = setupCrossTabSync();

  return () => {
    stopRefresh();
    stopSync();
  };
}
