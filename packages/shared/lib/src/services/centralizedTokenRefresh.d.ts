/**
 * Centralized Token Refresh Service
 *
 * This service handles automatic token refresh across all products/apps
 * in the same browser. It uses:
 * - Shared cookie storage (already implemented in secureTokenStorage)
 * - Storage events for cross-tab synchronization
 * - Proactive refresh before token expiration
 *
 * All products should use this service instead of implementing their own refresh logic.
 */
/**
 * Start proactive token refresh mechanism
 * This will check and refresh tokens periodically
 */
export declare function startTokenRefresh(): () => void;
/**
 * Stop proactive token refresh
 */
export declare function stopTokenRefresh(): void;
/**
 * Setup cross-tab synchronization
 * Listens for token refresh and logout events from other tabs
 */
export declare function setupCrossTabSync(): () => void;
/**
 * Centralized logout - clears tokens and broadcasts to all tabs
 */
export declare function centralizedLogout(): Promise<void>;
/**
 * Get access token, refreshing if needed
 * This is the main function products should use
 */
export declare function getAccessToken(forceRefresh?: boolean): Promise<string | null>;
/**
 * Initialize centralized token refresh system
 * Call this once when your app starts
 */
export declare function initializeTokenRefresh(): () => void;
//# sourceMappingURL=centralizedTokenRefresh.d.ts.map