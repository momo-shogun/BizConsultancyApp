import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

export function WalletScreen(): React.ReactElement {
  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Wallet" />
      <ScreenWrapper style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.label}>Current balance</Text>
          <Text style={styles.value}>₹0</Text>
          <Text style={styles.hint}>Wallet features will be wired later.</Text>
        </View>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: THEME.spacing[16],
  },
  card: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  label: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.medium,
  },
  value: {
    fontSize: THEME.typography.size[28],
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.bold,
  },
  hint: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
});

