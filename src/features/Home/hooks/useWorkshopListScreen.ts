import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  useLazyGetPublicWorkshopsQuery,
  WORKSHOP_LIST_QUERY,
} from '@/features/Home/api/workshopsApi';
import type { PublicWorkshopApiRow } from '@/features/Home/types/publicWorkshopApi.types';
import {
  filterWorkshopsBySession,
  type WorkshopSessionFilter,
} from '@/features/Home/utils/workshopFilters';
import { mapPublicWorkshopsToEventSpotlightItems } from '@/features/Home/utils/workshopMappers';
import type { EventSpotlightItem } from '@/shared/components/cards/EventSpotlightCard/EventSpotlightCard';

function dedupeWorkshopRows(rows: PublicWorkshopApiRow[]): PublicWorkshopApiRow[] {
  const seen = new Set<number>();
  const result: PublicWorkshopApiRow[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) {
      continue;
    }
    seen.add(row.id);
    result.push(row);
  }
  return result;
}

export interface UseWorkshopListScreenResult {
  allWorkshopItems: EventSpotlightItem[];
  upcomingCount: number;
  pastCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  hasMore: boolean;
  totalCount: number;
  loadMore: () => void;
  refetch: () => void;
}

export function useWorkshopListScreen(): UseWorkshopListScreenResult {
  const [allRows, setAllRows] = useState<PublicWorkshopApiRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fetchPage] = useLazyGetPublicWorkshopsQuery();
  const requestLockRef = useRef(false);

  const hasMore = page < totalPages;

  const fetchWorkshopPage = useCallback(
    async (nextPage: number, mode: 'initial' | 'more'): Promise<void> => {
      if (requestLockRef.current) {
        return;
      }
      requestLockRef.current = true;

      if (mode === 'initial') {
        setIsLoading(true);
        setIsError(false);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const result = await fetchPage({
          ...WORKSHOP_LIST_QUERY,
          page: nextPage,
        }).unwrap();

        setTotalPages(Math.max(1, result.meta.totalPages));
        setTotalCount(result.meta.total);
        setPage(nextPage);
        setAllRows((prev) =>
          mode === 'initial' ? dedupeWorkshopRows(result.items) : dedupeWorkshopRows([...prev, ...result.items]),
        );
      } catch {
        if (mode === 'initial') {
          setAllRows([]);
          setPage(0);
          setTotalPages(1);
          setTotalCount(0);
        }
        setIsError(true);
      } finally {
        requestLockRef.current = false;
        if (mode === 'initial') {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [fetchPage],
  );

  const refetch = useCallback((): void => {
    void fetchWorkshopPage(1, 'initial');
  }, [fetchWorkshopPage]);

  const loadMore = useCallback((): void => {
    if (isLoading || isLoadingMore || isError || !hasMore) {
      return;
    }
    void fetchWorkshopPage(page + 1, 'more');
  }, [fetchWorkshopPage, hasMore, isError, isLoading, isLoadingMore, page]);

  useEffect(() => {
    void fetchWorkshopPage(1, 'initial');
  }, [fetchWorkshopPage]);

  const allWorkshopItems = useMemo(
    (): EventSpotlightItem[] => mapPublicWorkshopsToEventSpotlightItems(allRows),
    [allRows],
  );

  const upcomingCount = useMemo(
    (): number => filterWorkshopsBySession(allWorkshopItems, 'upcoming').length,
    [allWorkshopItems],
  );

  const pastCount = useMemo(
    (): number => filterWorkshopsBySession(allWorkshopItems, 'past').length,
    [allWorkshopItems],
  );

  return {
    allWorkshopItems,
    upcomingCount,
    pastCount,
    isLoading,
    isLoadingMore,
    isError,
    hasMore,
    totalCount,
    loadMore,
    refetch,
  };
}

export function getWorkshopSessionFilterLabel(
  filter: WorkshopSessionFilter,
  count: number,
  isFullyLoaded: boolean,
): string {
  const base = filter === 'upcoming' ? 'Upcoming' : 'Past sessions';
  if (!isFullyLoaded) {
    return base;
  }
  return `${base} (${count})`;
}
