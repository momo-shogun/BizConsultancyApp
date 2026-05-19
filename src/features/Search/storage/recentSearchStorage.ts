import MMKVStorage from 'react-native-mmkv-storage';

import { MAX_RECENT_SEARCHES, SEARCH_MIN_QUERY_LENGTH } from '../constants/searchContent';

const STORAGE_KEY = 'biz.search.recent';

let storage: ReturnType<MMKVStorage.Loader['initialize']> | null = null;

function getStorage(): ReturnType<MMKVStorage.Loader['initialize']> {
  if (storage == null) {
    storage = new MMKVStorage.Loader().initialize();
  }
  return storage;
}

function parseRecentJson(raw: string | null | undefined): string[] {
  if (raw == null || raw.length === 0) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  } catch {
    return [];
  }
}

export async function loadRecentSearches(): Promise<string[]> {
  const raw = await getStorage().getStringAsync(STORAGE_KEY);
  return parseRecentJson(raw ?? undefined);
}

export async function saveRecentSearches(items: string[]): Promise<void> {
  const trimmed = items
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, MAX_RECENT_SEARCHES);
  await getStorage().setStringAsync(STORAGE_KEY, JSON.stringify(trimmed));
}

export async function addRecentSearch(query: string): Promise<string[]> {
  const term = query.trim();
  if (term.length < SEARCH_MIN_QUERY_LENGTH) {
    return loadRecentSearches();
  }
  const existing = await loadRecentSearches();
  const next = [term, ...existing.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(
    0,
    MAX_RECENT_SEARCHES,
  );
  await saveRecentSearches(next);
  return next;
}

export async function clearRecentSearches(): Promise<void> {
  await getStorage().removeItem(STORAGE_KEY);
}
