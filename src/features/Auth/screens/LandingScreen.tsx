import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, SafeAreaWrapper } from '@/shared/components';

import landingBackground from '@/assets/background.png';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Landing>;

export function LandingScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.black} />
      <ImageBackground source={landingBackground} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay} />

        <View style={styles.content}>
          <View style={styles.centerCopy}>
            <Text style={styles.title}>Grow with experts</Text>
            <Text style={styles.subtitle}>Business consultancy, booking, and growth—made simple.</Text>
          </View>

          <View style={styles.actions}>
            <Button
              label="Log in"
              accessibilityLabel="Log in"
              onPress={() => navigation.navigate(ROUTES.Auth.ChooseAccountType, { next: 'login' })}
            />
            <Button
              label="Create account"
              accessibilityLabel="Create account"
              variant="secondary"
              onPress={() => navigation.navigate(ROUTES.Auth.ChooseAccountType, { next: 'signup' })}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: THEME.colors.landingOverlay,
  },
  content: {
    flex: 1,
    padding: THEME.spacing[24],
    justifyContent: 'space-between',
  },
  centerCopy: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  title: {
    fontSize: THEME.typography.size[28],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.onImageTextPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.typography.size[16],
    color: THEME.colors.onImageTextSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    gap: THEME.spacing[12],
  },
});

