import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { baseApi } from '@/services/api/baseApi';

import type {
  ConsultantAvailabilityOverride,
  ConsultantSchedule,
  OverrideFormState,
  UpsertConsultantSchedulePayload,
} from '../types/consultantSchedule.types';
import {
  parseConsultantOverridesList,
  parseConsultantSchedule,
} from '../utils/consultantScheduleParsing';

function isNotFoundError(error: FetchBaseQueryError): boolean {
  return error.status === 404;
}

export const consultantScheduleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConsultantSchedule: build.query<ConsultantSchedule | null, void>({
      async queryFn(_arg, _api, _extra, baseQuery) {
        const result = await baseQuery({ url: 'frontend/consultant/schedule' });
        if (result.error != null) {
          if (isNotFoundError(result.error as FetchBaseQueryError)) {
            return { data: null };
          }
          return { error: result.error as FetchBaseQueryError };
        }
        return { data: parseConsultantSchedule(result.data) };
      },
      providesTags: [{ type: 'ConsultantSchedule', id: 'ME' }],
    }),
    upsertConsultantSchedule: build.mutation<ConsultantSchedule, UpsertConsultantSchedulePayload>({
      query: (body) => ({
        url: 'frontend/consultant/schedule',
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: unknown) => {
        const parsed = parseConsultantSchedule(response);
        if (parsed == null) {
          throw new Error('Invalid schedule response');
        }
        return parsed;
      },
      invalidatesTags: [{ type: 'ConsultantSchedule', id: 'ME' }, 'Consultant'],
    }),
    getConsultantOverrides: build.query<ConsultantAvailabilityOverride[], void>({
      query: () => ({ url: 'frontend/consultant/overrides' }),
      transformResponse: (response: unknown) => parseConsultantOverridesList(response),
      providesTags: [{ type: 'ConsultantSchedule', id: 'OVERRIDES' }],
    }),
    createConsultantOverride: build.mutation<ConsultantAvailabilityOverride, OverrideFormState>({
      query: (body) => ({
        url: 'frontend/consultant/overrides',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        const list = parseConsultantOverridesList([response]);
        const first = list[0];
        if (first == null) {
          throw new Error('Invalid override response');
        }
        return first;
      },
      invalidatesTags: [{ type: 'ConsultantSchedule', id: 'OVERRIDES' }, 'Consultant'],
    }),
    updateConsultantOverride: build.mutation<
      ConsultantAvailabilityOverride,
      { id: number; body: Partial<OverrideFormState> }
    >({
      query: ({ id, body }) => ({
        url: `frontend/consultant/overrides/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: unknown) => {
        const list = parseConsultantOverridesList([response]);
        const first = list[0];
        if (first == null) {
          throw new Error('Invalid override response');
        }
        return first;
      },
      invalidatesTags: [{ type: 'ConsultantSchedule', id: 'OVERRIDES' }, 'Consultant'],
    }),
    deleteConsultantOverride: build.mutation<void, number>({
      query: (id) => ({
        url: `frontend/consultant/overrides/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ConsultantSchedule', id: 'OVERRIDES' }, 'Consultant'],
    }),
  }),
});

export const {
  useGetConsultantScheduleQuery,
  useUpsertConsultantScheduleMutation,
  useGetConsultantOverridesQuery,
  useCreateConsultantOverrideMutation,
  useUpdateConsultantOverrideMutation,
  useDeleteConsultantOverrideMutation,
} = consultantScheduleApi;
