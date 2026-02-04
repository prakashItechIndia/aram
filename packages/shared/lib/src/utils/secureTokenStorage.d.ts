/**
 * Secure Token Storage with Encryption + Cookie Sync
 * Tokens are encrypted with Web Crypto API before being stored.
 * Values are mirrored to cookies so multiple apps on the same domain
 * (but different ports) stay in sync for login/logout.
 */
/**
 * Force remove all auth-related storage (tokens + encryption key) from
 * localStorage, sessionStorage, and cookies. This is a defensive cleanup to
 * ensure logout succeeds even if some storage locations were missed.
 */
export declare const forceClearAuthStorage: () => void;
export interface StoredUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    tenantId?: string | null;
}
export declare const secureTokenStorage: {
    getAccessToken(): Promise<string | null>;
    getRefreshToken(): Promise<string | null>;
    getUser(): Promise<StoredUser | null>;
    setTokens(accessToken: string, refreshToken?: string, user?: StoredUser, rememberMe?: boolean): Promise<void>;
    clearTokens(): void;
    hasValidToken(): Promise<boolean>;
    hasStoredToken(): boolean;
};
export type SecureTokenStorage = typeof secureTokenStorage;
//# sourceMappingURL=secureTokenStorage.d.ts.map