import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

const GRADIENT_RING = ['#38BDF8', '#6366F1', '#A855F7', '#EC4899'];

type BizAIOrbButtonProps = {
  size?: number;
  isListening?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

const DEFAULT_ORB_SIZE = 62;

export function BizAIOrbButton({
  size = DEFAULT_ORB_SIZE,
  isListening = false,
  onPress,
  accessibilityLabel = 'Tap to talk',
}: BizAIOrbButtonProps): React.ReactElement {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!isListening) {
      cancelAnimation(pulse);
      pulse.value = withTiming(1, { duration: 200 });
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      false,
    );
  }, [isListening, pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: isListening ? 0.85 : 0.55,
    transform: [{ scale: pulse.value * 1.08 }],
  }));

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isListening ? pulse.value : 1 }],
  }));

  const radius = size / 2;
  const iconSize = Math.round(size * 0.36);
  const halo = Math.round(size * 0.14);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.wrap, { width: size + halo * 2, height: size + halo * 2 }]}
    >
      <Animated.View style={[styles.glow, { borderRadius: radius + 6, margin: 2 }, glowStyle]}>
        <LinearGradient
          colors={GRADIENT_RING}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.glowFill, { borderRadius: radius + 6 }]}
        />
      </Animated.View>
      <Animated.View style={[styles.orb, { width: size, height: size, borderRadius: radius }, orbStyle]}>
        <LinearGradient
          colors={GRADIENT_RING}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={[styles.orbRing, { borderRadius: radius }]}
        >
          <View style={[styles.orbCore, { borderRadius: radius - 3 }]}>
            <Ionicons name="mic" size={iconSize} color={THEME.colors.white} />
            <View style={[styles.sparkle, { top: size * 0.14, right: size * 0.16 }]}>
              <Ionicons name="sparkles" size={10} color="#E0E7FF" />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  glowFill: {
    flex: 1,
  },
  orb: {
    overflow: 'hidden',
  },
  orbRing: {
    flex: 1,
    padding: 2,
  },
  orbCore: {
    flex: 1,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
});
