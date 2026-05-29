import { baseApi } from '@/services/api/baseApi';

import type {
  AiUsageStatus,
  AiUsageStatusMutationArgs,
  BizAssistantChatMutationArgs,
  BizAssistantChatResponse,
} from '../types/bizAssistant.types';
import { parseAiUsageStatus, parseBizAssistantChatResponse } from '../utils/bizAssistantParsing';

function guestHeaders(guestSessionId: string | undefined): Record<string, string> | undefined {
  if (guestSessionId == null || guestSessionId.trim().length === 0) {
    return undefined;
  }
  return { 'x-guest-session-id': guestSessionId.trim() };
}

export const bizAssistantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    bizAssistantChat: build.mutation<BizAssistantChatResponse, BizAssistantChatMutationArgs>({
      query: ({ guestSessionId, ...body }) => ({
        url: 'biz-assistant/chat',
        method: 'POST',
        body,
        headers: guestHeaders(guestSessionId),
      }),
      transformResponse: (response: unknown) => parseBizAssistantChatResponse(response),
    }),
    aiUsageStatus: build.mutation<AiUsageStatus, AiUsageStatusMutationArgs>({
      query: ({ headerGuestSessionId, ...body }) => ({
        url: 'ai-settings/usage/status',
        method: 'POST',
        body,
        headers: guestHeaders(headerGuestSessionId),
      }),
      transformResponse: (response: unknown) => parseAiUsageStatus(response),
    }),
  }),
});

export const { useBizAssistantChatMutation, useAiUsageStatusMutation } = bizAssistantApi;
