import MMKVStorage from 'react-native-mmkv-storage';

import type { AuthRole } from '@/features/Auth/types/authApi.types';

const STORAGE_KEY = 'auth.preferred_account_role';

let storage: ReturnType<MMKVStorage.Loader['initialize']> | null = null;

function getStorage(): ReturnType<MMKVStorage.Loader['initialize']> {
  if (storage == null) {
    storage = new MMKVStorage.Loader().initialize();
  }
  return storage;
}

function parseRole(raw: string | null | undefined): AuthRole | null {
  if (raw === 'user' || raw === 'consultant') {
    return raw;
  }
  return null;
}

/** Persists last chosen account role (User / Consultant) in MMKV. */
export async function persistPreferredAccountRole(role: AuthRole): Promise<void> {
  await getStorage().setStringAsync(STORAGE_KEY, role);
}

export async function loadPreferredAccountRole(): Promise<AuthRole | null> {
  const raw = await getStorage().getStringAsync(STORAGE_KEY);
  return parseRole(raw ?? undefined);
}

/**
 * Sync preferred-role read for headless FCM / Notifee wakes before Redux rehydrate.
 * Mirrors `readPersistedAuthTokenSync` — prefer this over defaulting to `'user'`.
 */
export function readPersistedAccountRoleSync(): AuthRole | null {
  try {
    const fromPreferred = parseRole(getStorage().getString(STORAGE_KEY) ?? undefined);
    if (fromPreferred != null) {
      return fromPreferred;
    }
    const rawRoot = getStorage().getString('persist:root');
    if (rawRoot == null || rawRoot.length === 0) {
      return null;
    }
    const outer = JSON.parse(rawRoot) as Record<string, unknown>;
    const authChunk = outer.auth;
    if (typeof authChunk !== 'string' || authChunk.length === 0) {
      return null;
    }
    const authState = JSON.parse(authChunk) as {
      accountRole?: unknown;
      preferredAccountRole?: unknown;
    };
    return (
      parseRole(typeof authState.accountRole === 'string' ? authState.accountRole : undefined) ??
      parseRole(
        typeof authState.preferredAccountRole === 'string'
          ? authState.preferredAccountRole
          : undefined,
      )
    );
  } catch {
    return null;
  }
}

export async function clearPreferredAccountRole(): Promise<void> {
  await getStorage().removeItem(STORAGE_KEY);
}
