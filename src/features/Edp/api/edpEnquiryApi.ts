import { baseApi } from '@/services/api/baseApi';

import type {
  SubmitEdpEnquiryPayload,
  SubmitEdpEnquiryResult,
} from '../types/edpEnquiry.types';

function parseSubmitEdpEnquiryResponse(response: unknown): SubmitEdpEnquiryResult {
  if (response != null && typeof response === 'object') {
    const row = response as Record<string, unknown>;
    const nested =
      row.data != null && typeof row.data === 'object' && !Array.isArray(row.data)
        ? (row.data as Record<string, unknown>)
        : row;
    const id = Number(nested.id);
    const message =
      typeof nested.message === 'string'
        ? nested.message
        : 'Your programme guidance request has been received.';
    if (Number.isFinite(id)) {
      return { id, message };
    }
    if (typeof nested.message === 'string') {
      return { id: 0, message: nested.message };
    }
  }
  return {
    id: 0,
    message: 'Your programme guidance request has been received.',
  };
}

export const edpEnquiryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitEdpEnquiry: build.mutation<SubmitEdpEnquiryResult, SubmitEdpEnquiryPayload>({
      query: (body) => ({
        url: 'public/enquiries',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => parseSubmitEdpEnquiryResponse(response),
    }),
  }),
});

export const { useSubmitEdpEnquiryMutation } = edpEnquiryApi;
