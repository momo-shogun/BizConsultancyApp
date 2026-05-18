import { baseApi } from '@/services/api/baseApi';

import type { ServicePage } from '../screens/types';
import type {
  PublicServiceFormConfig,
  PublicServiceListResult,
  PublicServicesQuery,
} from '../types/publicServiceApi.types';
import {
  parsePublicServiceFormResponse,
  parsePublicServicesResponse,
  unwrapPublicServicePageRecord,
} from '../utils/serviceApiParsing';
import { mapPublicServiceToServicePage } from '../utils/serviceMappers';

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPublicServices: build.query<PublicServiceListResult, PublicServicesQuery | void>({
      query: (params) => ({
        url: 'public/services',
        params: params ?? {},
      }),
      transformResponse: (response: unknown) => parsePublicServicesResponse(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((s) => ({ type: 'Service' as const, id: s.id })),
              { type: 'Service', id: 'LIST' },
            ]
          : [{ type: 'Service', id: 'LIST' }],
    }),
    getPublicServicePageBySlug: build.query<ServicePage, string>({
      query: (slug) => ({
        url: `public/service-pages/${encodeURIComponent(slug)}`,
      }),
      transformResponse: (response: unknown): ServicePage => {
        const row = unwrapPublicServicePageRecord(response);
        const page = row != null ? mapPublicServiceToServicePage(row) : null;
        if (page == null) {
          throw new Error('Invalid service page response');
        }
        return page;
      },
      providesTags: (_result, _err, slug) => [{ type: 'Service', id: slug }],
    }),
    getPublicServiceFormBySlug: build.query<PublicServiceFormConfig, string>({
      query: (slug) => ({
        url: `public/service-forms/${encodeURIComponent(slug)}`,
      }),
      transformResponse: (response: unknown): PublicServiceFormConfig =>
        parsePublicServiceFormResponse(response) ?? {},
      providesTags: (_result, _err, slug) => [
        { type: 'Service', id: `${slug}-form` },
      ],
    }),
  }),
});

export const {
  useGetPublicServicesQuery,
  useGetPublicServicePageBySlugQuery,
  useGetPublicServiceFormBySlugQuery,
  useLazyGetPublicServiceFormBySlugQuery,
} = servicesApi;
