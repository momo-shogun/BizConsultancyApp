import type { RootState } from '@/store';

import type { AuthState, LoginSession } from './authTypes';

export const selectAuth = (state: RootState): AuthState => state.auth;

export const selectToken = (state: RootState): string | null => state.auth.token;

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;

export const selectLoginSession = (state: RootState): LoginSession | null => state.auth.loginSession;
