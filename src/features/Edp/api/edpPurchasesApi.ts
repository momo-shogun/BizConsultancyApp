import { baseApi } from '@/services/api/baseApi';

import type { CreateEdpPurchaseResult, EdpPurchaseMe } from '../types/edpPurchase.types';
import {
  parseCreateEdpPurchaseResponse,
  parseEdpPurchaseMe,
} from '../utils/edpPurchaseParsing';

export const edpPurchasesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyEdpPurchase: build.query<EdpPurchaseMe, void>({
      query: () => 'edp-purchases/me',
      transformResponse: (response: unknown) => parseEdpPurchaseMe(response),
      providesTags: [{ type: 'EdpPurchase', id: 'ME' }],
    }),
    getEdpProgramAmount: build.query<{ amount: number }, void>({
      query: () => 'edp-purchases/amount',
      transformResponse: (response: unknown): { amount: number } => {
        if (response != null && typeof response === 'object' && 'amount' in response) {
          const amount = Number((response as { amount: unknown }).amount);
          if (Number.isFinite(amount) && amount > 0) {
            return { amount };
          }
        }
        return { amount: 0 };
      },
    }),
    createEdpPurchase: build.mutation<
      CreateEdpPurchaseResult,
      { paymentGateway: 'wallet' | 'razor_pay' }
    >({
      query: (body) => ({
        url: 'edp-purchases',
        method: 'POST',
        body: {
          paymentGateway: body.paymentGateway,
          appType: 'app',
        },
      }),
      transformResponse: (response: unknown) => parseCreateEdpPurchaseResponse(response),
      invalidatesTags: [{ type: 'EdpPurchase', id: 'ME' }, 'Wallet'],
    }),
    verifyEdpPurchasePayment: build.mutation<
      { paymentStatus: string },
      { orderId: string; paymentId: string }
    >({
      query: (body) => ({
        url: 'edp-purchases/verify-payment',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown): { paymentStatus: string } => {
        if (response != null && typeof response === 'object' && 'paymentStatus' in response) {
          return { paymentStatus: String((response as { paymentStatus: unknown }).paymentStatus) };
        }
        return { paymentStatus: 'SUCCESS' };
      },
      invalidatesTags: [{ type: 'EdpPurchase', id: 'ME' }, 'Wallet'],
    }),
  }),
});

export const {
  useGetMyEdpPurchaseQuery,
  useGetEdpProgramAmountQuery,
  useCreateEdpPurchaseMutation,
  useVerifyEdpPurchasePaymentMutation,
} = edpPurchasesApi;
