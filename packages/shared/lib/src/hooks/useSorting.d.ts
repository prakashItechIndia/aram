import type { SortingState } from '@tanstack/react-table';
type SortingUpdater = SortingState | ((old: SortingState) => SortingState);
/**
 * Lightweight wrapper around TanStack's sorting state that exposes a
 * stable change handler compatible with DataTable + React Table APIs.
 */
export declare const useSorting: (initialSorting?: SortingState) => {
    sorting: SortingState;
    onSortingChange: (updater: SortingUpdater) => void;
};
export {};
//# sourceMappingURL=useSorting.d.ts.map