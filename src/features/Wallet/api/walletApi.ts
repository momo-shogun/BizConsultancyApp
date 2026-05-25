import { baseApi } from '@/services/api/baseApi';

import type {
  WalletTopupOrderResponse,
  WalletTopupVerifyPayload,
  WalletTopupVerifyResponse,
  WalletTransaction,
  WalletTransactionsMeta,
  WalletTransactionsResponse,
} from '../types/wallet.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseTransactionAmount(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === 'string' && raw.trim().length > 0) {
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseIsDeleted(raw: unknown): boolean {
  if (typeof raw === 'boolean') {
    return raw;
  }
  if (typeof raw === 'number') {
    return raw !== 0;
  }
  return false;
}

function parseWalletTransaction(raw: unknown): WalletTransaction | null {
  if (!isRecord(raw)) {
    return null;
  }

  if (parseIsDeleted(raw.isDeleted)) {
    return null;
  }

  const id = typeof raw.id === 'number' ? raw.id : null;
  const userId = typeof raw.userId === 'number' ? raw.userId : null;
  const transactionType =
    typeof raw.transactionType === 'string' ? raw.transactionType : null;
  const transactionAmount = parseTransactionAmount(raw.transactionAmount);
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : null;
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : null;

  if (
    id == null ||
    userId == null ||
    transactionType == null ||
    transactionAmount == null ||
    createdAt == null ||
    updatedAt == null
  ) {
    return null;
  }

  return {
    id,
    userId,
    transactionType,
    transactionDetail:
      typeof raw.transactionDetail === 'string' ? raw.transactionDetail : null,
    transactionAmount,
    transactionId:
      typeof raw.transactionId === 'string' ? raw.transactionId : null,
    isDeleted: false,
    createdAt,
    updatedAt,
  };
}

function parseTransactionsMeta(raw: unknown): WalletTransactionsMeta {
  if (!isRecord(raw)) {
    return { total: 0, page: 1, limit: 20, totalPages: 1 };
  }
  return {
    total: typeof raw.total === 'number' ? raw.total : 0,
    page: typeof raw.page === 'number' ? raw.page : 1,
    limit: typeof raw.limit === 'number' ? raw.limit : 20,
    totalPages: typeof raw.totalPages === 'number' ? raw.totalPages : 1,
  };
}

function parseTopupOrder(raw: unknown): WalletTopupOrderResponse {
  if (!isRecord(raw)) {
    throw new Error('Invalid top-up order response');
  }
  const orderId = typeof raw.orderId === 'string' ? raw.orderId : null;
  const keyId = typeof raw.keyId === 'string' ? raw.keyId : null;
  const amount = typeof raw.amount === 'number' ? raw.amount : null;
  if (orderId == null || keyId == null || amount == null) {
    throw new Error('Incomplete top-up order response');
  }
  return { orderId, keyId, amount };
}

export const walletApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyWalletTransactions: build.query<
      WalletTransactionsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: 'user-wallets/me/transactions',
        params: { page, limit },
      }),
      transformResponse: (response: unknown): WalletTransactionsResponse => {
        if (!isRecord(response) || !Array.isArray(response.data)) {
          return { data: [], meta: parseTransactionsMeta(response) };
        }
        const data = response.data
          .map(parseWalletTransaction)
          .filter((row): row is WalletTransaction => row != null);
        return {
          data,
          meta: parseTransactionsMeta(response.meta),
        };
      },
      providesTags: ['Wallet'],
    }),
    createWalletTopupOrder: build.mutation<WalletTopupOrderResponse, number>({
      query: (amount) => ({
        url: 'user-wallets/topup/create-order',
        method: 'POST',
        body: { amount },
      }),
      transformResponse: (response: unknown) => parseTopupOrder(response),
    }),
    verifyWalletTopup: build.mutation<WalletTopupVerifyResponse, WalletTopupVerifyPayload>({
      query: (body) => ({
        url: 'user-wallets/topup/verify',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet'],
    }),
  }),
});

export const {
  useGetMyWalletTransactionsQuery,
  useCreateWalletTopupOrderMutation,
  useVerifyWalletTopupMutation,
} = walletApi;
