import { baseApi } from '@/services/api/baseApi';

import type { ConsultantDetail } from '../types/consultantDetail.types';
import type {
  AvailableSlotsQuery,
  AvailableSlotsResponse,
  PublicConsultantsPageResult,
  PublicConsultantsQuery,
} from '../types/consultantApi.types';
import { CONSULTANT_LIST_PAGE_SIZE } from '../constants/pagination';
import {
  parseAvailableSlotsResponse,
  parsePublicConsultantsPageResponse,
  parseSingleConsultantResponse,
} from '../utils/consultantApiParsing';

function stableConsultantsQueryKey(queryArgs: PublicConsultantsQuery | void): string {
  const args = queryArgs ?? {};
  const { page: _page, ...stable } = args;
  return JSON.stringify(stable);
}

function mergeConsultantPages(
  currentCache: PublicConsultantsPageResult,
  newCache: PublicConsultantsPageResult,
  page: number,
): PublicConsultantsPageResult {
  if (page <= 1) {
    return newCache;
  }
  const seen = new Set(currentCache.items.map((c) => c.id));
  const appended = newCache.items.filter((c) => !seen.has(c.id));
  return {
    ...newCache,
    items: [...currentCache.items, ...appended],
  };
}

export const consultantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPublicConsultants: build.query<PublicConsultantsPageResult, PublicConsultantsQuery | void>({
      query: (params) => {
        const args = params ?? {};
        return {
          url: 'public/consultants',
          params: {
            page: args.page ?? '1',
            limit: args.limit ?? String(CONSULTANT_LIST_PAGE_SIZE),
            ...args,
          },
        };
      },
      transformResponse: (response: unknown, _meta, arg) =>
        parsePublicConsultantsPageResponse(response, {
          page: Number(arg?.page ?? 1),
          limit: Number(arg?.limit ?? CONSULTANT_LIST_PAGE_SIZE),
        }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}(${stableConsultantsQueryKey(queryArgs)})`,
      merge: (currentCache, newCache, { arg }) =>
        mergeConsultantPages(currentCache, newCache, Number(arg?.page ?? 1)),
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((c) => ({ type: 'Consultant' as const, id: c.id })),
              { type: 'Consultant', id: 'LIST' },
            ]
          : [{ type: 'Consultant', id: 'LIST' }],
    }),
    getPublicConsultantBySlug: build.query<ConsultantDetail, string>({
      query: (slug) => ({
        url: `public/consultants/${encodeURIComponent(slug)}`,
      }),
      transformResponse: (response: unknown): ConsultantDetail => {
        const consultant = parseSingleConsultantResponse(response);
        if (consultant == null) {
          throw new Error('Invalid consultant response');
        }
        return consultant;
      },
      providesTags: (_result, _err, slug) => [{ type: 'Consultant', id: slug }],
    }),
    getAvailableSlots: build.query<AvailableSlotsResponse, AvailableSlotsQuery>({
      query: ({ slug, date }) => ({
        url: `public/consultants/${encodeURIComponent(slug)}/available-slots`,
        params: { date },
      }),
      transformResponse: (response: unknown) => parseAvailableSlotsResponse(response),
      providesTags: (_result, _err, arg) => [
        { type: 'Consultant', id: `${arg.slug}-slots-${arg.date}` },
      ],
    }),
  }),
});

export const {
  useGetPublicConsultantsQuery,
  useGetPublicConsultantBySlugQuery,
  useGetAvailableSlotsQuery,
  useLazyGetAvailableSlotsQuery,
} = consultantApi;
