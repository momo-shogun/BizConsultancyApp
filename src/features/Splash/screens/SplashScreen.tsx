import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Dimensions, Image, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { SafeAreaWrapper } from '@/shared/components';

import splashLogo from '@/assets/lightlogo.png';

const SCREEN_WIDTH = Dimensions.get('window').width;
const LOGO_MAX_WIDTH = Math.min(SCREEN_WIDTH * 0.58, 300);

/** Base vertical gradient — multiple stops avoid a flat or harsh band between hues */
const BASE_GRADIENT_COLORS = [
  THEME.colors.splashGreen1,
  THEME.colors.splashGreen2,
  THEME.colors.splashGreen3,
  THEME.colors.splashGreen4,
] as const;

const BASE_GRADIENT_LOCATIONS = [0, 0.32, 0.65, 1] as const;

/** Soft highlight at top + light vignette at bottom for depth */
const OVERLAY_GRADIENT_COLORS = [
  'rgba(255,255,255,0.38)',
  'rgba(255,255,255,0.06)',
  'rgba(255,255,255,0)',
  'rgba(0,0,0,0.12)',
] as const;

const OVERLAY_LOCATIONS = [0, 0.25, 0.55, 1] as const;

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Splash>;

export function SplashScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace(ROUTES.Auth.Landing);
    }, 800);
    return () => clearTimeout(id);
  }, [navigation]);

  useEffect(() => {
    let cancelled = false;

    void AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled) return;

      if (reduceMotion) {
        logoOpacity.setValue(1);
        logoScale.setValue(1);
        return;
      }

      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 72,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      cancelled = true;
    };
  }, [logoOpacity, logoScale]);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.root}>
        <LinearGradient
          colors={[...BASE_GRADIENT_COLORS]}
          locations={[...BASE_GRADIENT_LOCATIONS]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[...OVERLAY_GRADIENT_COLORS]}
          locations={[...OVERLAY_LOCATIONS]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.overlay}
          pointerEvents="none"
        />
        <View style={styles.center}>
          <Animated.View
            style={[
              styles.logoWrap,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={splashLogo}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Biz Consultancy logo"
              accessibilityRole="image"
            />
          </Animated.View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[24],
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: LOGO_MAX_WIDTH,
    height: LOGO_MAX_WIDTH * 0.72,
  },
});
