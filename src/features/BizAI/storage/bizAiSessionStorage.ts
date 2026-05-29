import MMKVStorage from 'react-native-mmkv-storage';

import type { BizAiChatHistorySnapshot, BizAiChatMessage } from '../types/bizAiChat.types';

const GUEST_SESSION_KEY = 'biz-ai-guest-session-id';
const CONVERSATION_KEY = 'biz-rag-conversation-id';
const CHAT_HISTORY_KEY = 'biz-ai-chat-history';
const MAX_STORED_MESSAGES = 60;

let storage: ReturnType<MMKVStorage.Loader['initialize']> | null = null;

function getStorage(): ReturnType<MMKVStorage.Loader['initialize']> {
  if (storage == null) {
    storage = new MMKVStorage.Loader().initialize();
  }
  return storage;
}

function createGuestSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function ensureBizAiGuestSessionId(): Promise<string> {
  const mmkv = getStorage();
  const existing = await mmkv.getStringAsync(GUEST_SESSION_KEY);
  if (existing != null && existing.trim().length > 0) {
    return existing.trim();
  }
  const created = createGuestSessionId();
  await mmkv.setStringAsync(GUEST_SESSION_KEY, created);
  return created;
}

export async function readBizAiConversationId(): Promise<string | null> {
  const raw = await getStorage().getStringAsync(CONVERSATION_KEY);
  if (raw == null || raw.trim().length === 0) {
    return null;
  }
  return raw.trim();
}

export async function writeBizAiConversationId(conversationId: string): Promise<void> {
  const trimmed = conversationId.trim();
  if (trimmed.length === 0) {
    return;
  }
  await getStorage().setStringAsync(CONVERSATION_KEY, trimmed);
}

export async function clearBizAiConversationId(): Promise<void> {
  await getStorage().removeItem(CONVERSATION_KEY);
}

function isBizAiChatMessage(value: unknown): value is BizAiChatMessage {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    (row.role === 'user' || row.role === 'assistant') &&
    typeof row.content === 'string' &&
    typeof row.createdAt === 'number'
  );
}

export async function readBizAiChatHistory(): Promise<BizAiChatHistorySnapshot> {
  const raw = await getStorage().getStringAsync(CHAT_HISTORY_KEY);
  if (raw == null || raw.trim().length === 0) {
    return { conversationId: null, messages: [] };
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed == null || typeof parsed !== 'object') {
      return { conversationId: null, messages: [] };
    }
    const record = parsed as Record<string, unknown>;
    const conversationId =
      typeof record.conversationId === 'string' && record.conversationId.trim().length > 0
        ? record.conversationId.trim()
        : null;
    const messages = Array.isArray(record.messages)
      ? record.messages.filter(isBizAiChatMessage)
      : [];
    return { conversationId, messages };
  } catch {
    return { conversationId: null, messages: [] };
  }
}

export async function writeBizAiChatHistory(snapshot: BizAiChatHistorySnapshot): Promise<void> {
  const messages = snapshot.messages.slice(-MAX_STORED_MESSAGES);
  await getStorage().setStringAsync(
    CHAT_HISTORY_KEY,
    JSON.stringify({
      conversationId: snapshot.conversationId,
      messages,
    }),
  );
}

export async function clearBizAiChatHistory(): Promise<void> {
  await getStorage().removeItem(CHAT_HISTORY_KEY);
}
