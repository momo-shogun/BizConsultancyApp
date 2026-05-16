import type { RootState } from '@/store';

import type { AuthRole } from '../types/authApi.types';
import type { AuthState, LoginSession } from './authTypes';

export const selectAuth = (state: RootState): AuthState => state.auth;

export const selectToken = (state: RootState): string | null => state.auth.token;

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;

export const selectIsRestoringSession = (state: RootState): boolean =>
  state.auth.isRestoringSession;

export const selectRefreshToken = (state: RootState): string | null => state.auth.refreshToken;

export const selectLoginSession = (state: RootState): LoginSession | null => state.auth.loginSession;

export const selectLoggedInMobile = (state: RootState): string | null => state.auth.mobile;

export const selectDisplayName = (state: RootState): string | null => state.auth.displayName;

export const selectAccountRole = (state: RootState): AuthRole | null => state.auth.accountRole;

export function formatAccountRoleLabel(role: AuthRole | null | undefined): string {
  if (role === 'consultant') {
    return 'Consultant';
  }
  if (role === 'user') {
    return 'User';
  }
  return 'Member';
}
