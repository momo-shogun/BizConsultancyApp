import { useCallback, useEffect, useMemo, useState } from 'react';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { useLazyGetMyConsultantBookingsPageQuery } from '@/features/Bookings/api/myConsultantBookingsApi';
import type {
  BookingsFilter,
  MyConsultantBooking,
} from '@/features/Bookings/types/myConsultantBooking.types';
import { isBookingUpcoming } from '@/features/Bookings/utils/bookingDateTime';
import { dedupeBookings } from '@/features/Bookings/utils/myConsultantBookingParsing';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';

const PAGE_SIZE = 10;
const FETCH_LIMIT = 100;

export interface UseMyBookingsScreenResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  filter: BookingsFilter;
  search: string;
  page: number;
  totalPages: number;
  upcomingCount: number;
  pastCount: number;
  visibleBookings: MyConsultantBooking[];
  setFilter: (filter: BookingsFilter) => void;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  refresh: () => void;
}

export function useMyBookingsScreen(): UseMyBookingsScreenResult {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [filter, setFilter] = useState<BookingsFilter>('upcoming');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [allBookings, setAllBookings] = useState<MyConsultantBooking[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [fetchPage] = useLazyGetMyConsultantBookingsPageQuery();

  const loadAll = useCallback(
    async (mode: 'initial' | 'refresh'): Promise<void> => {
      if (!isAuthenticated) {
        setAllBookings([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (mode === 'initial') {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setErrorMessage(null);

      try {
        const first = await fetchPage({ page: 1, limit: FETCH_LIMIT }).unwrap();
        let combined = [...first.data];
        const totalPages = Math.max(1, first.meta.totalPages);

        if (totalPages > 1) {
          const pages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, idx) =>
              fetchPage({ page: idx + 2, limit: FETCH_LIMIT }).unwrap(),
            ),
          );
          for (const res of pages) {
            combined = combined.concat(res.data);
          }
        }

        setAllBookings(dedupeBookings(combined));
      } catch (err) {
        setAllBookings([]);
        setErrorMessage(getApiErrorMessage(err, 'Could not load bookings'));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [fetchPage, isAuthenticated],
  );

  useEffect(() => {
    void loadAll('initial');
  }, [loadAll]);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const searchedBookings = useMemo((): MyConsultantBooking[] => {
    const q = search.trim().toLowerCase();
    if (q.length === 0) {
      return allBookings;
    }
    return allBookings.filter(
      (b) =>
        (b.consultantName ?? '').toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q),
    );
  }, [allBookings, search]);

  const upcomingCount = useMemo(
    (): number =>
      searchedBookings.filter((b) => isBookingUpcoming(b.bookingDate, b.slotTime)).length,
    [searchedBookings],
  );

  const pastCount = useMemo(
    (): number =>
      searchedBookings.filter((b) => !isBookingUpcoming(b.bookingDate, b.slotTime)).length,
    [searchedBookings],
  );

  const filteredBookings = useMemo((): MyConsultantBooking[] => {
    return searchedBookings.filter((b) => {
      const upcoming = isBookingUpcoming(b.bookingDate, b.slotTime);
      return filter === 'upcoming' ? upcoming : !upcoming;
    });
  }, [searchedBookings, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleBookings = useMemo((): MyConsultantBooking[] => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, page]);

  const refresh = useCallback((): void => {
    void loadAll('refresh');
  }, [loadAll]);

  return {
    isAuthenticated,
    isLoading: isAuthenticated && isLoading && allBookings.length === 0,
    isRefreshing,
    errorMessage,
    filter,
    search,
    page,
    totalPages,
    upcomingCount,
    pastCount,
    visibleBookings,
    setFilter,
    setSearch,
    setPage,
    refresh,
  };
}
