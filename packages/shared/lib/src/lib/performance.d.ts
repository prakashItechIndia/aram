/**
 * Performance utilities for React components
 */
import { type DependencyList } from 'react';
/**
 * Memoize expensive computations
 * Wrapper around useMemo with better defaults
 */
export declare function useMemoized<T>(factory: () => T, deps: DependencyList): T;
/**
 * Memoize callback functions
 * Wrapper around useCallback with better defaults
 */
export declare function useMemoizedCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
/**
 * Debounce function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Lazy load component with error boundary
 */
export declare function lazyLoad<T extends React.ComponentType<any>>(importFunc: () => Promise<{
    default: T;
}>): React.LazyExoticComponent<T>;
/**
 * Performance monitoring hook
 */
export declare function usePerformanceMonitor(componentName: string): void;
import React from 'react';
//# sourceMappingURL=performance.d.ts.map