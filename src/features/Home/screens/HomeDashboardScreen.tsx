import React from 'react';
import { StyleSheet, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { DashboardCard, SafeAreaWrapper, ScreenWrapper, SectionHeader } from '@/shared/components';
import { ZeptoHS } from './ZeptoHS/ZeptoHS';
import type { ZeptoTabCProps } from '../Tabs/ZeptoTabC.types';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function HomeDashboardScreen(): React.ReactElement {
  const tabStrip: ZeptoTabCProps = {
    tabs: [
      { id: 'all', label: 'All', icon: <Ionicons name="apps" size={22} color="#111" /> },
      { id: 'book', label: 'EDP', icon: <Ionicons name="calendar-outline" size={22} color="#111" /> },
      { id: 'pay', label: 'Payments', icon: <Ionicons name="card-outline" size={22} color="#111" /> },
      { id: 'help', label: 'Help', icon: <Ionicons name="help-circle-outline" size={22} color="#111" /> },
    ],
    defaultActiveIndex: 0,
  };

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ZeptoHS
        header={{
          backgroundColor: '#E6C8A4',
          etaLabel: 'Hi Krishna',
          addressLabel: 'Business setup • Tap to update address',
          walletLabel: '₹0',
          onAddressPress: () => undefined,
          onWalletPress: () => undefined,
          onProfilePress: () => undefined,
        }}
        tabStrip={tabStrip}
      >
        <ScreenWrapper style={styles.screen}>
          <SectionHeader title="Quick overview" subtitle="UI-only placeholders for now" />
          <View style={styles.cards}>
            <DashboardCard title="Upcoming bookings" value="0" hint="Once you book, they’ll show here." />
            <DashboardCard title="Wallet balance" value="₹0" hint="Top-up coming soon." />
          </View>
        </ScreenWrapper>
      </ZeptoHS>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: THEME.spacing[16],
    gap: THEME.spacing[16],
  },
  cards: {
    gap: THEME.spacing[12],
  },
});

