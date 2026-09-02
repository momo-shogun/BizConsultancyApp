import React, { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { premiumTabPalette } from './PremiumHorizontalTabBar.palette';
import { styles, TAB_METRICS } from './PremiumHorizontalTabBar.styles';
import type {
  PremiumHorizontalTabBarProps,
  PremiumTabBarTheme,
  PremiumTabIconName,
  PremiumTabItem,
} from './PremiumHorizontalTabBar.types';

const HAPTIC_OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
} as const;

type TabLayout = { x: number; width: number };

interface TabButtonProps<T extends string> {
  tab: PremiumTabItem<T>;
  isActive: boolean;
  theme: PremiumTabBarTheme;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

function getTabInnerStyle(isActive: boolean, theme: PremiumTabBarTheme): ViewStyle[] {
  const palette = premiumTabPalette[theme];

  if (!isActive) {
    return [styles.tabInner];
  }

  return [
    styles.tabInner,
    styles.tabInnerActive,
    { backgroundColor: palette.pillGradient[0] },
  ];
}

function TabButton<T extends string>({
  tab,
  isActive,
  theme = 'light',
  onPress,
  onLayout,
}: TabButtonProps<T>): React.ReactElement {
  const palette = premiumTabPalette[theme];
  const iconColor = isActive ? palette.activeIcon : palette.inactiveIcon;
  const labelColor = isActive ? palette.activeText : palette.inactiveText;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${tab.label} tab`}
      hitSlop={6}
      onLayout={onLayout}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabPressable,
        pressed ? styles.tabPressablePressed : null,
      ]}
    >
      <View style={getTabInnerStyle(isActive, theme)}>
        {tab.icon != null ? (
          <Ionicons name={tab.icon as PremiumTabIconName} size={TAB_METRICS.iconSize} color={iconColor} />
        ) : null}
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            isActive ? styles.tabLabelActive : null,
            { color: labelColor },
          ]}
        >
          {tab.label}
        </Text>
      </View>
    </Pressable>
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

  const activeIndex = tabs.findIndex(tab => tab.key === activeKey);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const scrollToTab = useCallback((index: number, animated = true): void => {
    const layout = layoutsRef.current[index];
    if (layout == null || layout.width <= 0) {
      return;
    }

    const targetX = Math.max(0, layout.x - TAB_METRICS.scrollPadH - 12);
    scrollRef.current?.scrollTo({ x: targetX, animated });
  }, []);

  useEffect(() => {
    layoutsRef.current = tabs.map(() => ({ x: 0, width: 0 }));
  }, [tabs]);

  useEffect(() => {
    const layout = layoutsRef.current[safeActiveIndex];
    if (layout != null && layout.width > 0) {
      scrollToTab(safeActiveIndex, true);
    }
  }, [safeActiveIndex, scrollToTab]);

  const handleTabLayout = useCallback(
    (index: number) =>
      (event: LayoutChangeEvent): void => {
        const { x, width } = event.nativeEvent.layout;
        layoutsRef.current[index] = { x, width };

        if (index === safeActiveIndex && width > 0) {
          scrollToTab(index, false);
        }
      },
    [safeActiveIndex, scrollToTab],
  );

  const handleTabPress = useCallback(
    (key: T, index: number): void => {
      ReactNativeHapticFeedback.trigger('impactLight', HAPTIC_OPTIONS);
      onTabPress(key);
      scrollToTab(index, true);
    },
    [onTabPress, scrollToTab],
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
        <View style={styles.track}>
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
