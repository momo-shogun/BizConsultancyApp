import { baseApi } from '@/services/api/baseApi';

import type {
  SendOtpDto,
  SendOtpResponseDto,
  VerifyNumberDto,
  VerifyNumberResponseDto,
} from '../types/authApi.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    verifyNumber: build.mutation<VerifyNumberResponseDto, VerifyNumberDto>({
      query: (body) => ({
        url: 'frontend/verify-number',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    sendOtp: build.mutation<SendOtpResponseDto, SendOtpDto>({
      query: (body) => ({
        url: 'frontend/send-otp',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useVerifyNumberMutation, useSendOtpMutation } = authApi;
