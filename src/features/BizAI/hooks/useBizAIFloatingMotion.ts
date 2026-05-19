import { useEffect } from 'react';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { bizAiVisibilityProgress } from '../engine/bizAiScrollBridge';

const TIMING = { duration: 260 };

export function useBizAIFloatingMotion(isTabVisible: boolean): {
  containerStyle: ReturnType<typeof useAnimatedStyle>;
  orbStyle: ReturnType<typeof useAnimatedStyle>;
  glowStyle: ReturnType<typeof useAnimatedStyle>;
} {
  const breathe = useSharedValue(1);
  const tabGate = useSharedValue(isTabVisible ? 1 : 0);

  useEffect(() => {
    tabGate.value = withTiming(isTabVisible ? 1 : 0, TIMING);
  }, [isTabVisible, tabGate]);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(withTiming(1.04, { duration: 2200 }), withTiming(1, { duration: 2200 })),
      -1,
      false,
    );
  }, [breathe]);

  const containerStyle = useAnimatedStyle(() => {
    const scrollProgress = bizAiVisibilityProgress.value;
    const gate = tabGate.value;

    const opacity = interpolate(scrollProgress, [0.55, 0.72, 1], [0, 0.88, 1], Extrapolation.CLAMP) * gate;
    const translateY = interpolate(scrollProgress, [0.55, 1], [28, 0], Extrapolation.CLAMP);
    const scale = interpolate(scrollProgress, [0.72, 1], [0.94, 1], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + (bizAiVisibilityProgress.value > 0.9 ? 0.25 : 0),
  }));

  return { containerStyle, orbStyle, glowStyle };
}
