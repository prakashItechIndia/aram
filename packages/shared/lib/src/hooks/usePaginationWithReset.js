import { useCallback, useEffect, useState } from 'react';
/**
 * Shared pagination helper that automatically resets to page 0 whenever
 * the provided dependency list changes (e.g. filters/search inputs).
 */
export const usePaginationWithReset = (initialLimit = 10, resetDeps = []) => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: initialLimit,
    });
    // Keep the page size in sync with the latest limit
    useEffect(() => {
        setPagination((prev) => prev.pageSize === initialLimit
            ? prev
            : { ...prev, pageSize: initialLimit });
    }, [initialLimit]);
    // Reset the page index when filters/search values change
    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        // eslint-disable-next-line react-hooks/exhaustive-deps -- caller provides the dependency list
    }, resetDeps);
    const onPaginationChange = useCallback((updater) => {
        setPagination((prev) => {
            if (typeof updater === 'number') {
                return { ...prev, pageIndex: Math.max(0, updater) };
            }
            if (typeof updater === 'function') {
                return updater(prev);
            }
            return updater;
        });
    }, []);
    const setLimit = useCallback((newLimit) => {
        setPagination((prev) => ({
            ...prev,
            pageSize: newLimit,
            pageIndex: 0, // Reset to first page when changing page size
        }));
    }, []);
    return {
        limit: pagination.pageSize,
        page: pagination.pageIndex,
        pagination,
        onPaginationChange,
        setLimit,
    };
};
