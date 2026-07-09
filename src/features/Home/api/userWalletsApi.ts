import { baseApi } from '@/services/api/baseApi';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export interface WalletBalanceResponse {
  balance: number;
}

function readWalletNumeric(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

const WALLET_BALANCE_KEYS = [
  'balance',
  'amount',
  'walletBalance',
  'availableBalance',
  'currentBalance',
  'totalBalance',
  'walletAmount',
  'available_amount',
  'wallet_balance',
  'current_balance',
] as const;

function pickWalletBalanceFromRecord(record: Record<string, unknown>): number | null {
  for (const key of WALLET_BALANCE_KEYS) {
    const value = readWalletNumeric(record[key]);
    if (value != null) {
      return value;
    }
  }

  const nestedWallet = record.wallet ?? record.userWallet ?? record.user_wallet;
  if (isRecord(nestedWallet)) {
    return pickWalletBalanceFromRecord(nestedWallet);
  }

  return null;
}

/** Parses INR wallet balance from `GET /user-wallets/me/balance` (and consultant variant). */
export function parseWalletBalance(raw: unknown): number | null {
  const direct = readWalletNumeric(raw);
  if (direct != null) {
    return direct;
  }

  if (!isRecord(raw)) {
    return null;
  }

  const fromRoot = pickWalletBalanceFromRecord(raw);
  if (fromRoot != null) {
    return fromRoot;
  }

  const nested = raw.data ?? raw.result ?? raw.payload;
  if (nested != null) {
    const fromNestedDirect = readWalletNumeric(nested);
    if (fromNestedDirect != null) {
      return fromNestedDirect;
    }
    if (isRecord(nested)) {
      const fromNested = pickWalletBalanceFromRecord(nested);
      if (fromNested != null) {
        return fromNested;
      }
    }
  }

  return null;
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
    getMyWalletBalance: build.query<number | null, void>({
      query: () => ({ url: 'user-wallets/me/balance' }),
      transformResponse: (response: unknown) => parseWalletBalance(response),
      providesTags: ['Wallet'],
    }),
    getConsultantWalletBalance: build.query<number | null, void>({
      query: () => ({ url: 'frontend/consultant/wallet-balance' }),
      transformResponse: (response: unknown) => parseWalletBalance(response),
      providesTags: ['Wallet'],
    }),
  }),
});

export const { useGetMyWalletBalanceQuery, useGetConsultantWalletBalanceQuery } = userWalletsApi;
