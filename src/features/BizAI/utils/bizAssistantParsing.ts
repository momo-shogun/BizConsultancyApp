import type {
  AiUsageStatus,
  BizAssistantAction,
  BizAssistantChatData,
  BizAssistantChatMeta,
  BizAssistantChatResponse,
} from '../types/bizAssistant.types';

const BIZ_ACTIONS: readonly BizAssistantAction[] = [
  'NONE',
  'BUY_SERVICE',
  'BUY_MEMBERSHIP',
  'BOOK_CONSULTANT',
  'BUY_DIAGNOSTIC',
  'BUY_EDP',
];

function readString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  return undefined;
}

function parseAction(value: unknown): BizAssistantAction {
  const raw = readString(value)?.toUpperCase() ?? 'NONE';
  return BIZ_ACTIONS.includes(raw as BizAssistantAction) ? (raw as BizAssistantAction) : 'NONE';
}

function parseRelatedQuestions(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 3);
  return items.length > 0 ? items : undefined;
}

function parseData(raw: unknown): BizAssistantChatData {
  if (raw == null || typeof raw !== 'object') {
    return {};
  }
  const record = raw as Record<string, unknown>;
  const conversationId = readString(record.conversationId) ?? undefined;
  const relatedQuestions = parseRelatedQuestions(record.relatedQuestions);
  const remainingCredits = readNumber(record.remainingCredits) ?? undefined;
  const freeQuestionsRemaining = readNumber(record.freeQuestionsRemaining) ?? undefined;
  const creditPerQuestion = readNumber(record.creditPerQuestion) ?? undefined;

  return {
    ...record,
    conversationId,
    relatedQuestions,
    requiresLogin: readBoolean(record.requiresLogin),
    requiresPurchase: readBoolean(record.requiresPurchase),
    remainingCredits,
    freeQuestionsRemaining,
    creditPerQuestion,
  };
}

function parseMeta(raw: unknown): BizAssistantChatMeta | undefined {
  if (raw == null || typeof raw !== 'object') {
    return undefined;
  }
  const record = raw as Record<string, unknown>;
  const source = readString(record.source) ?? undefined;
  const label = readString(record.label) ?? undefined;
  const language = readString(record.language) ?? undefined;
  if (source == null && label == null && language == null) {
    return undefined;
  }
  return { source, label, language };
}

export function parseBizAssistantChatResponse(data: unknown): BizAssistantChatResponse {
  if (data == null || typeof data !== 'object') {
    throw new Error('Invalid Biz Assistant response');
  }
  const record = data as Record<string, unknown>;
  const message =
    readString(record.message) ?? 'Sorry, I could not generate an answer. Please try again.';
  return {
    message,
    action: parseAction(record.action),
    data: parseData(record.data),
    _meta: parseMeta(record._meta),
  };
}

export function resolveResponseLabel(meta: BizAssistantChatMeta | undefined): string {
  const source = meta?.source?.toLowerCase();
  if (source === 'ai') {
    return 'AI Generated';
  }
  if (source === 'knowledge_base') {
    return 'Knowledge Based Answer';
  }
  const label = meta?.label?.trim();
  return label != null && label.length > 0 ? label : 'Answer';
}

export function parseAiUsageStatus(data: unknown): AiUsageStatus {
  if (data == null || typeof data !== 'object') {
    throw new Error('Invalid AI usage status response');
  }
  const record = data as Record<string, unknown>;
  return {
    isGuest: record.isGuest === true,
    freeLimit: readNumber(record.freeLimit) ?? 0,
    freeQuestionsUsed: readNumber(record.freeQuestionsUsed) ?? 0,
    freeQuestionsRemaining: readNumber(record.freeQuestionsRemaining) ?? 0,
    remainingCredits: readNumber(record.remainingCredits) ?? 0,
    creditPerQuestion: readNumber(record.creditPerQuestion) ?? 0,
  };
}

export function parseAuthUserIdForBizAi(userId: string | undefined): number | undefined {
  if (userId == null || userId.trim().length === 0) {
    return undefined;
  }
  const parsed = Number.parseInt(userId, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
}
