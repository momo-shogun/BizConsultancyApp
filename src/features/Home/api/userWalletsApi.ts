import { baseApi } from '@/services/api/baseApi';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseWalletBalance(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  if (isRecord(raw)) {
    const balance = raw.balance ?? raw.amount;
    if (typeof balance === 'number' && Number.isFinite(balance)) {
      return balance;
    }
  }
  return 0;
}

export const userWalletsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyWalletBalance: build.query<number, void>({
      query: () => ({ url: 'user-wallets/me/balance' }),
      transformResponse: (response: unknown) => parseWalletBalance(response),
      providesTags: ['Wallet'],
    }),
    getConsultantWalletBalance: build.query<number, void>({
      query: () => ({ url: 'frontend/consultant/wallet-balance' }),
      transformResponse: (response: unknown) => parseWalletBalance(response),
      providesTags: ['Wallet'],
    }),
  }),
});

export const { useGetMyWalletBalanceQuery, useGetConsultantWalletBalanceQuery } = userWalletsApi;
