import type { RootState } from '@/store';
import { isValidIndianMobile } from '@/utils/formatPhone';

import type { AuthRole } from '../types/authApi.types';
import type { AuthState, LoginSession } from './authTypes';

export const selectAuth = (state: RootState): AuthState => state.auth;

export const selectToken = (state: RootState): string | null => state.auth.token;

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;

export const selectIsGuestSession = (state: RootState): boolean => state.auth.isGuestSession;

/** True after OTP (or refresh); false for guest browse and logged-out. */
export const selectHasVerifiedLogin = (state: RootState): boolean => {
  const auth = state.auth;
  if (!auth.isAuthenticated || auth.isGuestSession) {
    return false;
  }
  const hasToken = auth.token != null && auth.token.length > 0;
  const hasMobile = auth.mobile != null && isValidIndianMobile(auth.mobile);
  return hasToken || hasMobile;
};

export const selectIsRestoringSession = (state: RootState): boolean =>
  state.auth.isRestoringSession;

export const selectRefreshToken = (state: RootState): string | null => state.auth.refreshToken;

export const selectLoginSession = (state: RootState): LoginSession | null => state.auth.loginSession;

export const selectLoggedInMobile = (state: RootState): string | null => state.auth.mobile;

export const selectDisplayName = (state: RootState): string | null => state.auth.displayName;

export const selectLoggedInEmail = (state: RootState): string | null => state.auth.email ?? null;

export const selectAccountRole = (state: RootState): AuthRole | null => state.auth.accountRole;

export const selectPreferredAccountRole = (state: RootState): AuthRole | null =>
  state.auth.preferredAccountRole;

/** Active or last-chosen role for auth UI (login/signup content). */
export const selectEffectiveAccountRole = (state: RootState): AuthRole | null =>
  state.auth.accountRole ?? state.auth.preferredAccountRole;

export function formatAccountRoleLabel(role: AuthRole | null | undefined): string {
  if (role === 'consultant') {
    return 'Consultant';
  }
  if (role === 'user') {
    return 'User';
  }
  return 'Member';
}
