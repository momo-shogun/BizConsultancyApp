import { useMemo } from 'react';
import type { ComponentProps } from 'react';
import type Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetConsultantSelfBookingsQuery } from '@/features/Bookings/api/consultantSelfBookingsApi';
import type { ConsultantSelfBooking } from '@/features/Bookings/types/consultantSelfBooking.types';
import { groupConsultantBookingsByTab } from '@/features/Bookings/utils/consultantSelfBookingCategorize';
import { useGetConsultantReviewsQuery } from '@/features/ConsultantSelf/api/consultantSelfApi';
import {
  formatWalletBalanceInr,
  useGetConsultantWalletBalanceQuery,
} from '@/features/Home/api/userWalletsApi';

type StatIconName = ComponentProps<typeof Ionicons>['name'];

export interface ConsultantBusinessOverviewStat {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  icon: StatIconName;
  iconColor: string;
  iconBg: string;
  accentBorder: string;
  valueMuted?: boolean;
}

const REVIEWS_SAMPLE_LIMIT = 50;

function isConfirmedBooking(booking: ConsultantSelfBooking): boolean {
  if (booking.status.toLowerCase() === 'cancelled') {
    return false;
  }
  const payment = booking.paymentStatus.toLowerCase();
  return payment !== 'failed' && payment !== 'refunded';
}

function formatRatingValue(average: number | null, reviewCount: number): string {
  if (reviewCount <= 0 || average == null) {
    return '—';
  }
  return `${average.toFixed(1)} ★`;
}

export interface UseConsultantBusinessOverviewResult {
  stats: ConsultantBusinessOverviewStat[];
  isLoading: boolean;
}

export function useConsultantBusinessOverview(
  enabled: boolean,
): UseConsultantBusinessOverviewResult {
  const { data: bookings = [], isLoading: bookingsLoading } = useGetConsultantSelfBookingsQuery(
    undefined,
    { skip: !enabled },
  );

  const { data: reviewsPage, isLoading: reviewsLoading } = useGetConsultantReviewsQuery(
    { page: 1, limit: REVIEWS_SAMPLE_LIMIT },
    { skip: !enabled },
  );

  const { data: walletBalance, isLoading: walletLoading } = useGetConsultantWalletBalanceQuery(
    undefined,
    { skip: !enabled },
  );

  return useMemo((): UseConsultantBusinessOverviewResult => {
    const isLoading = bookingsLoading || reviewsLoading || walletLoading;

    const confirmedBookings = bookings.filter(isConfirmedBooking);
    const grouped = groupConsultantBookingsByTab(bookings);
    const upcomingCount = grouped.upcoming.length;

    const reviewRows = reviewsPage?.data ?? [];
    const reviewCount = reviewsPage?.meta.total ?? reviewRows.length;
    const averageRating =
      reviewRows.length > 0
        ? reviewRows.reduce((sum, review) => sum + review.rating, 0) / reviewRows.length
        : null;

    const reviewSubtitle =
      reviewCount === 0
        ? 'No client reviews yet.'
        : reviewCount === 1
          ? '1 client review on your profile.'
          : `${reviewCount.toLocaleString('en-IN')} client reviews on your profile.`;

    const stats: ConsultantBusinessOverviewStat[] = [
      {
        id: 'earnings',
        label: 'Total earnings',
        value:
          walletLoading && walletBalance == null
            ? '…'
            : formatWalletBalanceInr(walletBalance ?? 0),
        subtitle: 'Current balance in your consultant wallet.',
        icon: 'wallet-outline',
        iconColor: '#0D9488',
        iconBg: 'rgba(13,148,136,0.10)',
        accentBorder: '#0D9488',
        valueMuted: walletLoading && walletBalance == null,
      },
      {
        id: 'bookings',
        label: 'Total bookings',
        value: isLoading ? '…' : String(confirmedBookings.length),
        subtitle: 'Confirmed sessions across all time.',
        icon: 'calendar-outline',
        iconColor: '#2563EB',
        iconBg: 'rgba(37,99,235,0.10)',
        accentBorder: '#2563EB',
        valueMuted: isLoading,
      },
      {
        id: 'upcoming',
        label: 'Upcoming sessions',
        value: isLoading ? '…' : String(upcomingCount),
        subtitle: 'Next bookings on your calendar.',
        icon: 'time-outline',
        iconColor: '#D97706',
        iconBg: 'rgba(217,119,6,0.10)',
        accentBorder: '#D97706',
        valueMuted: isLoading,
      },
      {
        id: 'rating',
        label: 'Rating & review',
        value: isLoading ? '…' : formatRatingValue(averageRating, reviewCount),
        subtitle: reviewSubtitle,
        icon: 'star-outline',
        iconColor: '#7C3AED',
        iconBg: 'rgba(124,58,237,0.10)',
        accentBorder: '#7C3AED',
        valueMuted: isLoading || reviewCount === 0,
      },
    ];

    return { stats, isLoading };
  }, [bookings, bookingsLoading, reviewsLoading, reviewsPage, walletBalance, walletLoading]);
}
