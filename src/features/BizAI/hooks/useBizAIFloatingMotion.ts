import { useEffect } from 'react';
import {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { BIZ_AI_MOTION, BIZ_AI_SPRING } from '../constants/bizAiMotionConfig';
import {
  bizAiCompact,
  bizAiExpand,
  bizAiParallax,
  bizAiScrollActivity,
  bizAiScrollVelocityY,
  decayBizAIScrollActivity,
} from '../engine/bizAiScrollBridge';
import { computeBizAiMasterVisibility } from '../engine/bizAiVisibilityMotion';

export type BizAIFloatingMotionStyles = {
  hostStyle: ReturnType<typeof useAnimatedStyle>;
  hostAnimatedProps: ReturnType<typeof useAnimatedProps>;
  clusterStyle: ReturnType<typeof useAnimatedStyle>;
  capsuleStyle: ReturnType<typeof useAnimatedStyle>;
  orbStyle: ReturnType<typeof useAnimatedStyle>;
  glowStyle: ReturnType<typeof useAnimatedStyle>;
  shadowStyle: ReturnType<typeof useAnimatedStyle>;
};

export function useBizAIFloatingMotion(isTabVisible: boolean): BizAIFloatingMotionStyles {
  const tabGate = useSharedValue(isTabVisible ? 1 : 0);
  const breathe = useSharedValue(1);
  const hoverDrift = useSharedValue(0);

  useEffect(() => {
    tabGate.value = withSpring(isTabVisible ? 1 : 0, BIZ_AI_SPRING.tabGate);
  }, [isTabVisible, tabGate]);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.035, { duration: 2400 }),
        withTiming(1, { duration: 2400 }),
      ),
      -1,
      false,
    );
    hoverDrift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3200 }),
        withTiming(-1, { duration: 3200 }),
      ),
      -1,
      false,
    );
  }, [breathe, hoverDrift]);

  useFrameCallback((frame) => {
    'worklet';
    decayBizAIScrollActivity(frame.timeSincePreviousFrame ?? 16);
  });

  const hostStyle = useAnimatedStyle(() => {
    const vis = computeBizAiMasterVisibility(bizAiExpand.value, tabGate.value);
    const hidden = vis < BIZ_AI_MOTION.visibilityHitTestCutoff;

    return {
      opacity: vis,
      display: hidden ? 'none' : 'flex',
    };
  });

  const hostAnimatedProps = useAnimatedProps(() => {
    const vis = computeBizAiMasterVisibility(bizAiExpand.value, tabGate.value);
    return {
      pointerEvents: vis < BIZ_AI_MOTION.visibilityHitTestCutoff ? 'none' : 'box-none',
    };
  });

  const clusterStyle = useAnimatedStyle(() => {
    const vis = computeBizAiMasterVisibility(bizAiExpand.value, tabGate.value);
    const expand = bizAiExpand.value;
    const compact = bizAiCompact.value;
    const parallax = bizAiParallax.value;
    const activity = bizAiScrollActivity.value;
    const velocity = bizAiScrollVelocityY.value;

    const lag = (expand - parallax) * 12 * vis;
    const velocityPush =
      vis *
      interpolate(velocity, [-600, 0, 600], [8, 0, -5], Extrapolation.CLAMP);

    const compactScale = interpolate(compact, [0, 1], [1, 0.94], Extrapolation.CLAMP);
    const revealScale = interpolate(vis, [0, 1], [0.86, 1], Extrapolation.CLAMP);
    const hoverY = hoverDrift.value * (1 - activity) * 2 * vis;
    const translateY =
      interpolate(vis, [0, 1], [36 + lag, 0], Extrapolation.CLAMP) + velocityPush + hoverY;

    return {
      transform: [{ translateY }, { scale: compactScale * revealScale }],
    };
  });

  const capsuleStyle = useAnimatedStyle(() => {
    const vis = computeBizAiMasterVisibility(bizAiExpand.value, tabGate.value);
    const compact = bizAiCompact.value;
    const scaleX = interpolate(compact, [0, 1], [1, 0.88], Extrapolation.CLAMP);
    const labelOpacity = interpolate(compact, [0, 1], [1, 0.82], Extrapolation.CLAMP) * vis;

    return {
      opacity: vis * labelOpacity,
      transform: [{ scaleX: interpolate(vis, [0, 1], [0.92, scaleX], Extrapolation.CLAMP) }],
    };
  });

  const orbStyle = useAnimatedStyle(() => {
    const vis = computeBizAiMasterVisibility(bizAiExpand.value, tabGate.value);
    const activity = bizAiScrollActivity.value;
    const breatheScale = 1 + (breathe.value - 1) * vis;
    const activeBoost = 1 + activity * 0.04 * vis;

    return {
      opacity: vis,
      transform: [
        {
          scale:
            interpolate(vis, [0, 1], [0.82, 1], Extrapolation.CLAMP) * breatheScale * activeBoost,
        },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const vis = computeBizAiMasterVisibility(bizAiExpand.value, tabGate.value);
    const activity = bizAiScrollActivity.value;
    const baseGlow = interpolate(vis, [0, 1], [0, 0.68], Extrapolation.CLAMP);
    const activityGlow = activity * 0.16 * vis;
    const scale = interpolate(vis, [0, 1], [0.6, 1.08 + activity * 0.06], Extrapolation.CLAMP);

    return {
      opacity: baseGlow + activityGlow,
      transform: [{ scale }],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const vis = computeBizAiMasterVisibility(bizAiExpand.value, tabGate.value);

    return {
      shadowOpacity: vis * 0.32,
      shadowRadius: vis * 14,
      shadowOffset: {
        width: 0,
        height: vis * 10,
      },
      elevation: vis * 10,
    };
  });

  return {
    hostStyle,
    hostAnimatedProps,
    clusterStyle,
    capsuleStyle,
    orbStyle,
    glowStyle,
    shadowStyle,
  };
}

export function useBizAIPressMotion(): {
  pressStyle: ReturnType<typeof useAnimatedStyle>;
  onPressIn: () => void;
  onPressOut: () => void;
} {
  const pressScale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const onPressIn = (): void => {
    pressScale.value = withSpring(0.94, BIZ_AI_SPRING.press);
  };

  const onPressOut = (): void => {
    pressScale.value = withSpring(1, BIZ_AI_SPRING.press);
  };

  return { pressStyle, onPressIn, onPressOut };
}
