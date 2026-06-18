import React, { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import {
  ACCOUNT_HUB_GREEN_HEADER_GRADIENT,
  ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR,
  ACCOUNT_HUB_LIST_CANVAS,
} from '@/constants/accountScreenTheme';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell, ScreenWrapper } from '@/shared/components';

import styles from './MymembershipCard.styles';

export function MyMembershipCardScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();

  const onBackPress = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return (
    <AccountHubScreenShell
      title="My Membership"
      canvasColor={ACCOUNT_HUB_LIST_CANVAS}
      headerColor={ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR}
      headerGradientColors={ACCOUNT_HUB_GREEN_HEADER_GRADIENT}
      onBackPress={onBackPress}
    >
      <ScreenWrapper style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.cardShimmerEdge} />

            <View style={styles.headerRow}>
              <View>
                <Text style={styles.planName}>Membership plan</Text>
                <Text style={styles.planMeta}>Add your membership details here</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Active</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Plan progress</Text>
                <Text style={styles.daysRemaining}>— days left</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
            </View>

            <View style={styles.remainingContainer}>
              <Text style={styles.remainingValue}>—</Text>
              <Text style={styles.remainingLabel}>days remaining</Text>
            </View>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AccountHubScreenShell>
  );
}

export default MyMembershipCardScreen;
