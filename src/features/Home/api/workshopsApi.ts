import { baseApi } from '@/services/api/baseApi';

import type {
  PublicWorkshopsListResult,
  PublicWorkshopsQuery,
} from '../types/publicWorkshopApi.types';
import {
  parsePublicWorkshopDetailResponse,
  parsePublicWorkshopsResponse,
} from '../utils/workshopApiParsing';
import type { PublicWorkshopApiRow } from '../types/publicWorkshopApi.types';

export const DEFAULT_HOME_WORKSHOPS_QUERY = {
  page: 1,
  limit: 20,
  type: 'webinar',
  status: 1,
} as const satisfies PublicWorkshopsQuery;

export const workshopsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPublicWorkshops: build.query<PublicWorkshopsListResult, PublicWorkshopsQuery | void>({
      query: (params) => ({
        url: 'public/workshops',
        params: {
          page: params?.page ?? DEFAULT_HOME_WORKSHOPS_QUERY.page,
          limit: params?.limit ?? DEFAULT_HOME_WORKSHOPS_QUERY.limit,
          ...(params?.type != null ? { type: params.type } : { type: DEFAULT_HOME_WORKSHOPS_QUERY.type }),
          ...(params?.status != null
            ? { status: params.status }
            : { status: DEFAULT_HOME_WORKSHOPS_QUERY.status }),
          ...(params?.search?.trim() ? { search: params.search.trim() } : {}),
          ...(params?.date?.trim() ? { date: params.date.trim() } : {}),
        },
      }),
      transformResponse: (response: unknown) => parsePublicWorkshopsResponse(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((w) => ({ type: 'Workshop' as const, id: w.id })),
              { type: 'Workshop', id: 'LIST' },
            ]
          : [{ type: 'Workshop', id: 'LIST' }],
    }),
    getPublicWorkshopBySlug: build.query<PublicWorkshopApiRow, string>({
      query: (slug) => ({
        url: `public/workshops/${encodeURIComponent(slug)}`,
      }),
      transformResponse: (response: unknown): PublicWorkshopApiRow => {
        const workshop = parsePublicWorkshopDetailResponse(response);
        if (workshop == null) {
          throw new Error('Invalid workshop response');
        }
        return workshop;
      },
      providesTags: (_result, _err, slug) => [{ type: 'Workshop', id: slug }],
    }),
  }),
});

export const { useGetPublicWorkshopsQuery, useGetPublicWorkshopBySlugQuery } = workshopsApi;
