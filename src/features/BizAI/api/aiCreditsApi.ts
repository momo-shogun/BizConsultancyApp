import { baseApi } from '@/services/api/baseApi';

import type {
  AiCreditPackage,
  AiCreditPurchaseResult,
  AiCreditRazorpayOrder,
  AiUsageSummary,
  CreateAiCreditOrderRequest,
  PurchaseAiCreditsWalletRequest,
  VerifyAiCreditPaymentRequest,
} from '../types/aiCredits.types';
import {
  parseAiCreditPackagesResponse,
  parseAiCreditPurchaseResult,
  parseAiCreditRazorpayOrder,
  parseAiUsageSummary,
} from '../utils/aiCreditsParsing';

export const aiCreditsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPublicAiCreditPackages: build.query<AiCreditPackage[], void>({
      query: () => ({ url: 'ai-settings/packages/public' }),
      transformResponse: (response: unknown) => parseAiCreditPackagesResponse(response),
      providesTags: [{ type: 'AiCredits', id: 'PACKAGES' }],
    }),
    getMyAiUsage: build.query<AiUsageSummary, void>({
      query: () => ({ url: 'ai-settings/usage/me' }),
      transformResponse: (response: unknown) => {
        const parsed = parseAiUsageSummary(response);
        if (parsed == null) {
          throw new Error('Invalid AI usage response');
        }
        return parsed;
      },
      providesTags: [{ type: 'AiCredits', id: 'USAGE' }],
    }),
    createAiCreditOrder: build.mutation<AiCreditRazorpayOrder, CreateAiCreditOrderRequest>({
      query: (body) => ({
        url: 'ai-settings/credits/create-order',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        const parsed = parseAiCreditRazorpayOrder(response);
        if (parsed == null) {
          throw new Error('Invalid payment order response');
        }
        return parsed;
      },
    }),
    verifyAiCreditPayment: build.mutation<AiCreditPurchaseResult, VerifyAiCreditPaymentRequest>({
      query: (body) => ({
        url: 'ai-settings/credits/verify-payment',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        const parsed = parseAiCreditPurchaseResult(response);
        if (parsed == null) {
          throw new Error('Invalid payment verification response');
        }
        return parsed;
      },
      invalidatesTags: [
        { type: 'AiCredits', id: 'USAGE' },
        'Wallet',
      ],
    }),
    purchaseAiCreditsWithWallet: build.mutation<
      AiCreditPurchaseResult,
      PurchaseAiCreditsWalletRequest
    >({
      query: (body) => ({
        url: 'ai-settings/credits/purchase-wallet',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        const parsed = parseAiCreditPurchaseResult(response);
        if (parsed == null) {
          throw new Error('Invalid wallet purchase response');
        }
        return parsed;
      },
      invalidatesTags: [
        { type: 'AiCredits', id: 'USAGE' },
        'Wallet',
      ],
    }),
  }),
});

export const {
  useGetPublicAiCreditPackagesQuery,
  useGetMyAiUsageQuery,
  useLazyGetMyAiUsageQuery,
  useCreateAiCreditOrderMutation,
  useVerifyAiCreditPaymentMutation,
  usePurchaseAiCreditsWithWalletMutation,
} = aiCreditsApi;
