import type { AuthRole } from '../types/authApi.types';
import type { AuthSessionPayload } from '../store/authTypes';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeRole(value: unknown): AuthRole | null {
  if (value === 'user' || value === 'consultant') {
    return value;
  }
  return null;
}

function resolveExpiresAtMs(expiresInSeconds: number | null): number | null {
  if (expiresInSeconds == null || expiresInSeconds <= 0) {
    return null;
  }
  return Date.now() + expiresInSeconds * 1000;
}

function readJwtExpiryMs(token: string): number | null {
  const segments = token.split('.');
  if (segments.length < 2) {
    return null;
  }

  try {
    const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decode =
      typeof globalThis.atob === 'function'
        ? globalThis.atob
        : null;
    if (decode == null) {
      return null;
    }
    const payload = JSON.parse(decode(padded)) as { exp?: unknown };
    const exp = readNumber(payload.exp);
    return exp != null && exp > 0 ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function readAccessToken(...sources: Record<string, unknown>[]): string | null {
  for (const source of sources) {
    const token =
      readString(source.accessToken) ??
      readString(source.access_token) ??
      readString(source.token);
    if (token != null) {
      return token;
    }
  }
  return null;
}

function readRefreshToken(...sources: Record<string, unknown>[]): string | null {
  for (const source of sources) {
    const token =
      readString(source.refreshToken) ?? readString(source.refresh_token);
    if (token != null) {
      return token;
    }
  }
  return null;
}

function readExpiresIn(...sources: Record<string, unknown>[]): number | null {
  for (const source of sources) {
    const expires =
      readNumber(source.expiresIn) ?? readNumber(source.expires_in);
    if (expires != null) {
      return expires;
    }
  }
  return null;
}

/**
 * Maps verify-otp / refresh-token API payloads into persisted session fields.
 */
export function parseAuthSessionPayload(
  raw: unknown,
  fallback: { mobile: string; role: AuthRole },
): AuthSessionPayload | null {
  if (!isRecord(raw)) {
    return null;
  }

  const nested = isRecord(raw.data) ? raw.data : raw;
  const auth = isRecord(nested.auth) ? nested.auth : isRecord(raw.auth) ? raw.auth : null;

  if (nested.valid === false || raw.valid === false) {
    return null;
  }

  const accessToken = readAccessToken(
    ...(auth != null ? [auth] : []),
    nested,
    raw,
  );

  const refreshToken = readRefreshToken(
    ...(auth != null ? [auth] : []),
    nested,
    raw,
  );

  const expiresIn = readExpiresIn(
    ...(auth != null ? [auth] : []),
    nested,
    raw,
  );

  const userRecord =
    (auth != null && isRecord(auth.user) ? auth.user : null) ??
    (isRecord(nested.user) ? nested.user : null) ??
    (isRecord(raw.user) ? raw.user : null);

  const userId =
    userRecord != null
      ? String(userRecord.id ?? '')
      : readString(nested.userId) ?? readString(raw.userId) ?? '';

  const displayName =
    userRecord != null ? readString(userRecord.name) : readString(nested.displayName);

  const mobile =
    (userRecord != null ? readString(userRecord.mobile) : null) ??
    readString(nested.mobile) ??
    fallback.mobile;

  const accountRole =
    normalizeRole(userRecord?.userType) ??
    normalizeRole(nested.role) ??
    normalizeRole(raw.role) ??
    fallback.role;

  if (accessToken == null) {
    return null;
  }

  const tokenExpiresAt =
    resolveExpiresAtMs(expiresIn) ?? readJwtExpiryMs(accessToken);

  return {
    accessToken,
    refreshToken,
    tokenExpiresAt,
    userId: userId.length > 0 ? userId : mobile,
    displayName,
    mobile,
    accountRole,
  };
}

export function isTokenExpired(tokenExpiresAt: number | null | undefined): boolean {
  if (tokenExpiresAt == null || tokenExpiresAt <= 0) {
    return false;
  }
  return Date.now() >= tokenExpiresAt;
}
