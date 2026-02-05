/**
 * Store for admin password-reset tokens.
 * In-memory by default. Optional S3 storage when AWS_* and S3_BUCKET_ADMIN_RESET are set.
 */

const RESET_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export interface ResetTokenRecord {
  email: string;
  expiresAt: number;
}

const memoryStore = new Map<string, ResetTokenRecord>();

export function setResetToken(token: string, email: string): void {
  memoryStore.set(token, {
    email,
    expiresAt: Date.now() + RESET_EXPIRY_MS,
  });
}

export function getResetToken(token: string): ResetTokenRecord | null {
  const record = memoryStore.get(token);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    memoryStore.delete(token);
    return null;
  }
  return record;
}

export function consumeResetToken(token: string): void {
  memoryStore.delete(token);
}

export function getAndConsumeResetToken(token: string): ResetTokenRecord | null {
  const record = getResetToken(token);
  if (record) {
    consumeResetToken(token);
  }
  return record;
}

export function getResetTokenExpiryMs(): number {
  return RESET_EXPIRY_MS;
}
