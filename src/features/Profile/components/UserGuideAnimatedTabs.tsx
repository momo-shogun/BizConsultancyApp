import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { IconProps } from 'react-native-vector-icons/Icon';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

const TAB_LABEL_INACTIVE = '#64748B';
const TAB_ACTIVE_TEXT = '#FFFFFF';
const TRACK_BG = '#EEF2F7';

const PILL_SPRING = {
  damping: 20,
  stiffness: 280,
  mass: 0.55,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
} as const;

const MICRO_SPRING = {
  damping: 22,
  stiffness: 320,
  mass: 0.4,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
} as const;

interface PillIndicatorProps {
  x: number;
  width: number;
  accentColor: string;
}

const AnimatedPillIndicator = React.memo(function AnimatedPillIndicator({
  x,
  width,
  accentColor,
}: PillIndicatorProps): React.ReactElement {
  const translateX = useSharedValue(x);
  const pillWidth = useSharedValue(width);

  useDerivedValue(() => {
    translateX.value = withSpring(x, PILL_SPRING);
    pillWidth.value = withSpring(width, PILL_SPRING);
  }, [x, width]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: pillWidth.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[tabStyles.pillIndicator, { backgroundColor: accentColor }, indicatorStyle]}
    />
  );
});

interface PillTabProps {
  label: string;
  icon: IconProps['name'];
  count?: number;
  isActive: boolean;
  onPress: () => void;
  onLayout: (x: number, width: number) => void;
}

const PillTab = React.memo(function PillTab({
  label,
  icon,
  count,
  isActive,
  onPress,
  onLayout,
}: PillTabProps): React.ReactElement {
  const active = useSharedValue(isActive ? 1 : 0);
  const pressed = useSharedValue(0);

  useDerivedValue(() => {
    active.value = withSpring(isActive ? 1 : 0, MICRO_SPRING);
  }, [isActive]);

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(active.value, [0, 1], [TAB_LABEL_INACTIVE, TAB_ACTIVE_TEXT]),
  }));

  const badgeBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      active.value,
      [0, 1],
      ['rgba(100, 116, 139, 0.12)', 'rgba(255, 255, 255, 0.22)'],
    ),
  }));

  const badgeTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(active.value, [0, 1], [TAB_LABEL_INACTIVE, TAB_ACTIVE_TEXT]),
  }));

  const pressStyle = useAnimatedStyle(() => {
    const isPressing = pressed.value === 1;
    return {
      transform: [
        {
          scale: withSpring(isPressing ? 0.97 : 1, {
            damping: 15,
            stiffness: 400,
            mass: 0.3,
          }),
        },
      ],
    };
  });

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${label}${count != null ? `, ${count} items` : ''}`}
      style={tabStyles.pillTab}
      onLayout={(e) => onLayout(e.nativeEvent.layout.x, e.nativeEvent.layout.width)}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      onPress={onPress}
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
    >
      <Animated.View style={[tabStyles.pillLabelWrap, pressStyle]}>
        <Ionicons
          name={icon}
          size={17}
          color={isActive ? TAB_ACTIVE_TEXT : TAB_LABEL_INACTIVE}
        />
        <Animated.Text style={[tabStyles.pillText, labelStyle]} numberOfLines={1}>
          {label}
        </Animated.Text>
        {count != null ? (
          <Animated.View style={[tabStyles.countBadge, badgeBgStyle]}>
            <Animated.Text style={[tabStyles.countText, badgeTextStyle]}>{count}</Animated.Text>
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
});

export type UserGuideTabKey = 'videos' | 'faq';

export interface UserGuideTabOption {
  key: UserGuideTabKey;
  label: string;
  icon: IconProps['name'];
  count?: number;
}

export interface UserGuideAnimatedTabsProps {
  tabs: UserGuideTabOption[];
  activeKey: UserGuideTabKey;
  onChange: (key: UserGuideTabKey) => void;
  accentColor?: string;
}

export function UserGuideAnimatedTabs({
  tabs,
  activeKey,
  onChange,
  accentColor = THEME.colors.primary,
}: UserGuideAnimatedTabsProps): React.ReactElement {
  const activeIndex = tabs.findIndex((t) => t.key === activeKey);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const pillLayouts = useRef<Record<number, { x: number; width: number }>>({});
  const [indicatorLayout, setIndicatorLayout] = useState({ x: 0, width: 0 });

  const handleTabLayout = useCallback(
    (index: number, x: number, w: number) => {
      pillLayouts.current[index] = { x, width: w };
      if (index === safeActiveIndex) {
        setIndicatorLayout({ x, width: w });
      }
    },
    [safeActiveIndex],
  );

  const handleTabPress = useCallback(
    (index: number, key: UserGuideTabKey) => {
      const layout = pillLayouts.current[index];
      if (layout) {
        setIndicatorLayout(layout);
      }
      onChange(key);
    },
    [onChange],
  );

  return (
    <View style={tabStyles.shell}>
      <View style={tabStyles.track} accessibilityRole="tablist">
        <AnimatedPillIndicator
          x={indicatorLayout.x}
          width={indicatorLayout.width}
          accentColor={accentColor}
        />
        {tabs.map((tab, index) => (
          <PillTab
            key={tab.key}
            label={tab.label}
            icon={tab.icon}
            count={tab.count}
            isActive={index === safeActiveIndex}
            onPress={() => handleTabPress(index, tab.key)}
            onLayout={(x, w) => handleTabLayout(index, x, w)}
          />
        ))}
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  shell: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[14],
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: TRACK_BG,
    borderRadius: 14,
    padding: 4,
    minHeight: 48,
  },
  pillIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    borderRadius: 10,
    zIndex: 0,
  },
  pillTab: {
    flex: 1,
    zIndex: 1,
  },
  pillLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: THEME.spacing[8],
  },
  pillText: {
    fontSize: THEME.typography.size[13],
    fontWeight: '700',
    lineHeight: 17,
    letterSpacing: -0.2,
  },
  countBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
});
