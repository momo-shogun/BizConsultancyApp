export type BizAiChatRole = 'user' | 'assistant';

export interface BizAiChatMessage {
  id: string;
  role: BizAiChatRole;
  content: string;
  responseLabel?: string;
  relatedQuestions?: string[];
  createdAt: number;
}

export interface BizAiChatHistorySnapshot {
  conversationId: string | null;
  messages: BizAiChatMessage[];
}
