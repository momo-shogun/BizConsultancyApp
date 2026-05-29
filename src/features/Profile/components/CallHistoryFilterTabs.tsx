import React, { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { styles } from './CallHistoryFilterTabs.styles';

export type CallHistoryStatusFilter = 'all' | 'completed' | 'missed';

const TABS: CallHistoryStatusFilter[] = ['all', 'completed', 'missed'];

const LABELS: Record<CallHistoryStatusFilter, string> = {
  all: 'All',
  completed: 'Completed',
  missed: 'Missed',
};

const SPRING = { damping: 20, stiffness: 260, mass: 0.75 };

function tabToIndex(tab: CallHistoryStatusFilter): number {
  if (tab === 'completed') {
    return 1;
  }
  if (tab === 'missed') {
    return 2;
  }
  return 0;
}

export interface CallHistoryFilterTabsProps {
  activeFilter: CallHistoryStatusFilter;
  allCount: number;
  completedCount: number;
  missedCount: number;
  onFilterChange: (filter: CallHistoryStatusFilter) => void;
}

function countForTab(
  tab: CallHistoryStatusFilter,
  counts: Pick<CallHistoryFilterTabsProps, 'allCount' | 'completedCount' | 'missedCount'>,
): number {
  if (tab === 'completed') {
    return counts.completedCount;
  }
  if (tab === 'missed') {
    return counts.missedCount;
  }
  return counts.allCount;
}

export function CallHistoryFilterTabs(props: CallHistoryFilterTabsProps): React.ReactElement {
  const activeIndex = tabToIndex(props.activeFilter);
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
        {TABS.map((tab, index) => {
          const active = index === activeIndex;
          const count = countForTab(tab, props);
          return (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => props.onFilterChange(tab)}
              style={({ pressed }) => [styles.tab, pressed ? styles.tabPressed : null]}
            >
              <Text style={[styles.tabLabel, active ? styles.tabLabelActive : null]} numberOfLines={1}>
                {LABELS[tab]}
              </Text>
              <View style={[styles.badge, active ? styles.badgeActive : null]}>
                <Text style={[styles.badgeText, active ? styles.badgeTextActive : null]}>{count}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
