import React from 'react';
import { StyleSheet, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { DashboardCard, SafeAreaWrapper, ScreenWrapper, SectionHeader } from '@/shared/components';
import { ZeptoHS } from './ZeptoHS/ZeptoHS';

export function HomeDashboardScreen(): React.ReactElement {
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

