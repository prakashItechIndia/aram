/**
 * Performance utilities for React components
 */
import { useMemo, useCallback } from 'react';
/**
 * Memoize expensive computations
 * Wrapper around useMemo with better defaults
 */
export function useMemoized(factory, deps) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(factory, deps);
}
/**
 * Memoize callback functions
 * Wrapper around useCallback with better defaults
 */
export function useMemoizedCallback(callback, deps) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(callback, deps);
}
/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
/**
 * Throttle function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}
/**
 * Lazy load component with error boundary
 */
export function lazyLoad(importFunc) {
    const FallbackComponent = () => React.createElement('div', null, 'Failed to load component. Please refresh the page.');
    return React.lazy(() => importFunc().catch((error) => {
        console.error('Failed to load component:', error);
        // Return a fallback component
        return {
            default: FallbackComponent,
        };
    }));
}
/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName) {
    React.useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const startTime = performance.now();
            return () => {
                const endTime = performance.now();
                const renderTime = endTime - startTime;
                if (renderTime > 100) {
                    console.warn(`[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render`);
                }
            };
        }
    }, [componentName]);
}
import React from 'react';
