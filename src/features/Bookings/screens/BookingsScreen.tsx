import React from 'react';
import { StyleSheet, View } from 'react-native';

import { selectAccountRole, selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { THEME } from '@/constants/theme';
import { EmptyState, SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

import { ConsultantBookingsScreen } from './ConsultantBookingsScreen';
import { MyBookingsScreen } from './MyBookingsScreen';

/**
 * Bookings hub: same APIs and screens as Account → My Bookings / Consultant Bookings.
 */
export function BookingsScreen(): React.ReactElement {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accountRole = useAppSelector(selectAccountRole);
  const isConsultant = accountRole === 'consultant';

  if (!isAuthenticated) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']}>
        <ScreenHeader title="Bookings" />
        <ScreenWrapper style={styles.screen}>
          <View style={styles.center}>
            <EmptyState
              title="Sign in to view bookings"
              description="Your consultant sessions and call actions will appear here."
            />
          </View>
        </ScreenWrapper>
      </SafeAreaWrapper>
    );
  }

  if (isConsultant) {
    return <ConsultantBookingsScreen />;
  }

  return <MyBookingsScreen />;
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
