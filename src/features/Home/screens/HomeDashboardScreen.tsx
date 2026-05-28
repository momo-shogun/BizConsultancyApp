import React, { useCallback, useMemo } from 'react';
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
import { useHomeUpcomingBookings } from '@/features/Bookings/hooks/useHomeUpcomingBookings';
import type { HomeUpcomingBookingEntry } from '@/features/Bookings/hooks/useHomeUpcomingBookings';
import { useUserBookingCall } from '@/features/Bookings/hooks/useUserBookingCall';
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
import type { HomeCategoryId } from './ZeptoHS/ZeptoHS.types';
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

export function HomeDashboardScreen(): React.ReactElement {
  const navigation = useNavigation<HomeDashboardNavigationProp>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accountRole = useAppSelector(selectAccountRole);
  const isConsultant = accountRole === 'consultant';

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

  const homeUpcomingBookings = useHomeUpcomingBookings(isConsultant);
  const { startCallFromBooking } = useUserBookingCall();

  const upcomingBookingEntriesById = useMemo((): Map<string, HomeUpcomingBookingEntry> => {
    const map = new Map<string, HomeUpcomingBookingEntry>();
    for (const entry of homeUpcomingBookings.entries) {
      map.set(entry.item.id, entry);
    }
    return map;
  }, [homeUpcomingBookings.entries]);

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

  const onUpcomingBookingJoinCall = useCallback(
    (item: UpcomingBookingItem): void => {
      const entry = upcomingBookingEntriesById.get(item.id);
      if (entry == null) {
        return;
      }

      if (!entry.canJoinCall) {
        showGlobalToast({
          message: isConsultant
            ? 'Call is available for confirmed upcoming phone or video sessions'
            : 'Call unlocks when your confirmed session slot starts',
          variant: 'error',
        });
        return;
      }

      if (entry.kind === 'user') {
        void startCallFromBooking(entry.booking, 'upcoming');
        return;
      }

      void CallController.startOutgoingFromBooking(
        entry.booking.id,
        entry.booking.name,
        entry.booking.consultationType,
      ).then((err) => {
        if (err != null) {
          showGlobalToast({ message: err, variant: 'error' });
        }
      });
    },
    [isConsultant, startCallFromBooking, upcomingBookingEntriesById],
  );

  const zeptoHeader = useMemo(
    () => ({
      backgroundColor: '#E6C8A4',
      addressLabel: '',
      walletLabel,
      onAddressPress: (): void => undefined,
      onWalletPress,
      onProfilePress,
    }),
    [onProfilePress, onWalletPress, walletLabel],
  );

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="transparent">
      <ZeptoHS header={zeptoHeader}>
        {(_categoryId: HomeCategoryId) => (
          <View style={styles.sheet}>

            {isAuthenticated && homeUpcomingBookings.items.length > 0 ? (
              <UpcomingBookingsSection
                title={isConsultant ? 'Upcoming sessions' : 'Upcoming bookings'}
                items={homeUpcomingBookings.items}
                onViewAllPress={onUpcomingBookingsViewAll}
                onItemPress={onUpcomingBookingsViewAll}
                onJoinCallPress={onUpcomingBookingJoinCall}
                isJoinCallEnabled={(item) =>
                  upcomingBookingEntriesById.get(item.id)?.canJoinCall === true
                }
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
