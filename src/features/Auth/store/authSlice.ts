import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { persistPreferredAccountRole } from '../storage/accountRoleStorage';
import type { AuthRole } from '../types/authApi.types';
import type { AuthSessionPayload, AuthState, LoginSession, User } from './authTypes';

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  tokenExpiresAt: null,
  isAuthenticated: false,
  isGuestSession: false,
  isRestoringSession: true,
  mobile: null,
  displayName: null,
  email: null,
  accountRole: null,
  preferredAccountRole: null,
  loginSession: null,
};

function rememberPreferredRole(state: AuthState, role: AuthRole | null | undefined): void {
  if (role != null) {
    state.preferredAccountRole = role;
    void persistPreferredAccountRole(role);
  }
}

type SetAuthSessionPayload = AuthSessionPayload & {
  user: User;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken?: string | null;
        tokenExpiresAt?: number | null;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.tokenExpiresAt = action.payload.tokenExpiresAt ?? null;
      state.isAuthenticated = true;
      state.isGuestSession = false;
      state.mobile = action.payload.user.phone;
      state.displayName = action.payload.user.name;
      state.email = action.payload.user.email ?? null;
    },

    setAuthSession: (state, action: PayloadAction<SetAuthSessionPayload>) => {
      const payload = action.payload;
      state.user = payload.user;
      state.token = payload.accessToken.length > 0 ? payload.accessToken : null;
      state.refreshToken = payload.refreshToken ?? null;
      state.tokenExpiresAt = payload.tokenExpiresAt ?? null;
      state.isAuthenticated = true;
      state.isGuestSession = false;
      state.mobile = payload.mobile;
      state.displayName = payload.displayName ?? null;
      state.email = payload.email ?? null;
      state.accountRole = payload.accountRole;
      rememberPreferredRole(state, payload.accountRole);
    },

    establishSession: (state) => {
      state.isAuthenticated = true;
      state.isGuestSession = false;
    },

    establishGuestSession: (
      state,
      action: PayloadAction<{ accountRole?: AuthRole | null } | undefined>,
    ) => {
      state.isAuthenticated = true;
      state.isGuestSession = true;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.user = null;
      state.loginSession = null;
      state.mobile = null;
      state.displayName = null;
      state.email = null;
      const role = action.payload?.accountRole ?? 'user';
      state.accountRole = role;
      rememberPreferredRole(state, role);
    },

    setRestoringSession: (state, action: PayloadAction<boolean>) => {
      state.isRestoringSession = action.payload;
    },

    setLoggedInMobile: (state, action: PayloadAction<string>) => {
      state.mobile = action.payload;
    },

    setAuthProfile: (
      state,
      action: PayloadAction<{
        displayName?: string | null;
        accountRole?: AuthRole | null;
        mobile?: string | null;
        email?: string | null;
      }>,
    ) => {
      if (action.payload.displayName !== undefined) {
        state.displayName = action.payload.displayName;
        if (state.user != null) {
          state.user.name = action.payload.displayName ?? state.user.name;
        }
      }
      if (action.payload.accountRole !== undefined) {
        state.accountRole = action.payload.accountRole;
        rememberPreferredRole(state, action.payload.accountRole);
      }
      if (action.payload.mobile !== undefined) {
        state.mobile = action.payload.mobile;
        if (state.user != null) {
          state.user.phone = action.payload.mobile;
        }
      }
      if (action.payload.email !== undefined) {
        state.email = action.payload.email;
        if (state.user != null) {
          state.user.email = action.payload.email;
        }
      }
    },

    setLoginSession: (state, action: PayloadAction<LoginSession>) => {
      state.loginSession = action.payload;
      state.mobile = action.payload.mobile;
      state.accountRole = action.payload.role;
      rememberPreferredRole(state, action.payload.role);
    },

    setPreferredAccountRole: (state, action: PayloadAction<AuthRole>) => {
      rememberPreferredRole(state, action.payload);
    },

    clearLoginSession: (state) => {
      state.loginSession = null;
    },

    logout: (state) => {
      const preferred = state.preferredAccountRole ?? state.accountRole;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.isGuestSession = false;
      state.mobile = null;
      state.displayName = null;
      state.email = null;
      state.accountRole = null;
      state.loginSession = null;
      if (preferred != null) {
        state.preferredAccountRole = preferred;
      }
    },
  },
});

export const {
  setCredentials,
  setAuthSession,
  establishSession,
  establishGuestSession,
  setRestoringSession,
  setLoggedInMobile,
  setAuthProfile,
  setLoginSession,
  clearLoginSession,
  setPreferredAccountRole,
  logout,
} = authSlice.actions;
