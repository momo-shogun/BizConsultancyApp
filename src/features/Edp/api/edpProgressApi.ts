import { baseApi } from '@/services/api/baseApi';

export interface EdpModuleWatchSummaryResponse {
  totalSeconds: number;
}

export interface EdpModuleWatchSummariesBatchResponse {
  totals: number[];
}

export type EdpWatchTimeSource = 'video' | 'pdf';

export interface AddEdpWatchTimePayload {
  categoryId: number;
  subCategoryId: number;
  secondsWatched: number;
  source: EdpWatchTimeSource;
}

export const edpProgressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEdpModuleWatchSummary: build.mutation<EdpModuleWatchSummaryResponse, number[]>({
      query: (subCategoryIds) => ({
        url: 'user-module-progress/module-summary',
        method: 'POST',
        body: { subCategoryIds },
      }),
    }),
    getEdpModuleWatchSummariesBatch: build.mutation<
      EdpModuleWatchSummariesBatchResponse,
      number[][]
    >({
      query: (groups) => ({
        url: 'user-module-progress/module-summaries-batch',
        method: 'POST',
        body: { groups },
      }),
    }),
    addEdpWatchTime: build.mutation<{ ok: true }, AddEdpWatchTimePayload>({
      query: (body) => ({
        url: 'user-module-progress/watch-time',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EdpModuleProgress'],
    }),
  }),
});

export const {
  useGetEdpModuleWatchSummaryMutation,
  useGetEdpModuleWatchSummariesBatchMutation,
  useAddEdpWatchTimeMutation,
} = edpProgressApi;
