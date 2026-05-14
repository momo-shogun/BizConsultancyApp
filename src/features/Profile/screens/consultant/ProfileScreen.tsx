import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/app/providers/AuthProvider';
import { THEME } from '@/constants/theme';
import { Button, SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

export function ProfileScreen(): React.ReactElement {
  const { logout } = useAuth();

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Account" />
      <ScreenWrapper style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Your profile consultant </Text>
          <Text style={styles.subtitle}>UI-only placeholder</Text>
        </View>

        <Button label="Log out" accessibilityLabel="Log out" variant="secondary" onPress={logout} />
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: THEME.spacing[16],
    gap: THEME.spacing[16],
  },
  card: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
});

