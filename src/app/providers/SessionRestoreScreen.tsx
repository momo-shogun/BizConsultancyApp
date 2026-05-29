import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { THEME } from '@/constants/theme';



import splashLogo from '@/assets/bizWhite.png';



const SCREEN_WIDTH = Dimensions.get('window').width;
const LOGO_WIDTH = Math.min(SCREEN_WIDTH * 0.64, 320);



const BASE_GRADIENT_LOCATIONS = [0, 0.35, 0.65, 1] as const;

const OVERLAY_GRADIENT_COLORS = [
  'rgba(34,197,94,0.14)',
  'rgba(22,163,74,0.05)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0.15)',
] as const;

const BASE_GRADIENT_COLORS = [
  '#0f2d1a',
  '#0a2014',
  '#061510',
  '#030e08',
] as const;

const OVERLAY_LOCATIONS = [0, 0.25, 0.55, 1] as const;


export function SessionRestoreScreen(): React.ReactElement {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.96)).current;


  useEffect(() => {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [logoOpacity]);

  return (
    
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
    gap: THEME.spacing[10],
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_WIDTH * 0.74,
  },
});
