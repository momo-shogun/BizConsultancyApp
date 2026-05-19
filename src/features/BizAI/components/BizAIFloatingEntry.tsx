import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';

import { useBizAIFloatingMotion } from '../hooks/useBizAIFloatingMotion';
import { useBizAIVisibility } from '../hooks/useBizAIVisibility';

const TAB_BAR_ESTIMATE = 62;
const FLOAT_BOTTOM_GAP = 14;

const GRADIENT_RING = ['#38BDF8', '#6366F1', '#A855F7', '#EC4899'];

function triggerTapHaptic(): void {
  ReactNativeHapticFeedback.trigger(Platform.OS === 'ios' ? 'impactLight' : 'keyboardTap');
}

export function BizAIFloatingEntry(): React.ReactElement | null {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const isVisible = useBizAIVisibility();
  const { containerStyle, orbStyle, glowStyle } = useBizAIFloatingMotion(isVisible);

  const bottomOffset = insets.bottom + TAB_BAR_ESTIMATE + FLOAT_BOTTOM_GAP;

  const openBizAI = useCallback((): void => {
    triggerTapHaptic();
    navigation.navigate(ROUTES.Root.BizAI);
  }, [navigation]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.host, { bottom: bottomOffset }, containerStyle]}
    >
      <Pressable
        onPress={openBizAI}
        accessibilityRole="button"
        accessibilityLabel="Open Biz AI assistant"
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.capsule}>
          <LinearGradient
            colors={['rgba(15,23,42,0.92)', 'rgba(30,41,59,0.88)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.capsuleInner}>
            <Ionicons name="sparkles" size={16} color="#E0E7FF" />
            <Text style={styles.label}>Biz AI</Text>
          </View>
        </View>

        <View style={styles.orbWrap}>
          <Animated.View style={[styles.glow, glowStyle]}>
            <LinearGradient
              colors={GRADIENT_RING}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glowGradient}
            />
          </Animated.View>
          <Animated.View style={[styles.orb, orbStyle]}>
            <LinearGradient
              colors={GRADIENT_RING}
              start={{ x: 0, y: 0.2 }}
              end={{ x: 1, y: 1 }}
              style={styles.orbRing}
            >
              <View style={styles.orbCore}>
                <Ionicons name="mic-outline" size={22} color={THEME.colors.white} />
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 200,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  capsule: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
      },
      default: { elevation: 10 },
    }),
  },
  capsuleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
    letterSpacing: 0.2,
  },
  orbWrap: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 26,
    opacity: 0.5,
    transform: [{ scale: 1.15 }],
  },
  glowGradient: {
    flex: 1,
    borderRadius: 26,
  },
  orb: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  orbRing: {
    flex: 1,
    borderRadius: 26,
    padding: 2.5,
  },
  orbCore: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
