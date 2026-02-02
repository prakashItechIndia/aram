import { QueryClient } from '@tanstack/react-query';
/**
 * Default React Query configuration for optimal performance
 */
export const defaultQueryOptions = {
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
export function createQueryClient() {
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
        all: ['auth'],
        me: () => [...queryKeys.auth.all, 'me'],
        permissions: () => [...queryKeys.auth.all, 'permissions'],
    },
    // Users
    users: {
        all: ['users'],
        lists: () => [...queryKeys.users.all, 'list'],
        list: (filters) => [...queryKeys.users.lists(), filters],
        details: () => [...queryKeys.users.all, 'detail'],
        detail: (id) => [...queryKeys.users.details(), id],
    },
    // Products
    products: {
        all: ['products'],
        lists: () => [...queryKeys.products.all, 'list'],
        list: (filters) => [...queryKeys.products.lists(), filters],
        details: () => [...queryKeys.products.all, 'detail'],
        detail: (id) => [...queryKeys.products.details(), id],
    },
    // Billing
    billing: {
        all: ['billing'],
        summary: () => [...queryKeys.billing.all, 'summary'],
        subscriptions: () => [...queryKeys.billing.all, 'subscriptions'],
        invoices: (filters) => [...queryKeys.billing.all, 'invoices', filters],
    },
    // Dashboard
    dashboard: {
        all: ['dashboard'],
        data: () => [...queryKeys.dashboard.all, 'data'],
    },
};
