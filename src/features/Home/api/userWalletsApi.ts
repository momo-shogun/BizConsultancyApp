import { baseApi } from '@/services/api/baseApi';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export interface WalletBalanceResponse {
  balance: number;
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

/** INR rupees from `GET /user-wallets/me/balance` → `₹87,020`. */
export function formatWalletBalanceInr(balance: number): string {
  if (!Number.isFinite(balance)) {
    return '₹0';
  }
  return `₹${Math.round(balance).toLocaleString('en-IN')}`;
}

export function formatWalletBalanceLabel(
  balance: number | undefined,
  options?: { isLoading?: boolean; isAuthenticated?: boolean },
): string {
  if (options?.isAuthenticated === false) {
    return '₹0';
  }
  if (options?.isLoading && balance == null) {
    return '…';
  }
  if (balance == null || !Number.isFinite(balance)) {
    return '₹0';
  }
  return formatWalletBalanceInr(balance);
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
