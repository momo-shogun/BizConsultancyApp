import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { CallController } from '@/features/Calls/controllers/CallController';
import { useGetPublicConsultantsQuery } from '@/features/consultant/api/consultantApi';
import { mapConsultantDetailToCardItem } from '@/features/consultant/utils/consultantMappers';
import {
  DEFAULT_HOME_WORKSHOPS_QUERY,
  useGetPublicWorkshopsQuery,
} from '@/features/Home/api/workshopsApi';
import { mapPublicWorkshopsToEventSpotlightItems } from '@/features/Home/utils/workshopMappers';
import { useGetPublicServicesQuery } from '@/features/Services/api/servicesApi';
import { mapPublicServiceToCardItem } from '@/features/Services/utils/serviceMappers';
import { ROUTES } from '@/navigation/routeNames';
import type { AppTabParamList, RootStackParamList } from '@/navigation/types';
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
} from '@/shared/components';
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

export function HomeDashboardScreen(): React.ReactElement {
  const navigation = useNavigation<HomeDashboardNavigationProp>();

  const { data: consultantsPage } = useGetPublicConsultantsQuery({
    page: '1',
    limit: '2',
  });

  const { data: publicServices } = useGetPublicServicesQuery({ limit: 6 });

  const { data: publicWorkshops } = useGetPublicWorkshopsQuery(DEFAULT_HOME_WORKSHOPS_QUERY);

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

  const upcomingBookingItems = useMemo((): UpcomingBookingItem[] => [], []);

  const onInterestViewAll = useCallback((): void => {
    navigation.navigate(ROUTES.Root.WorkshopsList);
  }, [navigation]);

  const onWorkshopPress = useCallback(
    (item: EventSpotlightItem): void => {
      if (item.slug.trim().length > 0) {
        navigation.navigate(ROUTES.Root.WorkshopsDetail);
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

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="transparent">
      <ZeptoHS
        header={{
          backgroundColor: '#E6C8A4',
          addressLabel: 'Business setup • Tap to update address',
          walletLabel: '₹0',
          onAddressPress: () => undefined,
          onWalletPress: () => undefined,
          onProfilePress: () => undefined,
        }}
      >
        {(_categoryId: HomeCategoryId) => (
          <View style={styles.sheet}>
            {homeInterestItems.length > 0 ? (
              <InterestEventsSection
                cardWidth={HOME_WORKSHOP_CARD_WIDTH}
                items={homeInterestItems}
                onViewAllPress={onInterestViewAll}
                onItemPress={onWorkshopPress}
              />
            ) : null}
            {upcomingBookingItems.length > 0 ? (
              <UpcomingBookingsSection
                title="Upcoming bookings"
                items={upcomingBookingItems}
                onItemPress={() => undefined}
                onJoinCallPress={(item) => {
                  const bookingId = Number.parseInt(item.id.replace(/\D/g, ''), 10);
                  if (!Number.isFinite(bookingId) || bookingId <= 0) {
                    return;
                  }
                  void CallController.startOutgoingFromBooking(bookingId, item.consultantName).then(
                    (err) => {
                      if (err != null) {
                        console.warn('Join call:', err);
                      }
                    },
                  );
                }}
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
