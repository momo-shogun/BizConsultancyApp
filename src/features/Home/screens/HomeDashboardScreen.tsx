import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { THEME } from '@/constants/theme';
import {
  DashboardCard,
  InterestEventsSection,
  SafeAreaWrapper,
  type EventSpotlightItem,
} from '@/shared/components';
import type { HomeCategoryId } from './ZeptoHS/ZeptoHS.types';
import { ZeptoHS } from './ZeptoHS/ZeptoHS';

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=960&q=80';
const SAMPLE_IMAGE_2 =
  'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=960&q=80';

const HOME_INTEREST_DEMO_ITEMS: EventSpotlightItem[] = [
  {
    id: '1',
    title: 'Community Garden Volunteering',
    locationLabel: '@ Rosewood Park',
    scheduleLabel: 'Wed, 15 Mar • 9:30 AM',
    tags: ['Environment', 'Sustainability'],
    imageSource: { uri: SAMPLE_IMAGE },
    organizer: { name: "Wy'east Foundation" },
    participants: {
      avatarSources: [
        { uri: 'https://i.pravatar.cc/100?img=12' },
        { uri: 'https://i.pravatar.cc/100?img=32' },
        { uri: 'https://i.pravatar.cc/100?img=45' },
      ],
      extraCount: 8,
    },
  },
  {
    id: '2',
    title: 'Founder Networking Breakfast',
    locationLabel: '@ Riverfront Hub',
    scheduleLabel: 'Sat, 22 Mar • 8:00 AM',
    tags: ['Networking'],
    imageSource: { uri: SAMPLE_IMAGE_2 },
    organizer: { name: 'Biz Consultancy Collective' },
    participants: {
      avatarSources: [
        { uri: 'https://i.pravatar.cc/100?img=5' },
        { uri: 'https://i.pravatar.cc/100?img=9' },
      ],
      extraCount: 14,
    },
  },
];

export function HomeDashboardScreen(): React.ReactElement {
  const onInterestViewAll = useCallback(() => {
    console.log('View all interests');
  }, []);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
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
              items={HOME_INTEREST_DEMO_ITEMS}
              onViewAllPress={onInterestViewAll}
            />

            <View style={styles.secondary}>
              <DashboardCard title="Upcoming bookings" value="0" hint="Once you book, they’ll show here." />
              <DashboardCard title="Wallet balance" value="₹0" hint="Top-up coming soon." />
            </View>
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
  secondary: {
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[12],
    paddingBottom: THEME.spacing[24],
  },
});
