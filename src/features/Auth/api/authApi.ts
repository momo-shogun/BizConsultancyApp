import { baseApi } from '@/services/api/baseApi';

import type {
  RefreshTokenDto,
  RefreshTokenResponseDto,
  SendOtpDto,
  SendOtpResponseDto,
  VerifyNumberDto,
  VerifyNumberResponseDto,
  VerifyOtpDto,
  VerifyOtpResponseDto,
} from '../types/authApi.types';

function logLoginApi(
  endpoint: string,
  payload: { request?: unknown; response?: unknown; error?: unknown },
): void {
  if (payload.error != null) {
    console.log(`[Login API] ${endpoint} — error`, payload.error);
    return;
  }
  console.log(`[Login API] ${endpoint}`, {
    request: payload.request,
    response: payload.response,
  });
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    verifyNumber: build.mutation<VerifyNumberResponseDto, VerifyNumberDto>({
      query: (body) => ({
        url: 'frontend/verify-number',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          logLoginApi('POST frontend/verify-number', { request: arg, response: data });
        } catch (error: unknown) {
          logLoginApi('POST frontend/verify-number', { error });
        }
      },
    }),
    sendOtp: build.mutation<SendOtpResponseDto, SendOtpDto>({
      query: (body) => ({
        url: 'frontend/send-otp',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          logLoginApi('POST frontend/send-otp', { request: arg, response: data });
        } catch (error: unknown) {
          logLoginApi('POST frontend/send-otp', { error });
        }
      },
    }),
    verifyOtp: build.mutation<VerifyOtpResponseDto, VerifyOtpDto>({
      query: (body) => ({
        url: 'frontend/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          logLoginApi('POST frontend/verify-otp', { request: arg, response: data });
        } catch (error: unknown) {
          logLoginApi('POST frontend/verify-otp', { error });
        }
      },
    }),
    refreshToken: build.mutation<RefreshTokenResponseDto, RefreshTokenDto>({
      query: (body) => ({
        url: 'frontend/refresh-token',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          logLoginApi('POST frontend/refresh-token', {
            request: { refreshToken: '[redacted]' },
            response: data,
          });
        } catch (error: unknown) {
          logLoginApi('POST frontend/refresh-token', { error });
        }
      },
    }),
  }),
});

export const {
  useVerifyNumberMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
} = authApi;
