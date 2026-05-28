import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
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
import { buildBookingDateTime, formatBookingDate } from '@/features/Bookings/utils/bookingDateTime';
import { getBookingConsultationKind } from '@/features/Bookings/utils/bookingDisplay';
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
import type { HomeCategoryId, ZeptoHSShellColors } from './ZeptoHS/ZeptoHS.types';
import { ZeptoHS } from './ZeptoHS/ZeptoHS';

type HomeDashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, typeof ROUTES.App.Home>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HOME_TOP_CONSULTANTS_CARD_WIDTH = 184;
const HOME_WORKSHOP_CARD_WIDTH = 260;
const HOME_WORKSHOPS_PREVIEW_COUNT = 2;
const HOME_RECOMMENDED_SERVICES_CARD_WIDTH = 320;
const HOME_TESTIMONIALS_CARD_WIDTH = 260;
const HOME_MEMBERSHIP_PLANS_CARD_WIDTH = 360;
const HOME_UPCOMING_BOOKINGS_LIMIT = 5;
const BOOKING_VISIBLE_AFTER_START_MINUTES = 30;
const HOME_DEFAULT_SHELL_BG = '#E6C8A4';

function isStatusVisibleOnHome(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return normalized !== 'completed' && normalized !== 'cancelled' && normalized !== 'canceled';
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

function mapUserBookingToHomeItem(booking: MyConsultantBooking): UpcomingBookingItem {
  const consultationKind = getBookingConsultationKind(booking.consultationType);
  return {
    id: `user-${booking.id}`,
    dateLabel: formatBookingDate(booking.bookingDate),
    timeLabel: booking.slotTime,
    consultantName: booking.consultantName?.trim() || booking.name.trim() || 'Consultant',
    consultantTitle: 'Consultation',
    callType: consultationKind === 'video' ? 'video' : 'audio',
    statusLabel: booking.status.trim() || 'Upcoming',
  };
}

function mapConsultantBookingToHomeItem(booking: ConsultantSelfBooking): UpcomingBookingItem {
  const consultationKind = getBookingConsultationKind(booking.consultationType);
  return {
    id: `consultant-${booking.id}`,
    dateLabel: formatBookingDate(booking.bookingDate),
    timeLabel: booking.slotTime,
    consultantName: booking.name.trim() || 'Client',
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

  const { data: consultantsPage } = useGetPublicConsultantsQuery({
    page: '1',
    limit: '2',
  });

  const { data: publicServices } = useGetPublicServicesQuery({ limit: 6 });

  const { data: publicWorkshops } = useGetPublicWorkshopsQuery(DEFAULT_HOME_WORKSHOPS_QUERY);

  const { data: publicTestimonials } = useGetPublicTestimonialsQuery({ showOnHomescreen: true });

  const { data: publicMemberships } = useGetPublicMembershipsQuery();
  const { data: myBookingsPage } = useGetMyConsultantBookingsPageQuery(
    { page: 1, limit: 100 },
    { skip: !isAuthenticated || isConsultant },
  );
  const { data: consultantBookings } = useGetConsultantSelfBookingsQuery(undefined, {
    skip: !isAuthenticated || !isConsultant,
  });

  const topConsultantItems = useMemo((): TopConsultantItem[] => {
    const rows = consultantsPage?.items ?? [];
    return rows.map(mapConsultantDetailToCardItem);
  }, [consultantsPage?.items]);

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
        .filter((booking) => isStatusVisibleOnHome(booking.status))
        .filter((booking) => isBookingVisibleInHomeWindow(booking.bookingDate, booking.slotTime, now))
        .sort(compareByStartTime)
        .slice(0, HOME_UPCOMING_BOOKINGS_LIMIT);
      return rows.map(mapConsultantBookingToHomeItem);
    }

    const rows = (myBookingsPage?.data ?? [])
      .filter((booking) => isStatusVisibleOnHome(booking.status))
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

  return (
    <SafeAreaWrapper
      edges={['top', 'bottom']}
      bgColor={safeAreaBgColor}
    >
      <ZeptoHS header={zeptoHeader} onShellColorsChange={setActiveShell}>
        {(_categoryId: HomeCategoryId) => (
          <View style={styles.sheet}>

            {isAuthenticated && upcomingBookingItems.length > 0 ? (
              <UpcomingBookingsSection
                title={isConsultant ? 'Upcoming sessions' : 'Upcoming bookings'}
                items={upcomingBookingItems}
                onViewAllPress={onUpcomingBookingsViewAll}
                onItemPress={onUpcomingBookingsViewAll}
              />
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
});
