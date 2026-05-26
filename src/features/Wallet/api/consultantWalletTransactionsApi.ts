import { baseApi } from '@/services/api/baseApi';

import type {
  ConsultantWalletTransactionItem,
  ConsultantWalletTransactionsMeta,
  ConsultantWalletTransactionsResponse,
} from '../types/consultantWallet.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function readString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseTransactionItem(raw: unknown): ConsultantWalletTransactionItem | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = readNumber(raw.id);
  const transactionAmount = readNumber(raw.transactionAmount);
  const transactionType = readString(raw.transactionType);
  const createdAt = readString(raw.createdAt);
  if (id == null || transactionAmount == null || transactionType == null || createdAt == null) {
    return null;
  }
  return {
    id,
    userName: readString(raw.userName),
    transactionDetail: readString(raw.transactionDetail),
    createdAt,
    transactionType,
    transactionAmount,
    commissionAmount: readNumber(raw.commissionAmount) ?? 0,
    bookingId: readNumber(raw.bookingId),
  };
}

function parseMeta(raw: unknown): ConsultantWalletTransactionsMeta {
  if (!isRecord(raw)) {
    return { total: 0, page: 1, limit: 20, totalPages: 1 };
  }
  return {
    total: readNumber(raw.total) ?? 0,
    page: readNumber(raw.page) ?? 1,
    limit: readNumber(raw.limit) ?? 20,
    totalPages: readNumber(raw.totalPages) ?? 1,
  };
}

export interface ConsultantWalletTransactionsQuery {
  page?: number;
  limit?: number;
  transactionType?: 'credit' | 'debit';
  search?: string;
}

export const consultantWalletTransactionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConsultantWalletTransactions: build.query<
      ConsultantWalletTransactionsResponse,
      ConsultantWalletTransactionsQuery
    >({
      query: (params) => ({
        url: 'frontend/consultant/wallet-transactions',
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          ...(params.transactionType != null
            ? { transactionType: params.transactionType }
            : {}),
          ...(params.search != null && params.search.trim().length > 0
            ? { search: params.search.trim() }
            : {}),
        },
      }),
      transformResponse: (response: unknown): ConsultantWalletTransactionsResponse => {
        if (!isRecord(response) || !Array.isArray(response.data)) {
          return { data: [], meta: parseMeta(response) };
        }
        const data = response.data
          .map(parseTransactionItem)
          .filter((item): item is ConsultantWalletTransactionItem => item != null);
        return { data, meta: parseMeta(response.meta) };
      },
      providesTags: [{ type: 'ConsultantWalletTransactions', id: 'LIST' }],
    }),
  }),
});

export const { useGetConsultantWalletTransactionsQuery } = consultantWalletTransactionsApi;
