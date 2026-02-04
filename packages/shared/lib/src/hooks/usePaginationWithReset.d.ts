import { type DependencyList } from 'react';
import type { PaginationState } from '@tanstack/react-table';
type PaginationUpdater = number | PaginationState | ((old: PaginationState) => PaginationState);
/**
 * Shared pagination helper that automatically resets to page 0 whenever
 * the provided dependency list changes (e.g. filters/search inputs).
 */
export declare const usePaginationWithReset: (initialLimit?: number, resetDeps?: DependencyList) => {
    limit: number;
    page: number;
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationUpdater) => void;
    setLimit: (newLimit: number) => void;
};
export {};
//# sourceMappingURL=usePaginationWithReset.d.ts.map