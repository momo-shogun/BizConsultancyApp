import React, { useEffect, useRef } from 'react';
import { Animated, Image, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { THEME } from '@/constants/theme';

import splashLogo from '@/assets/lightlogo.png';

const BASE_GRADIENT_COLORS = [
  THEME.colors.splashGreen1,
  THEME.colors.splashGreen2,
  THEME.colors.splashGreen3,
  THEME.colors.splashGreen4,
] as const;

/**
 * Full-screen splash shown while MMKV rehydrates auth and restoreSession runs.
 * Prevents login/home flicker on cold start.
 */
export function SessionRestoreScreen(): React.ReactElement {
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [logoOpacity]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.splashGreen1} />
      <LinearGradient colors={[...BASE_GRADIENT_COLORS]} style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity }]}>
        <Image source={splashLogo} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.splashGreen1,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 48,
  },
});
