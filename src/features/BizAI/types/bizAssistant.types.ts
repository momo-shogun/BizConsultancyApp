export type BizAssistantAction =
  | 'NONE'
  | 'BUY_SERVICE'
  | 'BUY_MEMBERSHIP'
  | 'BOOK_CONSULTANT'
  | 'BUY_DIAGNOSTIC'
  | 'BUY_EDP';

export type BizAssistantResponseSource = 'knowledge_base' | 'ai';

export interface BizAssistantChatRequest {
  message: string;
  serviceId?: number;
  conversationId?: string;
  userId?: number;
}

export interface BizAssistantChatMeta {
  source?: BizAssistantResponseSource | string;
  label?: string;
  language?: 'english' | 'hindi' | 'hinglish' | string;
}

export interface BizAssistantChatData {
  conversationId?: string;
  relatedQuestions?: string[];
  requiresLogin?: boolean;
  requiresPurchase?: boolean;
  remainingCredits?: number;
  freeQuestionsRemaining?: number;
  creditPerQuestion?: number;
  [key: string]: unknown;
}

export interface BizAssistantChatResponse {
  message: string;
  action: BizAssistantAction;
  data: BizAssistantChatData;
  _meta?: BizAssistantChatMeta;
}

export interface BizAssistantChatMutationArgs extends BizAssistantChatRequest {
  guestSessionId?: string;
}

export interface AiUsageStatus {
  isGuest: boolean;
  freeLimit: number;
  freeQuestionsUsed: number;
  freeQuestionsRemaining: number;
  remainingCredits: number;
  creditPerQuestion: number;
}

export interface AiUsageStatusRequest {
  guestSessionId?: string;
}

export interface AiUsageStatusMutationArgs extends AiUsageStatusRequest {
  headerGuestSessionId?: string;
}
