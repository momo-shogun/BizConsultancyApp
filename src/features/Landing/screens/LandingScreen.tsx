import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, SafeAreaWrapper, ScreenWrapper } from '@/shared/components';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Landing>;

export function LandingScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenWrapper style={styles.screen}>
        <View style={styles.hero}>
          <Text style={styles.title}>Grow with expert guidance</Text>
          <Text style={styles.subtitle}>
            Book consultants, manage services, and track your business journey.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            label="Log in"
            accessibilityLabel="Log in"
            onPress={() => navigation.navigate(ROUTES.Auth.Login)}
          />
          <Button
            label="Create account"
            accessibilityLabel="Create account"
            variant="secondary"
            onPress={() => navigation.navigate(ROUTES.Auth.Signup)}
          />
        </View>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: THEME.spacing[24],
    justifyContent: 'space-between',
  },
  hero: {
    marginTop: THEME.spacing[32],
    gap: THEME.spacing[8],
  },
  title: {
    fontSize: THEME.typography.size[28],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.typography.size[16],
    color: THEME.colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    gap: THEME.spacing[12],
  },
});

