import React, { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { styles } from './ConsultantSlotTimeSegmentTabs.styles';

export type ConsultantSlotTimeTab = 'schedule' | 'daysOff';

const TABS: ConsultantSlotTimeTab[] = ['schedule', 'daysOff'];

const LABELS: Record<ConsultantSlotTimeTab, string> = {
  schedule: 'My schedule',
  daysOff: 'Days off',
};

const SPRING = { damping: 18, stiffness: 220, mass: 0.85 };

function tabToIndex(tab: ConsultantSlotTimeTab): number {
  return tab === 'schedule' ? 0 : 1;
}

interface SegmentTabButtonProps {
  label: string;
  badge?: number;
  active: boolean;
  onPress: () => void;
}

function SegmentTabButton(props: SegmentTabButtonProps): React.ReactElement {
  const { label, badge, active, onPress } = props;
  const showBadge = badge != null && badge > 0;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.tab, pressed ? styles.tabPressed : null]}
    >
      <Text
        style={[styles.tabLabel, active ? styles.tabLabelActive : null]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {label}
      </Text>
      {showBadge ? (
        <View style={[styles.badge, active ? styles.badgeActive : null]}>
          <Text style={[styles.badgeText, active ? styles.badgeTextActive : null]}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

interface ConsultantSlotTimeSegmentTabsProps {
  activeTab: ConsultantSlotTimeTab;
  daysOffCount: number;
  onTabChange: (tab: ConsultantSlotTimeTab) => void;
}

export function ConsultantSlotTimeSegmentTabs(
  props: ConsultantSlotTimeSegmentTabsProps,
): React.ReactElement {
  const { activeTab, daysOffCount, onTabChange } = props;
  const activeIndex = tabToIndex(activeTab);

  const rowWidthRef = useRef(0);
  const pillX = useSharedValue(0);
  const pillW = useSharedValue(0);

  const movePill = useCallback(
    (index: number, instant: boolean) => {
      const rowW = rowWidthRef.current;
      if (rowW <= 0) {
        return;
      }
      const w = rowW / TABS.length;
      const x = index * w;
      if (instant) {
        pillX.value = x;
        pillW.value = w;
        return;
      }
      pillX.value = withSpring(x, SPRING);
      pillW.value = withSpring(w, SPRING);
    },
    [pillW, pillX],
  );

  useEffect(() => {
    movePill(activeIndex, rowWidthRef.current <= 0);
  }, [activeIndex, movePill]);

  const onRowLayout = useCallback(
    (event: LayoutChangeEvent) => {
      rowWidthRef.current = event.nativeEvent.layout.width;
      movePill(activeIndex, true);
    },
    [activeIndex, movePill],
  );

  const pillStyle = useAnimatedStyle(() => ({
    width: pillW.value,
    transform: [{ translateX: pillX.value }],
  }));

  return (
    <View style={styles.track} accessibilityRole="tablist">
      <View style={styles.row} onLayout={onRowLayout}>
        <Animated.View pointerEvents="none" style={[styles.pill, pillStyle]} />
        {TABS.map((tab, index) => (
          <SegmentTabButton
            key={tab}
            label={LABELS[tab]}
            badge={tab === 'daysOff' ? daysOffCount : undefined}
            active={index === activeIndex}
            onPress={() => onTabChange(tab)}
          />
        ))}
      </View>
    </View>
  );
}
