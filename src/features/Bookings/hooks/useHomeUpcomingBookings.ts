import { useMemo } from 'react';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { useGetConsultantSelfBookingsQuery } from '@/features/Bookings/api/consultantSelfBookingsApi';
import { useGetMyConsultantBookingsPageQuery } from '@/features/Bookings/api/myConsultantBookingsApi';
import type { ConsultantSelfBooking } from '@/features/Bookings/types/consultantSelfBooking.types';
import type { MyConsultantBooking } from '@/features/Bookings/types/myConsultantBooking.types';
import {
  canJoinConsultantBookingFromHome,
  canJoinUserBookingFromHome,
  mapConsultantBookingToUpcomingItem,
  mapUserBookingToUpcomingItem,
  selectConsultantUpcomingBookingsForHome,
  selectUserUpcomingBookingsForHome,
} from '@/features/Bookings/utils/upcomingBookingMappers';
import type { UpcomingBookingItem } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

const HOME_BOOKINGS_FETCH_LIMIT = 100;

export type HomeUpcomingBookingEntry =
  | {
      kind: 'user';
      booking: MyConsultantBooking;
      item: UpcomingBookingItem;
      canJoinCall: boolean;
    }
  | {
      kind: 'consultant';
      booking: ConsultantSelfBooking;
      item: UpcomingBookingItem;
      canJoinCall: boolean;
    };

export interface UseHomeUpcomingBookingsResult {
  isConsultant: boolean;
  isLoading: boolean;
  entries: HomeUpcomingBookingEntry[];
  items: UpcomingBookingItem[];
}

export function useHomeUpcomingBookings(isConsultant: boolean): UseHomeUpcomingBookingsResult {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const {
    data: userBookingsPage,
    isLoading: isUserBookingsLoading,
    isFetching: isUserBookingsFetching,
  } = useGetMyConsultantBookingsPageQuery(
    { page: 1, limit: HOME_BOOKINGS_FETCH_LIMIT },
    { skip: !isAuthenticated || isConsultant },
  );

  const {
    data: consultantBookings,
    isLoading: isConsultantBookingsLoading,
    isFetching: isConsultantBookingsFetching,
  } = useGetConsultantSelfBookingsQuery(undefined, {
    skip: !isAuthenticated || !isConsultant,
  });

  const entries = useMemo((): HomeUpcomingBookingEntry[] => {
    if (!isAuthenticated) {
      return [];
    }

    if (isConsultant) {
      const upcoming = selectConsultantUpcomingBookingsForHome(consultantBookings ?? []);
      return upcoming.map((booking) => ({
        kind: 'consultant' as const,
        booking,
        item: mapConsultantBookingToUpcomingItem(booking),
        canJoinCall: canJoinConsultantBookingFromHome(booking),
      }));
    }

    const upcoming = selectUserUpcomingBookingsForHome(userBookingsPage?.data ?? []);
    return upcoming.map((booking) => ({
      kind: 'user' as const,
      booking,
      item: mapUserBookingToUpcomingItem(booking),
      canJoinCall: canJoinUserBookingFromHome(booking),
    }));
  }, [consultantBookings, isAuthenticated, isConsultant, userBookingsPage?.data]);

  const items = useMemo((): UpcomingBookingItem[] => entries.map((e) => e.item), [entries]);

  const isLoading =
    isAuthenticated &&
    (isConsultant
      ? isConsultantBookingsLoading && consultantBookings == null
      : isUserBookingsLoading && userBookingsPage == null);

  const isFetching = isConsultant ? isConsultantBookingsFetching : isUserBookingsFetching;

  return {
    isConsultant,
    isLoading: isLoading || (isAuthenticated && isFetching && entries.length === 0),
    entries,
    items,
  };
}
