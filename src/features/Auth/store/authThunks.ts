import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { isValidIndianMobile } from '@/utils/formatPhone';

import { authApi } from '../api/authApi';
import type { AuthRole, VerifyOtpDto } from '../types/authApi.types';
import { isTokenExpired, parseAuthSessionPayload } from '../utils/authSessionParsing';
import {
  establishSession,
  logout,
  setAuthSession,
  setRestoringSession,
} from './authSlice';
import type { AuthSessionPayload } from './authTypes';

function buildUserFromSession(payload: AuthSessionPayload) {
  return {
    id: payload.userId,
    name: payload.displayName?.trim() || 'User',
    phone: payload.mobile,
  };
}

export const applyAuthSession = createAsyncThunk<void, AuthSessionPayload, { state: RootState }>(
  'auth/applyAuthSession',
  async (payload, { dispatch }) => {
    dispatch(
      setAuthSession({
        ...payload,
        user: buildUserFromSession(payload),
      }),
    );
    dispatch(establishSession());
  },
);

export const refreshAuthToken = createAsyncThunk<boolean, void, { state: RootState }>(
  'auth/refreshAuthToken',
  async (_arg, { dispatch, getState }) => {
    const { refreshToken } = getState().auth;
    if (refreshToken == null || refreshToken.length === 0) {
      return false;
    }

    const result = await dispatch(
      authApi.endpoints.refreshToken.initiate({ refreshToken }, { forceRef: true }),
    ).unwrap();

    const current = getState().auth;
    const parsed = parseAuthSessionPayload(result, {
      mobile: current.mobile ?? '',
      role: current.accountRole ?? 'user',
    });

    if (parsed == null) {
      return false;
    }

    await dispatch(applyAuthSession(parsed));
    return true;
  },
);

export const restoreSession = createAsyncThunk<boolean, void, { state: RootState }>(
  'auth/restoreSession',
  async (_arg, { dispatch, getState }) => {
    dispatch(setRestoringSession(true));

    try {
      const auth = getState().auth;

      if (!auth.isAuthenticated) {
        return false;
      }

      if (auth.token != null && auth.token.length > 0) {
        if (isTokenExpired(auth.tokenExpiresAt)) {
          if (auth.refreshToken != null && auth.refreshToken.length > 0) {
            try {
              const refreshed = await dispatch(refreshAuthToken()).unwrap();
              return refreshed;
            } catch {
              dispatch(logout());
              return false;
            }
          }
          dispatch(logout());
          return false;
        }
        return true;
      }

      if (auth.mobile != null && isValidIndianMobile(auth.mobile)) {
        return true;
      }

      // Guest / skip path: authenticated flag without phone (not recommended for production APIs).
      return true;
    } finally {
      dispatch(setRestoringSession(false));
    }
  },
);

function isVerifyOtpUnavailable(error: unknown): boolean {
  if (error == null || typeof error !== 'object' || !('status' in error)) {
    return false;
  }
  const status = (error as { status?: unknown }).status;
  return status === 404 || status === 'FETCH_ERROR' || status === 'PARSING_ERROR';
}

export const verifyOtpAndLogin = createAsyncThunk<
  void,
  VerifyOtpDto,
  { state: RootState }
>('auth/verifyOtpAndLogin', async (body, { dispatch }) => {
  try {
    const response = await dispatch(authApi.endpoints.verifyOtp.initiate(body)).unwrap();

    const parsed = parseAuthSessionPayload(response, {
      mobile: body.mobile,
      role: body.role,
    });

    if (parsed == null) {
      throw new Error('Invalid login response. Missing access token.');
    }

    await dispatch(applyAuthSession(parsed));
  } catch (error: unknown) {
    if (isVerifyOtpUnavailable(error)) {
      await dispatch(
        establishProfileSession({
          mobile: body.mobile,
          role: body.role,
        }),
      );
      return;
    }
    throw error;
  }
});

export const establishProfileSession = createAsyncThunk<
  void,
  { mobile: string; role: AuthRole; displayName?: string | null },
  { state: RootState }
>('auth/establishProfileSession', async (payload, { dispatch }) => {
  dispatch(
    setAuthSession({
      accessToken: '',
      refreshToken: null,
      tokenExpiresAt: null,
      userId: payload.mobile,
      displayName: payload.displayName ?? null,
      mobile: payload.mobile,
      accountRole: payload.role,
      user: {
        id: payload.mobile,
        name: payload.displayName?.trim() || 'User',
        phone: payload.mobile,
      },
    }),
  );
  dispatch(establishSession());
});

export const logoutSession = createAsyncThunk<void, void, { state: RootState }>(
  'auth/logoutSession',
  async (_arg, { dispatch }) => {
    dispatch(logout());
    dispatch(authApi.util.resetApiState());
  },
);
