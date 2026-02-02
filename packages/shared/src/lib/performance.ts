/**
 * Performance utilities for React components
 */

import { useMemo, useCallback, type DependencyList } from 'react';

/**
 * Memoize expensive computations
 * Wrapper around useMemo with better defaults
 */
export function useMemoized<T>(factory: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

/**
 * Memoize callback functions
 * Wrapper around useCallback with better defaults
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList,
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps) as T;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
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
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
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
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
  const FallbackComponent = () =>
    React.createElement(
      'div',
      null,
      'Failed to load component. Please refresh the page.',
    );

  return React.lazy(() =>
    importFunc().catch((error) => {
      console.error('Failed to load component:', error);
      // Return a fallback component
      return {
        default: FallbackComponent as unknown as T,
      };
    }),
  );
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        if (renderTime > 100) {
          console.warn(
            `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render`,
          );
        }
      };
    }
  }, [componentName]);
}

import React from 'react';
