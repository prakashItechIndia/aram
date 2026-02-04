import { QueryClient, DefaultOptions } from '@tanstack/react-query';
/**
 * Default React Query configuration for optimal performance
 */
export declare const defaultQueryOptions: DefaultOptions;
/**
 * Create optimized QueryClient instance
 */
export declare function createQueryClient(): QueryClient;
/**
 * Query keys factory for consistent cache key management
 */
export declare const queryKeys: {
    readonly auth: {
        readonly all: readonly ["auth"];
        readonly me: () => readonly ["auth", "me"];
        readonly permissions: () => readonly ["auth", "permissions"];
    };
    readonly users: {
        readonly all: readonly ["users"];
        readonly lists: () => readonly ["users", "list"];
        readonly list: (filters: Record<string, any>) => readonly ["users", "list", Record<string, any>];
        readonly details: () => readonly ["users", "detail"];
        readonly detail: (id: string) => readonly ["users", "detail", string];
    };
    readonly products: {
        readonly all: readonly ["products"];
        readonly lists: () => readonly ["products", "list"];
        readonly list: (filters: Record<string, any>) => readonly ["products", "list", Record<string, any>];
        readonly details: () => readonly ["products", "detail"];
        readonly detail: (id: string) => readonly ["products", "detail", string];
    };
    readonly billing: {
        readonly all: readonly ["billing"];
        readonly summary: () => readonly ["billing", "summary"];
        readonly subscriptions: () => readonly ["billing", "subscriptions"];
        readonly invoices: (filters?: Record<string, any>) => readonly ["billing", "invoices", Record<string, any> | undefined];
    };
    readonly dashboard: {
        readonly all: readonly ["dashboard"];
        readonly data: () => readonly ["dashboard", "data"];
    };
};
//# sourceMappingURL=react-query-config.d.ts.map