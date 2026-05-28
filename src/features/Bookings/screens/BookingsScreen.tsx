import React from 'react';
import { StyleSheet, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { EmptyState, SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

export function BookingsScreen(): React.ReactElement {
  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="EDP" />
      <ScreenWrapper style={styles.screen}>
        <View style={styles.center}>
          <EmptyState title="No bookings yet" description="Book a consultant and your sessions will show here." />
        </View>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: THEME.spacing[16],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
});

