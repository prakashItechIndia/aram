/**
 * Secure Token Storage with Encryption + Cookie Sync
 * Tokens are encrypted with Web Crypto API before being stored.
 * Values are mirrored to cookies so multiple apps on the same domain
 * (but different ports) stay in sync for login/logout.
 */

const ACCESS_TOKEN_KEY = 'icaptur_access_token';
const REFRESH_TOKEN_KEY = 'icaptur_refresh_token';
const USER_KEY = 'icaptur_user';
const ENCRYPTION_KEY_NAME = 'icaptur_encryption_key';
const AUTH_KEYS = [
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  ENCRYPTION_KEY_NAME,
];
const SHARED_SALT_NAMESPACE = 'icaptur-auth-shared';
const LEGACY_SALT_NAMESPACES = ['icaptur-experience', 'icaptur-sso'];

const isBrowser = typeof window !== 'undefined';

/**
 * Get the cookie domain for cross-subdomain SSO
 * Returns domain like ".icaptur.ai" for production, or null for localhost
 */
const getCookieDomain = (): string | null => {
  if (!isBrowser) return null;
  const hostname = window.location.hostname;
  
  // Don't set domain for localhost (cookies work without domain attribute)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }
  
  // For production domains, extract the root domain
  // e.g., invox.icaptur.ai -> .icaptur.ai
  // e.g., sso-dev.itechlabs.app -> .itechlabs.app
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    // Get the last two parts (e.g., "icaptur.ai" or "itechlabs.app")
    const rootDomain = parts.slice(-2).join('.');
    return `.${rootDomain}`;
  }
  
  return null;
};

const getCookieAttributes = (extra?: string) => {
  if (!isBrowser) return '';
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? 'Secure; ' : '';
  const domain = getCookieDomain();
  const domainAttr = domain ? `Domain=${domain}; ` : '';
  return `${secureFlag}${domainAttr}SameSite=Lax; Path=/; ${extra ?? ''}`;
};

const setCookie = (
  name: string,
  value: string,
  persistent: boolean = true,
) => {
  if (!isBrowser) return;
  // If persistent (rememberMe=true), set Max-Age for 30 days
  // If not persistent (rememberMe=false), set as session cookie (no Max-Age)
  const maxAgeAttr = persistent
    ? `Max-Age=${60 * 60 * 24 * 30};`
    : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; ${getCookieAttributes(maxAgeAttr)}`;
};

const getCookie = (name: string): string | null => {
  if (!isBrowser) return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const deleteCookie = (name: string) => {
  if (!isBrowser) return;
  // Delete cookie with domain attribute to ensure it's removed across all subdomains
  document.cookie = `${name}=; ${getCookieAttributes('Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;')}`;
};

const getRawStoredValue = (key: string): string | null => {
  if (!isBrowser) return null;
  // Check localStorage first (for persistent storage)
  const fromLocalStorage = localStorage.getItem(key);
  if (fromLocalStorage) {
    return fromLocalStorage;
  }
  // Check sessionStorage (for session-only storage)
  const fromSessionStorage = sessionStorage.getItem(key);
  if (fromSessionStorage) {
    return fromSessionStorage;
  }
  // Fallback to cookie
  return getCookie(key);
};

const cacheEncryptedValue = (key: string, value: string, persistent: boolean = true) => {
  if (!isBrowser) return;
  if (persistent) {
    // Store in localStorage for persistent storage
    localStorage.setItem(key, value);
  } else {
    // Store in sessionStorage for session-only storage
    sessionStorage.setItem(key, value);
    // Also clear from localStorage if it exists (in case user toggled rememberMe)
    localStorage.removeItem(key);
  }
  // Always sync to cookie for cross-app compatibility
  setCookie(key, value, persistent);
};

/**
 * Force remove all auth-related storage (tokens + encryption key) from
 * localStorage, sessionStorage, and cookies. This is a defensive cleanup to
 * ensure logout succeeds even if some storage locations were missed.
 */
export const forceClearAuthStorage = () => {
  if (!isBrowser) return;
  try {
    AUTH_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      deleteCookie(key);
    });
  } catch {
    // ignore storage errors
  }

  // Sweep any stray icaptur_* cookies that might not be in the known list
  try {
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0]?.trim();
      if (name && name.startsWith('icaptur_')) {
        deleteCookie(name);
      }
    });
  } catch {
    // ignore cookie parsing errors
  }
};

const persistEncryptionKeyData = (data: string) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(ENCRYPTION_KEY_NAME, data);
  } catch {
    // ignore quota errors
  }
  try {
    setCookie(ENCRYPTION_KEY_NAME, data, true);
  } catch {
    // ignore cookie errors
  }
};

const readEncryptionKeyData = (): string | null => {
  if (!isBrowser) return null;
  const fromLocalStorage = localStorage.getItem(ENCRYPTION_KEY_NAME);
  if (fromLocalStorage) {
    return fromLocalStorage;
  }
  return getCookie(ENCRYPTION_KEY_NAME);
};

async function deriveEncryptionKey(
  namespace = SHARED_SALT_NAMESPACE,
): Promise<CryptoKey> {
  if (!isBrowser) {
    throw new Error('Encryption not available on server');
  }

  const domain = window.location.hostname;
  const salt = new TextEncoder().encode(`${namespace}-${domain}`);

  let masterKeyMaterial: CryptoKey | null = null;

  try {
    const storedKeyData = readEncryptionKeyData();

    if (storedKeyData) {
      const keyData = JSON.parse(storedKeyData) as number[];
      masterKeyMaterial = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(keyData),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey'],
      );
    } else {
      const keyMaterial = new TextEncoder().encode(
        `${navigator.userAgent}-${domain}-${Date.now()}`,
      );
      masterKeyMaterial = await crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey'],
      );

      const keyHash = await crypto.subtle.digest('SHA-256', keyMaterial);
      persistEncryptionKeyData(
        JSON.stringify(Array.from(new Uint8Array(keyHash))),
      );
    }
  } catch {
    const keyMaterial = new TextEncoder().encode(`${domain}-icaptur-secret`);
    masterKeyMaterial = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey'],
    );
  }

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    masterKeyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encrypt(plaintext: string): Promise<string> {
  if (!isBrowser) return plaintext;
  try {
    const key = await deriveEncryptionKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data,
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    return plaintext;
  }
}

async function decrypt(ciphertext: string): Promise<string> {
  if (!isBrowser) return ciphertext;
  const namespaces = [SHARED_SALT_NAMESPACE, ...LEGACY_SALT_NAMESPACES];

  for (const namespace of namespaces) {
    try {
      const key = await deriveEncryptionKey(namespace);
      const combined = Uint8Array.from(atob(ciphertext), (c) =>
        c.charCodeAt(0),
      );
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        encrypted,
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch {
      // try next namespace
    }
  }

  console.error('Decryption error: unable to decode token with any namespace');
  return ciphertext;
}

export interface StoredUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  tenantId?: string | null;
}

const isEncryptedString = (value: string) =>
  value.length > 50 && !value.includes('.');

const usersEqual = (a?: StoredUser | null, b?: StoredUser | null) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.id === b.id &&
    a.email === b.email &&
    a.firstName === b.firstName &&
    a.lastName === b.lastName &&
    a.role === b.role &&
    a.tenantId === b.tenantId
  );
};

const getDecryptedValue = async (
  stored: string | null,
): Promise<string | null> => {
  if (!stored) return null;
  try {
    if (isEncryptedString(stored)) {
      return await decrypt(stored);
    }
    return stored;
  } catch {
    return null;
  }
};

export const secureTokenStorage = {
  async getAccessToken(): Promise<string | null> {
    if (!isBrowser) return null;
    const stored = getRawStoredValue(ACCESS_TOKEN_KEY);
    return getDecryptedValue(stored);
  },

  async getRefreshToken(): Promise<string | null> {
    if (!isBrowser) return null;
    const stored = getRawStoredValue(REFRESH_TOKEN_KEY);
    return getDecryptedValue(stored);
  },

  async getUser(): Promise<StoredUser | null> {
    if (!isBrowser) return null;
    const stored = getRawStoredValue(USER_KEY);
    if (!stored) return null;

    try {
      const payload = stored.startsWith('{') ? stored : await decrypt(stored);
      return JSON.parse(payload) as StoredUser;
    } catch {
      return null;
    }
  },

  async setTokens(
    accessToken: string,
    refreshToken?: string,
    user?: StoredUser,
    rememberMe: boolean = true,
  ): Promise<void> {
    if (!isBrowser) return;

    // Avoid unnecessary rewrites (which change encrypted values and spam storage)
    try {
      const existingAccess = await this.getAccessToken();
      const existingRefresh = await this.getRefreshToken();
      const existingUser = await this.getUser();

      if (
        accessToken === existingAccess &&
        (refreshToken === undefined || refreshToken === existingRefresh) &&
        (user === undefined || usersEqual(user, existingUser))
      ) {
        return;
      }
    } catch {
      // If any check fails, fall through to write
    }

    try {
      const encryptedAccessToken = await encrypt(accessToken);
      cacheEncryptedValue(ACCESS_TOKEN_KEY, encryptedAccessToken, rememberMe);

      if (refreshToken) {
        const encryptedRefreshToken = await encrypt(refreshToken);
        cacheEncryptedValue(REFRESH_TOKEN_KEY, encryptedRefreshToken, rememberMe);
      }

      if (user) {
        const encryptedUser = await encrypt(JSON.stringify(user));
        cacheEncryptedValue(USER_KEY, encryptedUser, rememberMe);
      }
    } catch (error) {
      console.error('Failed to encrypt tokens:', error);
      cacheEncryptedValue(ACCESS_TOKEN_KEY, accessToken, rememberMe);
      if (refreshToken) {
        cacheEncryptedValue(REFRESH_TOKEN_KEY, refreshToken, rememberMe);
      }
      if (user) {
        cacheEncryptedValue(USER_KEY, JSON.stringify(user), rememberMe);
      }
    }
  },

  clearTokens(): void {
    if (!isBrowser) return;
    forceClearAuthStorage();
  },

  async hasValidToken(): Promise<boolean> {
    const token = await this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
      const exp = (payload.exp ?? 0) * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  },

  hasStoredToken(): boolean {
    if (!isBrowser) return false;
    return Boolean(getRawStoredValue(ACCESS_TOKEN_KEY));
  },
};

export type SecureTokenStorage = typeof secureTokenStorage;
