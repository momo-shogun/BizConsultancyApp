import { baseApi } from '@/services/api/baseApi';

import type {
  SubmitUserFeedbackPayload,
  SubmitUserFeedbackResult,
} from '../types/userFeedback.types';

function parseSubmitUserFeedbackResponse(response: unknown): SubmitUserFeedbackResult {
  if (response != null && typeof response === 'object') {
    const row = response as Record<string, unknown>;
    const id = Number(row.id);
    const message = typeof row.message === 'string' ? row.message : 'Thanks for your feedback.';
    if (Number.isFinite(id)) {
      return { id, message };
    }
    if (typeof row.message === 'string') {
      return { id: 0, message: row.message };
    }
  }
  return { id: 0, message: 'Thanks for your feedback.' };
}

export const userFeedbackApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitUserFeedback: build.mutation<SubmitUserFeedbackResult, SubmitUserFeedbackPayload>({
      query: (body) => ({
        url: 'user-feedback',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => parseSubmitUserFeedbackResponse(response),
    }),
  }),
});

export const { useSubmitUserFeedbackMutation } = userFeedbackApi;
