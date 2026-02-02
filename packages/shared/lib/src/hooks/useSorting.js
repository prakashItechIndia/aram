import { useCallback, useState } from 'react';
/**
 * Lightweight wrapper around TanStack's sorting state that exposes a
 * stable change handler compatible with DataTable + React Table APIs.
 */
export const useSorting = (initialSorting = []) => {
    const [sorting, setSorting] = useState(initialSorting);
    const onSortingChange = useCallback((updater) => {
        setSorting((prev) => typeof updater === 'function' ? updater(prev) : updater);
    }, []);
    return { sorting, onSortingChange };
};
