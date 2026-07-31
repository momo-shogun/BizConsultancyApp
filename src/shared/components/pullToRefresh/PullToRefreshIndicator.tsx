import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import {
  PTR_MAX_PULL,
  PTR_REFRESHING_OFFSET,
  PTR_SIZE,
  PTR_STROKE,
  PTR_THRESHOLD,
} from './pullToRefresh.constants';
import type { PullToRefreshIndicatorProps } from './pullToRefresh.types';

const SPIN_DURATION_MS = 720;
/** Mid forest green — reads clearly as logo brand (deep primary can look near-black). */
const LOGO_GREEN = THEME.colors.splashGreen3;
const DEFAULT_TINT = LOGO_GREEN;
const TRACK_GREEN = 'rgba(61,143,85,0.28)';

/**
 * Zepto-style pull indicator: scales in with pull distance, arc rotates with
 * progress, then spins continuously while refreshing.
 */
export function PullToRefreshIndicator(
  props: PullToRefreshIndicatorProps,
): React.ReactElement {
  const { pullProgress, refreshing, tintColor = DEFAULT_TINT, testID } = props;
  const spin = useSharedValue(0);
  const accent = tintColor.length > 0 ? tintColor : DEFAULT_TINT;

  useEffect(() => {
    return (): void => {
      cancelAnimation(spin);
    };
  }, [spin]);

  useAnimatedReaction(
    () => refreshing.value,
    (current, previous) => {
      if (current === 1 && previous !== 1) {
        spin.value = 0;
        spin.value = withRepeat(
          withTiming(360, { duration: SPIN_DURATION_MS, easing: Easing.linear }),
          -1,
          false,
        );
      } else if (current === 0 && previous === 1) {
        cancelAnimation(spin);
        spin.value = withTiming(0, { duration: 160 });
      }
    },
    [refreshing, spin],
  );

  const containerStyle = useAnimatedStyle(() => {
    const isRefreshing = refreshing.value === 1;
    const progress = Math.min(pullProgress.value, 1.35);
    const visible = isRefreshing || progress > 0.02;

    const pullTravel = interpolate(
      pullProgress.value * PTR_THRESHOLD,
      [0, PTR_THRESHOLD, PTR_MAX_PULL],
      [-8, PTR_REFRESHING_OFFSET, PTR_REFRESHING_OFFSET + 10],
      Extrapolation.CLAMP,
    );

    const translateY = isRefreshing ? PTR_REFRESHING_OFFSET : pullTravel;
    const scale = isRefreshing
      ? 1
      : interpolate(progress, [0, 0.35, 1], [0.55, 0.85, 1], Extrapolation.CLAMP);
    const opacity = isRefreshing
      ? 1
      : interpolate(progress, [0, 0.2, 0.55], [0, 0.55, 1], Extrapolation.CLAMP);

    return {
      opacity: visible ? opacity : 0,
      transform: [{ translateY }, { scale }],
    };
  });

  const ringStyle = useAnimatedStyle(() => {
    const isRefreshing = refreshing.value === 1;
    const progress = Math.min(pullProgress.value, 1);

    if (isRefreshing) {
      return {
        transform: [{ rotate: `${spin.value}deg` }],
      };
    }

    const rotate = interpolate(progress, [0, 1], [-120, 270], Extrapolation.CLAMP);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.anchor, containerStyle]}
      testID={testID}
    >
      <View style={styles.disc}>
        <Animated.View
          style={[
            styles.ring,
            { borderTopColor: accent, borderRightColor: accent },
            ringStyle,
          ]}
        />
        <View style={[styles.core, { backgroundColor: accent }]} />
      </View>
    </Animated.View>
  );
}

PullToRefreshIndicator.displayName = 'PullToRefreshIndicator';

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  disc: {
    width: PTR_SIZE,
    height: PTR_SIZE,
    borderRadius: PTR_SIZE / 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: PTR_SIZE,
    height: PTR_SIZE,
    borderRadius: PTR_SIZE / 2,
    borderWidth: PTR_STROKE,
    borderColor: TRACK_GREEN,
  },
  core: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 1,
  },
});
