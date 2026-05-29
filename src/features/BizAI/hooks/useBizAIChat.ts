import { useCallback, useEffect, useMemo, useState } from 'react';

import { selectHasVerifiedLogin } from '@/features/Auth/store/authSelectors';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';
import { showGlobalToast } from '@/shared/components/toast';

import { useAiUsageStatusMutation, useBizAssistantChatMutation } from '../api/bizAssistantApi';
import { BIZ_AI_RELATED_FALLBACK } from '../constants/bizAiSuggestions';
import {
  clearBizAiChatHistory,
  clearBizAiConversationId,
  ensureBizAiGuestSessionId,
  readBizAiChatHistory,
  readBizAiConversationId,
  writeBizAiChatHistory,
  writeBizAiConversationId,
} from '../storage/bizAiSessionStorage';
import type { BizAiChatMessage } from '../types/bizAiChat.types';
import type { AiUsageStatus } from '../types/bizAssistant.types';
import { parseAuthUserIdForBizAi, resolveResponseLabel } from '../utils/bizAssistantParsing';

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface UseBizAIChatResult {
  messages: BizAiChatMessage[];
  pendingQuery: string | null;
  relatedQuestions: string[];
  isAwaitingResponse: boolean;
  usageStatus: AiUsageStatus | null;
  usageBadgeLabel: string | null;
  hasChatHistory: boolean;
  sendMessage: (text: string) => Promise<void>;
  resetConversation: () => void;
}

export function useBizAIChat(): UseBizAIChatResult {
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const authUserId = useAppSelector((state) => state.auth.user?.id);

  const [guestSessionId, setGuestSessionId] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<BizAiChatMessage[]>([]);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [usageStatus, setUsageStatus] = useState<AiUsageStatus | null>(null);

  const [chat, { isLoading: isChatLoading }] = useBizAssistantChatMutation();
  const [fetchUsageStatus] = useAiUsageStatusMutation();

  const persistHistory = useCallback(
    async (nextMessages: BizAiChatMessage[], nextConversationId: string | null): Promise<void> => {
      await writeBizAiChatHistory({
        conversationId: nextConversationId,
        messages: nextMessages,
      });
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    void (async (): Promise<void> => {
      const [guestId, storedHistory, storedConversationId] = await Promise.all([
        ensureBizAiGuestSessionId(),
        readBizAiChatHistory(),
        readBizAiConversationId(),
      ]);
      if (cancelled) {
        return;
      }
      setGuestSessionId(guestId);
      const restoredConversationId =
        storedHistory.conversationId ?? storedConversationId ?? null;
      setConversationId(restoredConversationId);
      setMessages(storedHistory.messages);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshUsageStatus = useCallback(async (): Promise<void> => {
    if (guestSessionId.length === 0 && !hasVerifiedLogin) {
      return;
    }
    try {
      const status = await fetchUsageStatus({
        guestSessionId: hasVerifiedLogin ? undefined : guestSessionId,
        headerGuestSessionId: hasVerifiedLogin ? undefined : guestSessionId,
      }).unwrap();
      setUsageStatus(status);
    } catch {
      /* non-blocking */
    }
  }, [fetchUsageStatus, guestSessionId, hasVerifiedLogin]);

  useEffect(() => {
    void refreshUsageStatus();
  }, [refreshUsageStatus]);

  const usageBadgeLabel = useMemo((): string | null => {
    if (usageStatus == null) {
      return null;
    }
    if (hasVerifiedLogin) {
      const credits = usageStatus.remainingCredits;
      return credits > 0 ? `${credits} credits` : '0 credits';
    }
    const remaining = usageStatus.freeQuestionsRemaining;
    const limit = usageStatus.freeLimit;
    if (limit > 0) {
      return `${remaining}/${limit}`;
    }
    return remaining > 0 ? `${remaining} free` : null;
  }, [hasVerifiedLogin, usageStatus]);

  const relatedQuestions = useMemo((): string[] => {
    const lastAssistant = [...messages].reverse().find((row) => row.role === 'assistant');
    if (lastAssistant?.relatedQuestions != null && lastAssistant.relatedQuestions.length > 0) {
      return lastAssistant.relatedQuestions;
    }
    return [];
  }, [messages]);

  const resetConversation = useCallback((): void => {
    setMessages([]);
    setPendingQuery(null);
    setConversationId(null);
    void clearBizAiChatHistory();
    void clearBizAiConversationId();
  }, []);

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      const trimmed = text.trim();
      if (trimmed.length === 0 || isChatLoading) {
        return;
      }

      const userMessage: BizAiChatMessage = {
        id: createMessageId(),
        role: 'user',
        content: trimmed,
        createdAt: Date.now(),
      };
      const messagesWithUser = [...messages, userMessage];
      setMessages(messagesWithUser);
      setPendingQuery(trimmed);
      await persistHistory(messagesWithUser, conversationId);

      try {
        const result = await chat({
          message: trimmed,
          conversationId: conversationId ?? undefined,
          userId: hasVerifiedLogin ? parseAuthUserIdForBizAi(authUserId) : undefined,
          guestSessionId: hasVerifiedLogin ? undefined : guestSessionId,
        }).unwrap();

        let nextConversationId = conversationId;
        const apiConversationId = result.data.conversationId?.trim();
        if (apiConversationId != null && apiConversationId.length > 0) {
          nextConversationId = apiConversationId;
          setConversationId(apiConversationId);
          await writeBizAiConversationId(apiConversationId);
        }

        const assistantMessage: BizAiChatMessage = {
          id: createMessageId(),
          role: 'assistant',
          content: result.message.trim(),
          responseLabel: resolveResponseLabel(result._meta),
          relatedQuestions:
            result.data.relatedQuestions != null && result.data.relatedQuestions.length > 0
              ? result.data.relatedQuestions
              : BIZ_AI_RELATED_FALLBACK,
          createdAt: Date.now(),
        };
        const messagesWithAssistant = [...messagesWithUser, assistantMessage];
        setMessages(messagesWithAssistant);
        await persistHistory(messagesWithAssistant, nextConversationId);

        if (result.data.requiresPurchase === true) {
          showGlobalToast({
            variant: 'warning',
            message: 'You have used your free questions. Buy AI credits to continue.',
            position: 'bottom',
          });
        } else if (result.data.requiresLogin === true && !hasVerifiedLogin) {
          showGlobalToast({
            variant: 'info',
            message: 'Sign in to unlock more Biz AI questions and saved history.',
            position: 'bottom',
          });
        }

        void refreshUsageStatus();
      } catch (error: unknown) {
        const errorMessage: BizAiChatMessage = {
          id: createMessageId(),
          role: 'assistant',
          content: getApiErrorMessage(error, 'Something went wrong. Please try again in a moment.'),
          responseLabel: 'Error',
          relatedQuestions: BIZ_AI_RELATED_FALLBACK,
          createdAt: Date.now(),
        };
        const messagesWithError = [...messagesWithUser, errorMessage];
        setMessages(messagesWithError);
        await persistHistory(messagesWithError, conversationId);
        showGlobalToast({
          variant: 'error',
          message: getApiErrorMessage(error, 'Unable to reach Biz AI right now.'),
          position: 'bottom',
        });
      } finally {
        setPendingQuery(null);
      }
    },
    [
      authUserId,
      chat,
      conversationId,
      guestSessionId,
      hasVerifiedLogin,
      isChatLoading,
      messages,
      persistHistory,
      refreshUsageStatus,
    ],
  );

  return {
    messages,
    pendingQuery,
    relatedQuestions,
    isAwaitingResponse: isChatLoading,
    usageStatus,
    usageBadgeLabel,
    hasChatHistory: messages.length > 0,
    sendMessage,
    resetConversation,
  };
}
