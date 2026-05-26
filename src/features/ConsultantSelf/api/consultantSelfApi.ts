import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { baseApi } from '@/services/api/baseApi';
import { postMultipartFields } from '@/services/api/multipartFetch';
import type { RootState } from '@/store';

import type {
  ConsultantExpertVideo,
  ConsultantIndustryInput,
  ConsultantIndustryItem,
  ConsultantReviewsPage,
  ConsultantReviewsQuery,
} from '../types/consultantSelf.types';
import {
  parseConsultantExpertVideo,
  parseConsultantExpertVideoList,
  parseConsultantIndustryList,
  parseConsultantReviewsPage,
} from '../utils/consultantSelfParsing';

export const consultantSelfApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyConsultantIndustries: build.query<ConsultantIndustryItem[], void>({
      query: () => 'frontend/consultant/industries',
      transformResponse: (response: unknown) => parseConsultantIndustryList(response),
      providesTags: [{ type: 'ConsultantExpertise', id: 'LIST' }],
    }),
    setMyConsultantIndustries: build.mutation<
      ConsultantIndustryItem[],
      ConsultantIndustryInput[]
    >({
      query: (items) => ({
        url: 'frontend/consultant/industries',
        method: 'PATCH',
        body: { items },
      }),
      transformResponse: (response: unknown) => parseConsultantIndustryList(response),
      invalidatesTags: [{ type: 'ConsultantExpertise', id: 'LIST' }],
    }),
    getMyExpertVideos: build.query<ConsultantExpertVideo[], void>({
      query: () => 'frontend/consultant/experts-videos',
      transformResponse: (response: unknown) => parseConsultantExpertVideoList(response),
      providesTags: [{ type: 'ConsultantExpertVideos', id: 'LIST' }],
    }),
    createMyExpertVideo: build.mutation<
      ConsultantExpertVideo,
      {
        categoryId: number;
        segmentId: number;
        industryId: number;
        title: string;
        url: string;
        duration?: number;
        type: 'paid' | 'free';
        amount?: number;
        thumbnail?: { uri: string; name: string; type: string };
      }
    >({
      async queryFn(payload, { getState }) {
        const fields: Record<string, string> = {
          categoryId: String(payload.categoryId),
          segmentId: String(payload.segmentId),
          industryId: String(payload.industryId),
          title: payload.title.trim(),
          url: payload.url.trim(),
          type: payload.type,
          amount: String(payload.type === 'paid' ? (payload.amount ?? 0) : 0),
        };
        if (payload.duration != null && Number.isFinite(payload.duration)) {
          fields.duration = String(payload.duration);
        }

        try {
          const token = (getState() as RootState).auth?.token ?? null;
          const result = await postMultipartFields(
            'frontend/consultant/experts-videos',
            fields,
            payload.thumbnail != null ? 'thumbnail' : null,
            payload.thumbnail ?? null,
            token,
          );

          if (!result.ok) {
            return {
              error: {
                status: result.status === 0 ? 'FETCH_ERROR' : result.status,
                data: result.data,
                error:
                  result.data != null &&
                  typeof result.data === 'object' &&
                  'message' in result.data &&
                  typeof (result.data as { message?: unknown }).message === 'string'
                    ? (result.data as { message: string }).message
                    : 'Failed to create expert video',
              } as FetchBaseQueryError,
            };
          }

          const parsed = parseConsultantExpertVideo(result.data);
          if (parsed == null) {
            return {
              error: {
                status: 'PARSING_ERROR',
                data: 'Invalid expert video response',
                error: 'Invalid expert video response',
              } as FetchBaseQueryError,
            };
          }
          return { data: parsed };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to create expert video';
          return {
            error: {
              status: 'FETCH_ERROR',
              data: { message },
              error: message,
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: [{ type: 'ConsultantExpertVideos', id: 'LIST' }],
    }),
    updateMyExpertVideoStatus: build.mutation<
      { id: number; status: number },
      { id: number; status: number }
    >({
      query: ({ id, status }) => ({
        url: `frontend/consultant/experts-videos/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'ConsultantExpertVideos', id: 'LIST' }],
    }),
    deleteMyExpertVideo: build.mutation<{ ok: true }, number>({
      query: (id) => ({
        url: `frontend/consultant/experts-videos/${id}`,
        method: 'DELETE',
      }),
      transformResponse: () => ({ ok: true as const }),
      invalidatesTags: [{ type: 'ConsultantExpertVideos', id: 'LIST' }],
    }),
    getConsultantReviews: build.query<ConsultantReviewsPage, ConsultantReviewsQuery>({
      query: (params) => ({
        url: 'frontend/consultant/reviews',
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        },
      }),
      transformResponse: (response: unknown) => parseConsultantReviewsPage(response),
      providesTags: (_result, _err, arg) => [
        { type: 'ConsultantReviews', id: `PAGE-${arg.page ?? 1}-${arg.search ?? ''}` },
      ],
    }),
  }),
});

export const {
  useGetMyConsultantIndustriesQuery,
  useSetMyConsultantIndustriesMutation,
  useGetMyExpertVideosQuery,
  useCreateMyExpertVideoMutation,
  useUpdateMyExpertVideoStatusMutation,
  useDeleteMyExpertVideoMutation,
  useGetConsultantReviewsQuery,
} = consultantSelfApi;
