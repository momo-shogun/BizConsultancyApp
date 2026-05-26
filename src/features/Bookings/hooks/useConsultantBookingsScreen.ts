import { useCallback, useEffect, useMemo, useState } from 'react';

import { useGetConsultantSelfBookingsQuery } from '@/features/Bookings/api/consultantSelfBookingsApi';
import type {
  ConsultantBookingsFilter,
  ConsultantSelfBooking,
} from '@/features/Bookings/types/consultantSelfBooking.types';
import {
  filterConsultantBookingsBySearch,
  groupConsultantBookingsByTab,
} from '@/features/Bookings/utils/consultantSelfBookingCategorize';

const PAGE_SIZE = 10;

export interface UseConsultantBookingsScreenResult {
  filter: ConsultantBookingsFilter;
  setFilter: (filter: ConsultantBookingsFilter) => void;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  upcomingCount: number;
  pastCount: number;
  visibleBookings: ConsultantSelfBooking[];
  totalPages: number;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => void;
  profileBooking: ConsultantSelfBooking | null;
  setProfileBooking: (booking: ConsultantSelfBooking | null) => void;
  callingBookingId: number | null;
  setCallingBookingId: (id: number | null) => void;
}

export function useConsultantBookingsScreen(): UseConsultantBookingsScreenResult {
  const [filter, setFilterState] = useState<ConsultantBookingsFilter>('upcoming');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [profileBooking, setProfileBooking] = useState<ConsultantSelfBooking | null>(null);
  const [callingBookingId, setCallingBookingId] = useState<number | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetConsultantSelfBookingsQuery();

  const bookings = data ?? [];

  const grouped = useMemo(() => groupConsultantBookingsByTab(bookings), [bookings]);

  const upcomingCount = grouped.upcoming.length;
  const pastCount = grouped.past.length;

  const filtered = useMemo(
    () => filterConsultantBookingsBySearch(grouped[filter], search),
    [filter, grouped, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visibleBookings = filtered.slice(start, start + PAGE_SIZE);

  const setFilter = useCallback((next: ConsultantBookingsFilter): void => {
    setFilterState(next);
    setPage(1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const refresh = useCallback((): void => {
    void refetch();
  }, [refetch]);

  const errorMessage = useMemo((): string | null => {
    if (!isError) {
      return null;
    }
    if (error != null && typeof error === 'object' && 'data' in error) {
      const data = (error as { data?: unknown }).data;
      if (typeof data === 'string' && data.trim().length > 0) {
        return data;
      }
    }
    return 'Could not load bookings. Pull to refresh.';
  }, [error, isError]);

  return {
    filter,
    setFilter,
    search,
    setSearch,
    page: safePage,
    setPage,
    upcomingCount,
    pastCount,
    visibleBookings,
    totalPages,
    isLoading: isLoading && data == null,
    isRefreshing: isFetching && !isLoading,
    errorMessage,
    refresh,
    profileBooking,
    setProfileBooking,
    callingBookingId,
    setCallingBookingId,
  };
}
