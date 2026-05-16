import { baseApi } from '@/services/api/baseApi';

import type { ConsultantDetail } from '../types/consultantDetail.types';
import type {
  AvailableSlotsQuery,
  AvailableSlotsResponse,
  PublicConsultantsQuery,
} from '../types/consultantApi.types';
import {
  parseAvailableSlotsResponse,
  parsePublicConsultantsResponse,
  parseSingleConsultantResponse,
} from '../utils/consultantApiParsing';

export const consultantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPublicConsultants: build.query<ConsultantDetail[], PublicConsultantsQuery | void>({
      query: (params) => ({
        url: 'public/consultants',
        params: params ?? {},
      }),
      transformResponse: (response: unknown) => parsePublicConsultantsResponse(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: 'Consultant' as const, id: c.id })),
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
