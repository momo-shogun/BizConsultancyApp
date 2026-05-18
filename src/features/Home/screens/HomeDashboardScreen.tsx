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
import { DEMO_WORKSHOPS } from '@/features/Home/data/demoWorkshops';
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
  type TestimonialItem,
  TestimonialsSection,
  type TopConsultantItem,
  MembershipPlansSection,
  type MembershipPlanItem,
  type RecommendedServiceItem,
} from '@/shared/components';
import type { HomeCategoryId } from './ZeptoHS/ZeptoHS.types';
import { ZeptoHS } from './ZeptoHS/ZeptoHS';

type HomeDashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, typeof ROUTES.App.Home>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HOME_INTEREST_ITEMS: EventSpotlightItem[] = DEMO_WORKSHOPS.slice(0, 2);

const HOME_TOP_CONSULTANTS_CARD_WIDTH = 184;
const HOME_RECOMMENDED_SERVICES_CARD_WIDTH = 320;
const HOME_TESTIMONIALS_CARD_WIDTH = 260;
const HOME_MEMBERSHIP_PLANS_CARD_WIDTH = 360;

const HOME_TESTIMONIALS_DEMO_ITEMS: TestimonialItem[] = [
  {
    id: 't-victoria',
    quote: 'We prioritized a structured approach to enhance credit management features efficiently.',
    name: 'Victoria P.',
    role: 'Team lead',
    avatarUri:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&auto=format&fit=crop&q=80',
    accentStyleIndex: 0,
  },
  {
    id: 't-dmitry',
    quote: 'Iterative design sprints helped refine user experience based on continuous feedback.',
    name: 'Dmitry K.',
    role: 'UX/UI Designer',
    avatarUri:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
    accentStyleIndex: 1,
  },
];

const HOME_UPCOMING_BOOKINGS_DEMO_ITEMS: UpcomingBookingItem[] = [
  {
    id: 'BCG99763',
    dateLabel: '10/05/2026',
    timeLabel: '11:00–11:30',
    consultantName: 'Riya Sharma',
    consultantTitle: 'Startup & Compliance Consultant',
    callType: 'video',
    statusLabel: 'Upcoming',
  },
  {
    id: 'BCG99764',
    dateLabel: '12/05/2026',
    timeLabel: '16:00–16:30',
    consultantName: 'Aman Verma',
    consultantTitle: 'Funding & Pitch Advisor',
    callType: 'audio',
    statusLabel: 'Upcoming',
  },
];

const HOME_MEMBERSHIP_PLANS_DEMO_ITEMS: MembershipPlanItem[] = [
  {
    id: 'm-starter',
    audienceLabel: 'For individuals & solo founders',
    title: 'Starter',
    subtitle: 'Perfect to start with clarity',
    priceLabel: '₹999',
    periodLabel: '/mo',
    badgeLabel: 'Save 20%',
    ctaLabel: 'Get Starter',
    gradientColors: [THEME.colors.chooseAccountUserGrad1, THEME.colors.chooseAccountUserGrad2],
    features: [
      'Business idea validation',
      '1 expert call / month',
      'Basic compliance checklist',
      'Document templates',
      'Email support',
      'Monthly action plan',
    ],
  },
  {
    id: 'm-growth',
    audienceLabel: 'For growing teams',
    title: 'Growth',
    subtitle: 'Structured execution & tracking',
    priceLabel: '₹2,499',
    periodLabel: '/mo',
    badgeLabel: 'Most popular',
    ctaLabel: 'Choose Growth',
    gradientColors: [THEME.colors.chooseAccountConsultantGrad1, THEME.colors.chooseAccountConsultantGrad2],
    features: [
      '2 expert calls / month',
      'GST + compliance tracking',
      'Pitch deck review',
      'Monthly performance review',
      'Priority chat support',
      'Vendor & tools guidance',
    ],
  },
  {
    id: 'm-pro',
    audienceLabel: 'For scaling businesses',
    title: 'Pro',
    subtitle: 'Hands-on strategy + compliance',
    priceLabel: '₹4,999',
    periodLabel: '/mo',
    badgeLabel: 'Best value',
    ctaLabel: 'Go Pro',
    gradientColors: [THEME.colors.splashGreen3, THEME.colors.splashGreen4],
    features: [
      'Weekly advisory call',
      'Dedicated compliance manager',
      'Funding & pitch roadmap',
      'SOPs & operations guidance',
      'Fast-track support',
      'Quarterly strategy plan',
    ],
  },
];

export function HomeDashboardScreen(): React.ReactElement {
  const navigation = useNavigation<HomeDashboardNavigationProp>();

  const { data: consultantsPage } = useGetPublicConsultantsQuery({
    page: '1',
    limit: '2',
  });

  const { data: publicServices } = useGetPublicServicesQuery({ limit: 6 });

  const topConsultantItems = useMemo((): TopConsultantItem[] => {
    const rows = consultantsPage?.items ?? [];
    return rows.map(mapConsultantDetailToCardItem);
  }, [consultantsPage?.items]);

  const recommendedServiceItems = useMemo((): RecommendedServiceItem[] => {
    const rows = publicServices?.items ?? [];
    return rows.map(mapPublicServiceToCardItem);
  }, [publicServices?.items]);

  const homeInterestItems = useMemo(() => HOME_INTEREST_ITEMS, []);

  const onInterestViewAll = useCallback((): void => {
    navigation.navigate(ROUTES.Root.WorkshopsList);
  }, [navigation]);

  const onBookingsViewAll = useCallback(() => {
    console.log('View all bookings');
  }, []);

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

  const onTestimonialsViewAll = useCallback(() => {
    console.log('View all testimonials');
  }, []);

  const onMembershipViewAll = useCallback(() => {
    console.log('View all memberships');
  }, []);

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
            <InterestEventsSection
              items={homeInterestItems}
              onViewAllPress={onInterestViewAll}
              onItemPress={(item: EventSpotlightItem) =>
                console.log('Workshop clicked', item.id, item.slug)
              }
            />
            <UpcomingBookingsSection
              title="Upcoming bookings"
              items={HOME_UPCOMING_BOOKINGS_DEMO_ITEMS}
              onViewAllPress={onBookingsViewAll}
              onItemPress={(item) => console.log('Open booking', item.id)}
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
            <TopConsultantsSection
              title="Top consultants"
              cardWidth={HOME_TOP_CONSULTANTS_CARD_WIDTH}
              items={topConsultantItems}
              onViewAllPress={onTopConsultantsViewAll}
              onItemPress={onConsultantPress}
              onBookPress={onConsultantPress}
            />
            <RecommendedServicesSection
              title="Recommended services"
              cardWidth={HOME_RECOMMENDED_SERVICES_CARD_WIDTH}
              items={recommendedServiceItems}
              variant="accentPanel"
              onViewAllPress={onRecommendedServicesViewAll}
              onItemPress={onServicePress}
              onCtaPress={onServicePress}
            />
            <TestimonialsSection
              title="Testimonials"
              cardWidth={HOME_TESTIMONIALS_CARD_WIDTH}
              items={HOME_TESTIMONIALS_DEMO_ITEMS}
              onViewAllPress={onTestimonialsViewAll}
              onItemPress={(item) => console.log('Open testimonial', item.id)}
            />
            <MembershipPlansSection
              title="Membership plans"
              cardWidth={HOME_MEMBERSHIP_PLANS_CARD_WIDTH}
              items={HOME_MEMBERSHIP_PLANS_DEMO_ITEMS}
              onViewAllPress={onMembershipViewAll}
              onItemPress={(item) => console.log('Open membership', item.id)}
              onCtaPress={(item) => console.log('Select membership', item.id)}
            />
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
