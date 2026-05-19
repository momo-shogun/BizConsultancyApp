import { useCallback, useEffect, useState } from 'react';

import {
  addRecentSearch,
  clearRecentSearches,
  loadRecentSearches,
} from '../storage/recentSearchStorage';

export interface UseRecentSearchesResult {
  recent: string[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  recordSearch: (query: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useRecentSearches(): UseRecentSearchesResult {
  const [recent, setRecent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refresh = useCallback(async (): Promise<void> => {
    const items = await loadRecentSearches();
    setRecent(items);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const recordSearch = useCallback(async (query: string): Promise<void> => {
    const next = await addRecentSearch(query);
    setRecent(next);
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    await clearRecentSearches();
    setRecent([]);
  }, []);

  return { recent, isLoading, refresh, recordSearch, clearAll };
}
