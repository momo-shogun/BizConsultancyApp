import React, { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { premiumTabPalette } from './PremiumHorizontalTabBar.palette';
import { styles, TAB_METRICS } from './PremiumHorizontalTabBar.styles';
import type {
  PremiumHorizontalTabBarProps,
  PremiumTabIconName,
  PremiumTabItem,
} from './PremiumHorizontalTabBar.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HAPTIC_OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
} as const;

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 280,
  mass: 0.7,
} as const;

type TabLayout = { x: number; width: number };

interface TabButtonProps<T extends string> {
  tab: PremiumTabItem<T>;
  isActive: boolean;
  theme: PremiumHorizontalTabBarProps<T>['theme'];
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

function TabButton<T extends string>({
  tab,
  isActive,
  theme = 'light',
  onPress,
  onLayout,
}: TabButtonProps<T>): React.ReactElement {
  const palette = premiumTabPalette[theme ?? 'light'];
  const scale = useSharedValue(1);
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 220 });
  }, [isActive, progress]);

  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [palette.inactiveText, palette.activeText],
    ),
  }));

  const handlePressIn = (): void => {
    scale.value = withSpring(0.94, SPRING_CONFIG);
  };

  const handlePressOut = (): void => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  const iconColor = isActive ? palette.activeIcon : palette.inactiveIcon;

  return (
    <AnimatedPressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${tab.label} tab`}
      hitSlop={6}
      onLayout={onLayout}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.tabPressable, pressAnimatedStyle]}
    >
      <View style={styles.tabInner}>
        {tab.icon != null ? (
          <Ionicons name={tab.icon as PremiumTabIconName} size={TAB_METRICS.iconSize} color={iconColor} />
        ) : null}
        <Animated.Text
          numberOfLines={1}
          style={[styles.tabLabel, isActive ? styles.tabLabelActive : null, labelAnimatedStyle]}
        >
          {tab.label}
        </Animated.Text>
      </View>
    </AnimatedPressable>
  );
}

export function PremiumHorizontalTabBar<T extends string>({
  tabs,
  activeKey,
  onTabPress,
  theme = 'light',
  style,
  testID,
}: PremiumHorizontalTabBarProps<T>): React.ReactElement | null {
  const palette = premiumTabPalette[theme];
  const scrollRef = useRef<ScrollView>(null);
  const layoutsRef = useRef<TabLayout[]>([]);
  const pillX = useSharedValue(0);
  const pillW = useSharedValue(0);
  const pillReady = useSharedValue(0);

  const activeIndex = tabs.findIndex(tab => tab.key === activeKey);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const applyPill = useCallback(
    (index: number, instant: boolean): void => {
      const layout = layoutsRef.current[index];
      if (layout == null || layout.width <= 0) {
        return;
      }

      const duration = instant ? 0 : 280;
      pillX.value = withTiming(layout.x, { duration });
      pillW.value = withTiming(layout.width, { duration });
      pillReady.value = 1;
    },
    [pillReady, pillW, pillX],
  );

  const scrollToTab = useCallback((index: number): void => {
    const layout = layoutsRef.current[index];
    if (layout == null) {
      return;
    }

    const targetX = Math.max(0, layout.x - TAB_METRICS.scrollPadH - 12);
    scrollRef.current?.scrollTo({ x: targetX, animated: true });
  }, []);

  useEffect(() => {
    layoutsRef.current = tabs.map(() => ({ x: 0, width: 0 }));
  }, [tabs]);

  useEffect(() => {
    applyPill(safeActiveIndex, false);
    scrollToTab(safeActiveIndex);
  }, [safeActiveIndex, applyPill, scrollToTab]);

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pillReady.value,
    width: pillW.value,
    transform: [{ translateX: pillX.value }],
  }));

  const handleTabLayout = useCallback(
    (index: number) =>
      (event: LayoutChangeEvent): void => {
        const { x, width } = event.nativeEvent.layout;
        layoutsRef.current[index] = { x, width };

        if (index === safeActiveIndex && width > 0) {
          applyPill(index, pillReady.value === 0);
        }
      },
    [applyPill, pillReady, safeActiveIndex],
  );

  const handleTabPress = useCallback(
    (key: T, index: number): void => {
      ReactNativeHapticFeedback.trigger('impactLight', HAPTIC_OPTIONS);
      onTabPress(key);
      applyPill(index, false);
      scrollToTab(index);
    },
    [applyPill, onTabPress, scrollToTab],
  );

  if (tabs.length === 0) {
    return null;
  }

  return (
    <View
      testID={testID}
      style={[
        styles.shell,
        {
          backgroundColor: palette.shellBg,
          borderColor: palette.shellBorder,
          shadowColor: palette.shadow,
        },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={[styles.shellGlow, { backgroundColor: palette.glow }]}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.track, {  borderRadius: 14 }]}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pill,
              { shadowColor: palette.shadow },
              pillAnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={[...palette.pillGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pillGradient}
            />
            <View style={styles.pillShine} />
          </Animated.View>

          {tabs.map((tab, index) => (
            <TabButton
              key={tab.key}
              tab={tab}
              isActive={tab.key === activeKey}
              theme={theme}
              onLayout={handleTabLayout(index)}
              onPress={() => handleTabPress(tab.key, index)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
