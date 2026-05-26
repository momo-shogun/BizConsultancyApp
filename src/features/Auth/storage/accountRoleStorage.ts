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

export async function clearPreferredAccountRole(): Promise<void> {
  await getStorage().removeItem(STORAGE_KEY);
}
