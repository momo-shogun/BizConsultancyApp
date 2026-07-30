import { readPersistedAccountRoleSync } from '@/features/Auth/storage/accountRoleStorage';
import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { store } from '@/store';

import type { CallRole } from '../types/callApi.types';

function asCallRole(role: AuthRole | CallRole | null | undefined): CallRole | null {
  if (role === 'consultant' || role === 'user') {
    return role;
  }
  return null;
}

/**
 * Resolve the local account role for incoming-call gating.
 * Headless isolates often run before Redux REHYDRATE — never default consultants to `'user'`.
 * When unknown, returns null so callers can trust push targeting (`payload.calleeRole`).
 */
export function resolveLocalCallRole(): CallRole | null {
  const auth = store.getState().auth;
  const fromStore =
    asCallRole(auth?.accountRole ?? undefined) ?? asCallRole(auth?.preferredAccountRole ?? undefined);
  if (fromStore != null) {
    return fromStore;
  }
  return asCallRole(readPersistedAccountRoleSync());
}
