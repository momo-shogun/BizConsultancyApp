import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '@/constants/api';
import { establishSession, logout, setAuthSession } from '@/features/Auth/store/authSlice';
import { parseAuthSessionPayload } from '@/features/Auth/utils/authSessionParsing';
import type { RootState } from '@/store';

import { logApiResponse } from './logApiResponse';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;
    if (token != null && token.length > 0) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithLogging: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const request =
    typeof args === 'string' ? undefined : (args.body ?? args.params ?? undefined);

  if (result.error != null) {
    logApiResponse(args, { request, error: result.error });
  } else {
    logApiResponse(args, { request, response: result.data });
  }

  return result;
};

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQueryWithLogging(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const url = typeof args === 'string' ? args : args.url;
  if (url.includes('refresh-token') || url.includes('verify-otp') || url.includes('send-otp')) {
    return result;
  }

  const state = api.getState() as RootState;
  if (state.auth.refreshToken == null || state.auth.refreshToken.length === 0) {
    api.dispatch(logout());
    return result;
  }

  if (refreshPromise == null) {
    refreshPromise = (async (): Promise<boolean> => {
      const refreshToken = state.auth.refreshToken;
      if (refreshToken == null || refreshToken.length === 0) {
        return false;
      }

      const refreshResult = await rawBaseQuery(
        {
          url: 'frontend/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.error != null || refreshResult.data == null) {
        return false;
      }

      const parsed = parseAuthSessionPayload(refreshResult.data, {
        mobile: state.auth.mobile ?? '',
        role: state.auth.accountRole ?? 'user',
      });

      if (parsed == null) {
        return false;
      }

      api.dispatch(
        setAuthSession({
          ...parsed,
          user: {
            id: parsed.userId,
            name: parsed.displayName?.trim() || state.auth.user?.name || 'User',
            phone: parsed.mobile,
          },
        }),
      );
      api.dispatch(establishSession());
      return true;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;
  if (!refreshed) {
    api.dispatch(logout());
    return result;
  }

  result = await baseQueryWithLogging(args, api, extraOptions);
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Consultant'],
  endpoints: () => ({}),
});
