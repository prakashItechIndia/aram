import { useCallback, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';

type SortingUpdater = SortingState | ((old: SortingState) => SortingState);

/**
 * Lightweight wrapper around TanStack's sorting state that exposes a
 * stable change handler compatible with DataTable + React Table APIs.
 */
export const useSorting = (initialSorting: SortingState = []) => {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const onSortingChange = useCallback((updater: SortingUpdater) => {
    setSorting((prev) =>
      typeof updater === 'function' ? updater(prev) : updater,
    );
  }, []);

  return { sorting, onSortingChange };
};
