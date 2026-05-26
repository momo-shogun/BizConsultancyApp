import { baseApi } from '@/services/api/baseApi';

import type { ConsultantWithdrawalItem } from '../types/consultantWallet.types';

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

function parseWithdrawalItem(raw: unknown): ConsultantWithdrawalItem | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = readNumber(raw.id);
  const consultantId = readNumber(raw.consultantId);
  const amount = readNumber(raw.amount);
  const status = readString(raw.status);
  const createdAt = readString(raw.createdAt);
  const updatedAt = readString(raw.updatedAt);
  if (id == null || consultantId == null || amount == null || status == null || createdAt == null) {
    return null;
  }
  return {
    id,
    consultantId,
    status,
    amount,
    createdAt,
    updatedAt: updatedAt ?? createdAt,
  };
}

function parseWithdrawalList(raw: unknown): ConsultantWithdrawalItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(parseWithdrawalItem)
    .filter((item): item is ConsultantWithdrawalItem => item != null);
}

export const consultantWithdrawalsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyWithdrawals: build.query<ConsultantWithdrawalItem[], void>({
      query: () => ({ url: 'withdrawals/my' }),
      transformResponse: (response: unknown) => parseWithdrawalList(response),
      providesTags: [{ type: 'ConsultantWithdrawals', id: 'LIST' }],
    }),
    createMyWithdrawal: build.mutation<ConsultantWithdrawalItem, { amount: number }>({
      query: (body) => ({
        url: 'withdrawals/my',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        const parsed = parseWithdrawalItem(response);
        if (parsed == null) {
          throw new Error('Invalid withdrawal response');
        }
        return parsed;
      },
      invalidatesTags: [
        { type: 'ConsultantWithdrawals', id: 'LIST' },
        'Wallet',
      ],
    }),
  }),
});

export const { useGetMyWithdrawalsQuery, useCreateMyWithdrawalMutation } =
  consultantWithdrawalsApi;
