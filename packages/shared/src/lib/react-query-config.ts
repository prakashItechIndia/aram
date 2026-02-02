import { QueryClient, DefaultOptions } from '@tanstack/react-query';

/**
 * Default React Query configuration for optimal performance
 */
export const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Keep data warm longer to avoid repeated network calls while navigating
    gcTime: 30 * 60 * 1000, // 30 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    // Avoid surprise refetches that cause jitter/rerenders when returning to a tab
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false, // if data exists in cache, don't refetch on mount
    // Conservative retries to reduce backend load
    retry: 1,
    retryDelay: 1500,
  },
  mutations: {
    // Retry mutations once
    retry: 1,
    // Retry delay for mutations
    retryDelay: 1000,
  },
};

/**
 * Create optimized QueryClient instance
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: defaultQueryOptions,
  });
}

/**
 * Query keys factory for consistent cache key management
 */
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    permissions: () => [...queryKeys.auth.all, 'permissions'] as const,
  },
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  // Billing
  billing: {
    all: ['billing'] as const,
    summary: () => [...queryKeys.billing.all, 'summary'] as const,
    subscriptions: () => [...queryKeys.billing.all, 'subscriptions'] as const,
    invoices: (filters?: Record<string, any>) =>
      [...queryKeys.billing.all, 'invoices', filters] as const,
  },
  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    data: () => [...queryKeys.dashboard.all, 'data'] as const,
  },
} as const;
