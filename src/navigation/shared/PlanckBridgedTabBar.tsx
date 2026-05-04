import React, { useEffect } from 'react';
import type { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PLANK_BAR_V1_BLUE } from '../tabNavigators/plankBarV1/plankBarV1.styles';

/** Spring config — snappy but smooth; matches iOS spring feel. */
const SPRING = { damping: 22, stiffness: 300, mass: 0.75 };

const plankV1 = {
  bar: PLANK_BAR_V1_BLUE,
  inactiveIcon: 'rgba(255, 255, 255, 0.85)',
  activePill: '#FFFFFF',
  activeForeground: '#0F172A',
  barRadiusBottom: 32,
  barRadiusTop: 14,
  iconSize: 20,
  labelSize: 12,
  labelMinScale: 0.82,
};

function tabDisplayTitle(options: BottomTabNavigationOptions, routeName: string): string {
  const barLabel = options.tabBarLabel;
  if (typeof barLabel === 'string' && barLabel.length > 0) return barLabel;
  const title = options.title;
  if (typeof title === 'string' && title.length > 0) return title;
  const tail = routeName.split('/').pop();
  return tail && tail.length > 0 ? tail : routeName;
}

// ─── Per-tab animated item ────────────────────────────────────────────────────

type AnimatedTabItemProps = {
  tabIndex: number;
  pillIndex: SharedValue<number>;
  activeIconEl: React.ReactElement | null;
  inactiveIconEl: React.ReactElement | null;
  displayTitle: string;
  onPress: () => void;
  onLongPress: () => void;
  a11yLabel: string;
  focused: boolean;
};

function AnimatedTabItem({
  tabIndex,
  pillIndex,
  activeIconEl,
  inactiveIconEl,
  displayTitle,
  onPress,
  onLongPress,
  a11yLabel,
  focused,
}: AnimatedTabItemProps): React.ReactElement {
  /**
   * `progress` runs from 0 (fully inactive) → 1 (fully active).
   * It tracks the animated pill position, so icons and labels cross-fade
   * smoothly as the pill slides through.
   */
  const progress = useDerivedValue(() =>
    interpolate(
      pillIndex.value,
      [tabIndex - 1, tabIndex, tabIndex + 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
  );

  /** Inactive icon fades out as pill arrives. */
  const inactiveIconAnim = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  /** Active (dark) icon fades in as pill arrives; sits on top via absolute. */
  const activeIconAnim = useAnimatedStyle(() => ({
    opacity: progress.value,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }));

  /**
   * Label slides in by expanding maxWidth and fading opacity.
   * maxWidth: 0 → 80 ensures it takes no layout space when inactive,
   * avoiding icon misalignment on inactive tabs.
   */
  const labelAnim = useAnimatedStyle(() => ({
    opacity: progress.value,
    maxWidth: interpolate(progress.value, [0, 0.4, 1], [0, 20, 80], Extrapolation.CLAMP),
    marginLeft: interpolate(progress.value, [0, 1], [0, 4], Extrapolation.CLAMP),
    overflow: 'hidden',
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={a11yLabel}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabCell}
    >
      <View style={styles.tabContent}>
        {/* Icon layer: inactive fades out, active fades in */}
        <View style={styles.iconBox}>
          <Animated.View style={inactiveIconAnim}>{inactiveIconEl}</Animated.View>
          <Animated.View style={activeIconAnim}>{activeIconEl}</Animated.View>
        </View>

        {/* Label: expands and fades in as pill arrives */}
        <Animated.Text
          style={[styles.activeLabel, labelAnim]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={plankV1.labelMinScale}
          allowFontScaling
        >
          {displayTitle}
        </Animated.Text>
      </View>
    </Pressable>
  );
}

// ─── Main bar ─────────────────────────────────────────────────────────────────

export type PlanckBridgedTabBarProps = BottomTabBarProps & {
  tabBarVariant?: 'plankBarV1';
};

export function PlanckBridgedTabBar({
  state,
  descriptors,
  navigation,
  tabBarVariant = 'plankBarV1',
}: PlanckBridgedTabBarProps): React.ReactElement | null {
  const insets = useSafeAreaInsets();
  const numTabs = state.routes.length;

  /** Total inner bar width — set via onLayout. */
  const barWidth = useSharedValue(0);

  /**
   * Animated tab index — drives both the pill position and icon/label
   * cross-fades. Springs to the selected index on every tab change.
   */
  const pillIndex = useSharedValue(state.index);

  useEffect(() => {
    pillIndex.value = withSpring(state.index, SPRING);
  }, [state.index, pillIndex]);

  /** Pill slides to `pillIndex * cellWidth` on the UI thread. */
  const pillStyle = useAnimatedStyle(() => {
    if (barWidth.value === 0) {
      return { opacity: 0, transform: [{ translateX: 0 }], width: 0 };
    }
    const cellW = barWidth.value / numTabs;
    return {
      opacity: 1,
      transform: [{ translateX: pillIndex.value * cellW }],
      width: cellW,
    };
  });

  if (tabBarVariant !== 'plankBarV1') return null;

  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View style={[styles.barShell, { paddingBottom: bottomPad }]}>
      <View
        style={styles.bar}
        onLayout={(e) => {
          barWidth.value = e.nativeEvent.layout.width;
        }}
      >
        {/* ── Sliding white pill (behind tabs via zIndex) ── */}
        <Animated.View
          pointerEvents="none"
          style={[styles.pillUnderlay, pillStyle]}
        >
          <View style={styles.pillShape} />
        </Animated.View>

        {/* ── Tab items ── */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const displayTitle = tabDisplayTitle(options, route.name);
          const a11yLabel = options.tabBarAccessibilityLabel ?? displayTitle;

          const onPress = (): void => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = (): void => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          const rawActive = options.tabBarIcon?.({
            focused: true,
            color: plankV1.activeForeground,
            size: plankV1.iconSize,
          });
          const rawInactive = options.tabBarIcon?.({
            focused: false,
            color: plankV1.inactiveIcon,
            size: plankV1.iconSize,
          });

          // tabBarIcon can return ReactNode; we only use ReactElement safely
          const activeIconEl = React.isValidElement(rawActive) ? rawActive : null;
          const inactiveIconEl = React.isValidElement(rawInactive) ? rawInactive : null;

          return (
            <AnimatedTabItem
              key={route.key}
              tabIndex={index}
              pillIndex={pillIndex}
              activeIconEl={activeIconEl}
              inactiveIconEl={inactiveIconEl}
              displayTitle={displayTitle}
              onPress={onPress}
              onLongPress={onLongPress}
              a11yLabel={a11yLabel}
              focused={focused}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  barShell: {
    width: '100%',
    paddingTop: 6,
    backgroundColor: plankV1.bar,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: plankV1.bar,
    borderTopLeftRadius: plankV1.barRadiusTop,
    borderTopRightRadius: plankV1.barRadiusTop,
    borderBottomLeftRadius: plankV1.barRadiusBottom,
    borderBottomRightRadius: plankV1.barRadiusBottom,
    paddingVertical: 8,
    minHeight: 52,
    overflow: 'hidden', // clips pill inside rounded corners
  },
  /** Absolute pill that slides behind tab content. */
  pillUnderlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    paddingVertical: 6,
    paddingHorizontal: 4,
    zIndex: 0,
    justifyContent: 'center',
  },
  pillShape: {
    flex: 1,
    backgroundColor: plankV1.activePill,
    borderRadius: 999,
  },
  tabCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // above the pill
    paddingHorizontal: 2,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Fixed-size container so icon never shifts as active/inactive icons swap. */
  iconBox: {
    width: plankV1.iconSize + 2,
    height: plankV1.iconSize + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeLabel: {
    fontSize: plankV1.labelSize,
    fontWeight: '700',
    color: plankV1.activeForeground,
  },
});
