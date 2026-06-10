import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import {
  selectAccountRole,
  selectIsAuthenticated,
} from '@/features/Auth/store/authSelectors';
import { useGetConsultantSelfBookingsQuery } from '@/features/Bookings/api/consultantSelfBookingsApi';
import { useGetMyConsultantBookingsPageQuery } from '@/features/Bookings/api/myConsultantBookingsApi';
import type { ConsultantSelfBooking } from '@/features/Bookings/types/consultantSelfBooking.types';
import type { MyConsultantBooking } from '@/features/Bookings/types/myConsultantBooking.types';
import {
  buildBookingDateTime,
  formatBookingDate,
  hasBookingStarted,
  isBookingUpcoming,
} from '@/features/Bookings/utils/bookingDateTime';
import { getBookingConsultationKind } from '@/features/Bookings/utils/bookingDisplay';
import { CallController } from '@/features/Calls/controllers/CallController';
import { useGetPublicConsultantsQuery } from '@/features/consultant/api/consultantApi';
import { mapConsultantDetailToCardItem } from '@/features/consultant/utils/consultantMappers';
import {
  formatWalletBalanceLabel,
  useGetConsultantWalletBalanceQuery,
  useGetMyWalletBalanceQuery,
} from '@/features/Home/api/userWalletsApi';
import {
  DEFAULT_HOME_WORKSHOPS_QUERY,
  useGetPublicWorkshopsQuery,
} from '@/features/Home/api/workshopsApi';
import {
  useGetPublicMembershipsQuery,
  useGetPublicTestimonialsQuery,
} from '@/features/Home/api/homePublicApi';
import {
  filterMembershipsForHome,
  mapPublicMembershipsToPlanItems,
} from '@/features/Home/utils/membershipMappers';
import { mapPublicTestimonialsToCardItems } from '@/features/Home/utils/testimonialMappers';
import { mapPublicWorkshopsToEventSpotlightItems } from '@/features/Home/utils/workshopMappers';
import { applyHomeStatusBar, applyHomeStatusBarSoon } from '@/features/Home/utils/homeStatusBar';
import { darkenHex, ZEPTO_TABS_TRACK_DARKEN } from '@/utils/darkenHex';
import { useGetPublicServicesQuery } from '@/features/Services/api/servicesApi';
import { mapPublicServiceToCardItem } from '@/features/Services/utils/serviceMappers';
import { ROUTES } from '@/navigation/routeNames';
import { navigationRef } from '@/navigation/RootNavigator';
import type { AppTabParamList, RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';
import {
  InterestEventsSection,
  SafeAreaWrapper,
  UpcomingBookingsSection,
  TopConsultantsSection,
  RecommendedServicesSection,
  type EventSpotlightItem,
  type UpcomingBookingItem,
  type TopConsultantItem,
  type RecommendedServiceItem,
  type TestimonialItem,
  TestimonialsSection,
  type MembershipPlanItem,
  MembershipPlansSection,
} from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';
import type { HomeCategoryId, ZeptoHSShellColors } from './ZeptoHS/ZeptoHS.types';
import { ZeptoHS } from './ZeptoHS/ZeptoHS';

type HomeDashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, typeof ROUTES.App.Home>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HOME_TOP_CONSULTANTS_CARD_WIDTH = 184;
const HOME_TOP_CONSULTANTS_PAGE_SIZE = 6;
const HOME_WORKSHOP_CARD_WIDTH = 260;
const HOME_WORKSHOPS_PREVIEW_COUNT = 2;
const HOME_RECOMMENDED_SERVICES_CARD_WIDTH = 320;
const HOME_TESTIMONIALS_CARD_WIDTH = 260;
const HOME_MEMBERSHIP_PLANS_CARD_WIDTH = 360;
const HOME_UPCOMING_BOOKINGS_LIMIT = 5;
const BOOKING_VISIBLE_AFTER_START_MINUTES = 30;
const HOME_DEFAULT_SHELL_BG = '#E6C8A4';

function HomeSectionSkeleton(props: { compact?: boolean }): React.ReactElement {
  const compact = props.compact ?? false;
  return (
    <View style={styles.skeletonSection}>
      <View style={styles.skeletonHeaderRow}>
        <View style={[styles.skeletonHeaderTitle, compact ? styles.skeletonHeaderTitleCompact : null]} />
        <View style={styles.skeletonHeaderAction} />
      </View>
      <View style={styles.skeletonCardsRow}>
        <View style={[styles.skeletonCard, compact ? styles.skeletonCardCompact : null]} />
        <View style={[styles.skeletonCard, compact ? styles.skeletonCardCompact : null]} />
      </View>
    </View>
  );
}

function isStatusVisibleOnHome(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return normalized !== 'cancelled' && normalized !== 'canceled';
}

function isStatusVisibleForHomeUpcoming(
  status: string,
  bookingDate: string,
  slotTime: string,
  now: Date,
): boolean {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'completed') {
    return isBookingUpcoming(bookingDate, slotTime, now);
  }
  return isStatusVisibleOnHome(status);
}

function isBookingVisibleInHomeWindow(bookingDate: string, slotTime: string, now: Date): boolean {
  const start = buildBookingDateTime(bookingDate, slotTime);
  if (start == null) {
    return false;
  }
  const visibleUntil = start.getTime() + BOOKING_VISIBLE_AFTER_START_MINUTES * 60 * 1000;
  return now.getTime() <= visibleUntil;
}

function compareByStartTime(
  a: { bookingDate: string; slotTime: string },
  b: { bookingDate: string; slotTime: string },
): number {
  const aStart = buildBookingDateTime(a.bookingDate, a.slotTime)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const bStart = buildBookingDateTime(b.bookingDate, b.slotTime)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return aStart - bStart;
}

function extractBookingAvatarUrl(booking: MyConsultantBooking | ConsultantSelfBooking): string | undefined {
  if ('consultantId' in booking && 'consultantSlug' in booking) {
    return (
      booking.consultantImageUrl?.trim() ||
      booking.consultantImage?.trim() ||
      booking.consultantProfileImage?.trim() ||
      booking.profileImage?.trim() ||
      undefined
    );
  }
  return (
    booking.customerImageUrl?.trim() ||
    booking.customerImage?.trim() ||
    booking.profileImage?.trim() ||
    undefined
  );
}

function mapUserBookingToHomeItem(booking: MyConsultantBooking): UpcomingBookingItem {
  const consultationKind = getBookingConsultationKind(booking.consultationType);
  return {
    id: `user-${booking.id}`,
    bookingId: booking.id,
    dateLabel: formatBookingDate(booking.bookingDate),
    timeLabel: booking.slotTime,
    consultantName: booking.consultantName?.trim() || booking.name.trim() || 'Consultant',
    consultantImageUrl: extractBookingAvatarUrl(booking),
    consultantTitle: 'Consultation',
    callType: consultationKind === 'video' ? 'video' : 'audio',
    statusLabel: booking.status.trim() || 'Upcoming',
  };
}

function mapConsultantBookingToHomeItem(booking: ConsultantSelfBooking): UpcomingBookingItem {
  const consultationKind = getBookingConsultationKind(booking.consultationType);
  return {
    id: `consultant-${booking.id}`,
    bookingId: booking.id,
    dateLabel: formatBookingDate(booking.bookingDate),
    timeLabel: booking.slotTime,
    consultantName: booking.name.trim() || 'Client',
    consultantImageUrl: extractBookingAvatarUrl(booking),
    consultantTitle: 'Client session',
    callType: consultationKind === 'video' ? 'video' : 'audio',
    statusLabel: booking.status.trim() || 'Upcoming',
  };
}

export function HomeDashboardScreen(): React.ReactElement {
  const navigation = useNavigation<HomeDashboardNavigationProp>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accountRole = useAppSelector(selectAccountRole);
  const isConsultant = accountRole === 'consultant';
  const [activeShell, setActiveShell] = useState<ZeptoHSShellColors | null>(null);
  const [consultantsPageNumber, setConsultantsPageNumber] = useState(1);

  const {
    data: userWalletBalance,
    isLoading: isUserWalletLoading,
    isFetching: isUserWalletFetching,
  } = useGetMyWalletBalanceQuery(undefined, {
    skip: !isAuthenticated || isConsultant,
  });

  const {
    data: consultantWalletBalance,
    isLoading: isConsultantWalletLoading,
    isFetching: isConsultantWalletFetching,
  } = useGetConsultantWalletBalanceQuery(undefined, {
    skip: !isAuthenticated || !isConsultant,
  });

  const walletBalance = isConsultant ? consultantWalletBalance : userWalletBalance;
  const isWalletLoading = isConsultant
    ? isConsultantWalletLoading || isConsultantWalletFetching
    : isUserWalletLoading || isUserWalletFetching;

  const walletLabel = useMemo(
    () =>
      formatWalletBalanceLabel(walletBalance, {
        isLoading: isWalletLoading,
        isAuthenticated,
      }),
    [isAuthenticated, isWalletLoading, walletBalance],
  );

  const {
    data: consultantsResult,
    isLoading: isConsultantsLoading,
    isFetching: isConsultantsFetching,
  } = useGetPublicConsultantsQuery({
    page: String(consultantsPageNumber),
    limit: String(HOME_TOP_CONSULTANTS_PAGE_SIZE),
  });

  const {
    data: publicServices,
    isLoading: isServicesLoading,
    isFetching: isServicesFetching,
  } = useGetPublicServicesQuery({ limit: 6 });

  const {
    data: publicWorkshops,
    isLoading: isWorkshopsLoading,
    isFetching: isWorkshopsFetching,
  } = useGetPublicWorkshopsQuery(DEFAULT_HOME_WORKSHOPS_QUERY);

  const {
    data: publicTestimonials,
    isLoading: isTestimonialsLoading,
    isFetching: isTestimonialsFetching,
  } = useGetPublicTestimonialsQuery({ showOnHomescreen: true });

  const {
    data: publicMemberships,
    isLoading: isMembershipsLoading,
    isFetching: isMembershipsFetching,
  } = useGetPublicMembershipsQuery();
  const {
    data: myBookingsPage,
    isLoading: isUserBookingsLoading,
    isFetching: isUserBookingsFetching,
  } = useGetMyConsultantBookingsPageQuery(
    { page: 1, limit: 100 },
    { skip: !isAuthenticated || isConsultant },
  );
  const {
    data: consultantBookings,
    isLoading: isConsultantBookingsLoading,
    isFetching: isConsultantBookingsFetching,
  } = useGetConsultantSelfBookingsQuery(undefined, {
    skip: !isAuthenticated || !isConsultant,
  });

  const isUpcomingBookingsLoading = isAuthenticated
    ? isConsultant
      ? isConsultantBookingsLoading || isConsultantBookingsFetching
      : isUserBookingsLoading || isUserBookingsFetching
    : false;

  const isHomeSectionsLoading =
    isConsultantsLoading ||
    isConsultantsFetching ||
    isServicesLoading ||
    isServicesFetching ||
    isWorkshopsLoading ||
    isWorkshopsFetching ||
    isTestimonialsLoading ||
    isTestimonialsFetching ||
    isMembershipsLoading ||
    isMembershipsFetching;

  const topConsultantItems = useMemo((): TopConsultantItem[] => {
    const rows = consultantsResult?.items ?? [];
    return rows.map(mapConsultantDetailToCardItem);
  }, [consultantsResult?.items]);

  const recommendedServiceItems = useMemo((): RecommendedServiceItem[] => {
    const rows = publicServices?.items ?? [];
    return rows.map(mapPublicServiceToCardItem);
  }, [publicServices?.items]);

  const homeInterestItems = useMemo((): EventSpotlightItem[] => {
    const rows = publicWorkshops?.items ?? [];
    return mapPublicWorkshopsToEventSpotlightItems(rows).slice(0, HOME_WORKSHOPS_PREVIEW_COUNT);
  }, [publicWorkshops?.items]);

  const upcomingBookingItems = useMemo((): UpcomingBookingItem[] => {
    if (!isAuthenticated) {
      return [];
    }
    const now = new Date();
    if (isConsultant) {
      const rows = (consultantBookings ?? [])
        .filter((booking) =>
          isStatusVisibleForHomeUpcoming(booking.status, booking.bookingDate, booking.slotTime, now),
        )
        .filter((booking) => isBookingVisibleInHomeWindow(booking.bookingDate, booking.slotTime, now))
        .sort(compareByStartTime)
        .slice(0, HOME_UPCOMING_BOOKINGS_LIMIT);
      return rows.map(mapConsultantBookingToHomeItem);
    }

    const rows = (myBookingsPage?.data ?? [])
      .filter((booking) =>
        isStatusVisibleForHomeUpcoming(booking.status, booking.bookingDate, booking.slotTime, now),
      )
      .filter((booking) => isBookingVisibleInHomeWindow(booking.bookingDate, booking.slotTime, now))
      .sort(compareByStartTime)
      .slice(0, HOME_UPCOMING_BOOKINGS_LIMIT);
    return rows.map(mapUserBookingToHomeItem);
  }, [consultantBookings, isAuthenticated, isConsultant, myBookingsPage?.data]);

  const testimonialItems = useMemo((): TestimonialItem[] => {
    const rows = publicTestimonials ?? [];
    return mapPublicTestimonialsToCardItems(rows);
  }, [publicTestimonials]);

  const membershipPlanItems = useMemo((): MembershipPlanItem[] => {
    const rows = publicMemberships ?? [];
    const filtered = filterMembershipsForHome(rows, isAuthenticated, accountRole);
    return mapPublicMembershipsToPlanItems(filtered, {
      showMembershipTypeBadge: !isAuthenticated,
    });
  }, [publicMemberships, isAuthenticated, accountRole]);

  const onInterestViewAll = useCallback((): void => {
    navigation.navigate(ROUTES.Root.WorkshopsList);
  }, [navigation]);

  const onWorkshopPress = useCallback(
    (item: EventSpotlightItem): void => {
      if (item.slug.trim().length > 0) {
        navigation.navigate(ROUTES.Root.WorkshopsDetail, { slug: item.slug });
      }
    },
    [navigation],
  );

  const onTopConsultantsViewAll = useCallback((): void => {
    navigation.navigate(ROUTES.Root.ConsultantsList);
  }, [navigation]);

  const onTopConsultantsEndReached = useCallback((): void => {
    if (isConsultantsLoading || isConsultantsFetching) {
      return;
    }
    if (consultantsResult?.hasMore !== true) {
      return;
    }
    setConsultantsPageNumber((prev) => prev + 1);
  }, [consultantsResult?.hasMore, isConsultantsFetching, isConsultantsLoading]);

  const onConsultantPress = useCallback(
    (item: TopConsultantItem): void => {
      navigation.navigate(ROUTES.Root.ConsultantDetail, {
        slug: item.slug ?? item.id,
      });
    },
    [navigation],
  );

  const onRecommendedServicesViewAll = useCallback((): void => {
    navigation.navigate(ROUTES.App.Services, {
      screen: ROUTES.Services.List,
    });
  }, [navigation]);

  const onServicePress = useCallback(
    (item: RecommendedServiceItem): void => {
      navigation.navigate(ROUTES.App.Services, {
        screen: ROUTES.Services.Detail,
        params: { slug: item.slug },
      });
    },
    [navigation],
  );

  const onMembershipViewAll = useCallback((): void => {
    navigation.navigate(ROUTES.App.Account, { screen: ROUTES.Account.Membership });
  }, [navigation]);

  const onMembershipPress = useCallback((): void => {
    navigation.navigate(ROUTES.App.Account, { screen: ROUTES.Account.Membership });
  }, [navigation]);

  const onWalletPress = useCallback((): void => {
    if (isConsultant) {
      navigation.navigate(ROUTES.App.Account, {
        screen: ROUTES.Account.ConsultantWallet,
      });
      return;
    }
    if (navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.Root.Wallet);
    }
  }, [isConsultant, navigation]);

  const onProfilePress = useCallback((): void => {
    navigation.navigate(ROUTES.App.Account, { screen: ROUTES.Account.Home });
  }, [navigation]);

  const onUpcomingBookingsViewAll = useCallback((): void => {
    navigation.navigate(ROUTES.App.Account, {
      screen: isConsultant ? ROUTES.Account.ConsultantBookings : ROUTES.Account.MyBookings,
    });
  }, [isConsultant, navigation]);

  const onUpcomingBookingJoinCall = useCallback(
    async (item: UpcomingBookingItem): Promise<void> => {
      const bookingId = item.bookingId;
      if (bookingId == null) {
        return;
      }

      if (isConsultant) {
        const booking = (consultantBookings ?? []).find((row) => row.id === bookingId);
        if (booking == null) {
          showGlobalToast({ message: 'Booking details not found', variant: 'error' });
          return;
        }
        const error = await CallController.startOutgoingFromBooking(
          booking.id,
          booking.name,
          booking.consultationType,
          booking.bookingDate,
          booking.slotTime,
        );
        if (error != null) {
          showGlobalToast({ message: error, variant: 'error' });
        }
        return;
      }

      const booking = (myBookingsPage?.data ?? []).find((row) => row.id === bookingId);
      if (booking == null) {
        showGlobalToast({ message: 'Booking details not found', variant: 'error' });
        return;
      }
      const error = await CallController.startOutgoingFromUserBooking(booking);
      if (error != null) {
        showGlobalToast({ message: error, variant: 'error' });
      }
    },
    [consultantBookings, isConsultant, myBookingsPage?.data],
  );

  const isUpcomingBookingJoinEnabled = useCallback(
    (item: UpcomingBookingItem): boolean => {
      const bookingId = item.bookingId;
      if (bookingId == null) {
        return false;
      }

      if (isConsultant) {
        const booking = (consultantBookings ?? []).find((row) => row.id === bookingId);
        if (booking == null) {
          return false;
        }
        return hasBookingStarted(booking.bookingDate, booking.slotTime);
      }

      const booking = (myBookingsPage?.data ?? []).find((row) => row.id === bookingId);
      if (booking == null) {
        return false;
      }
      return hasBookingStarted(booking.bookingDate, booking.slotTime);
    },
    [consultantBookings, isConsultant, myBookingsPage?.data],
  );

  const zeptoHeader = useMemo(
    () => ({
      backgroundColor: HOME_DEFAULT_SHELL_BG,
      addressLabel: '',
      walletLabel,
      onAddressPress: (): void => undefined,
      onWalletPress,
      onProfilePress,
    }),
    [onProfilePress, onWalletPress, walletLabel],
  );

  const safeAreaBgColor = useMemo(
    () =>
      darkenHex(
        activeShell?.topTabsBackground ?? HOME_DEFAULT_SHELL_BG,
        ZEPTO_TABS_TRACK_DARKEN,
      ),
    [activeShell?.topTabsBackground],
  );

  const onShellColorsChange = useCallback((shell: ZeptoHSShellColors) => {
    setActiveShell(shell);
    applyHomeStatusBarSoon(
      darkenHex(shell.topTabsBackground, ZEPTO_TABS_TRACK_DARKEN),
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      applyHomeStatusBar(safeAreaBgColor);
    }, [safeAreaBgColor]),
  );

  useEffect(() => {
    applyHomeStatusBar(safeAreaBgColor);
  }, [safeAreaBgColor]);

  return (
    <SafeAreaWrapper
      edges={['top', 'bottom']}
      bgColor={safeAreaBgColor}
      contentBgColor={THEME.colors.background}
      statusBarStyle="dark-content"
    >
      <ZeptoHS header={zeptoHeader} onShellColorsChange={onShellColorsChange}>
        {(_categoryId: HomeCategoryId) => (
          <View style={styles.sheet}>
            {isUpcomingBookingsLoading && upcomingBookingItems.length === 0 ? (
              <HomeSectionSkeleton compact />
            ) : null}
            {isAuthenticated && upcomingBookingItems.length > 0 ? (
              <UpcomingBookingsSection
                title={isConsultant ? 'Upcoming sessions' : 'Upcoming bookings'}
                items={upcomingBookingItems}
                onViewAllPress={onUpcomingBookingsViewAll}
                onItemPress={onUpcomingBookingsViewAll}
                onJoinCallPress={(item) => {
                  void onUpcomingBookingJoinCall(item);
                }}
                isJoinCallEnabled={isUpcomingBookingJoinEnabled}
              />
            ) : null}

            {isHomeSectionsLoading &&
            homeInterestItems.length === 0 &&
            topConsultantItems.length === 0 &&
            recommendedServiceItems.length === 0 &&
            testimonialItems.length === 0 &&
            membershipPlanItems.length === 0 ? (
              <>
                <HomeSectionSkeleton />
                <HomeSectionSkeleton compact />
                <HomeSectionSkeleton />
              </>
            ) : null}
            {homeInterestItems.length > 0 ? (
              <InterestEventsSection
                cardWidth={HOME_WORKSHOP_CARD_WIDTH}
                items={homeInterestItems}
                onViewAllPress={onInterestViewAll}
                onItemPress={onWorkshopPress}
              />
            ) : null}

            {topConsultantItems.length > 0 ? (
              <TopConsultantsSection
                title="Top consultants"
                cardWidth={HOME_TOP_CONSULTANTS_CARD_WIDTH}
                items={topConsultantItems}
                onViewAllPress={onTopConsultantsViewAll}
                onItemPress={onConsultantPress}
                onBookPress={onConsultantPress}
                onEndReached={onTopConsultantsEndReached}
              />
            ) : null}
            {recommendedServiceItems.length > 0 ? (
              <RecommendedServicesSection
                title="Recommended services"
                cardWidth={HOME_RECOMMENDED_SERVICES_CARD_WIDTH}
                items={recommendedServiceItems}
                variant="accentPanel"
                onViewAllPress={onRecommendedServicesViewAll}
                onItemPress={onServicePress}
                onCtaPress={onServicePress}
              />
            ) : null}
            {testimonialItems.length > 0 ? (
              <TestimonialsSection
                title="Testimonials"
                cardWidth={HOME_TESTIMONIALS_CARD_WIDTH}
                items={testimonialItems}
              />
            ) : null}
            {membershipPlanItems.length > 0 ? (
              <MembershipPlansSection
                title="Membership plans"
                cardWidth={HOME_MEMBERSHIP_PLANS_CARD_WIDTH}
                items={membershipPlanItems}
                onViewAllPress={onMembershipViewAll}
                onItemPress={onMembershipPress}
                onCtaPress={onMembershipPress}
              />
            ) : null}
          </View>
        )}
      </ZeptoHS>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: THEME.colors.background,
    paddingTop: THEME.spacing[8],
    flexGrow: 1,
    gap: THEME.spacing[20],
  },
  skeletonSection: {
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  skeletonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonHeaderTitle: {
    height: 18,
    width: '52%',
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  skeletonHeaderTitleCompact: {
    width: '38%',
  },
  skeletonHeaderAction: {
    height: 14,
    width: 58,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  skeletonCardsRow: {
    flexDirection: 'row',
    gap: THEME.spacing[12],
  },
  skeletonCard: {
    height: 156,
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#EEF2F7',
  },
  skeletonCardCompact: {
    height: 132,
  },
});
