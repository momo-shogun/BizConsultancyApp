import React, { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { MyServicesFilterTab } from '../types/myServices.types';

import { styles } from './MyServicesFilterTabs.styles';

/** Primary filters shown in the header sliding control */
export type MyServicesSlidingFilterTab = 'all' | 'action' | 'active';

const TABS: MyServicesSlidingFilterTab[] = ['all', 'action', 'active'];

const LABELS: Record<MyServicesSlidingFilterTab, string> = {
  all: 'All',
  action: 'Action needed',
  active: 'Active',
};

const SPRING = { damping: 20, stiffness: 260, mass: 0.75 };

function tabToIndex(tab: MyServicesSlidingFilterTab): number {
  if (tab === 'action') {
    return 1;
  }
  if (tab === 'active') {
    return 2;
  }
  return 0;
}

export interface MyServicesFilterTabsProps {
  activeTab: MyServicesFilterTab;
  allCount: number;
  actionCount: number;
  activeCount: number;
  onTabChange: (tab: MyServicesSlidingFilterTab) => void;
}

function countForTab(
  tab: MyServicesSlidingFilterTab,
  props: Pick<MyServicesFilterTabsProps, 'allCount' | 'actionCount' | 'activeCount'>,
): number {
  if (tab === 'action') {
    return props.actionCount;
  }
  if (tab === 'active') {
    return props.activeCount;
  }
  return props.allCount;
}

export function MyServicesFilterTabs(props: MyServicesFilterTabsProps): React.ReactElement {
  const slidingTab: MyServicesSlidingFilterTab =
    props.activeTab === 'action' || props.activeTab === 'active' ? props.activeTab : 'all';
  const activeIndex = tabToIndex(slidingTab);
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
              onPress={() => props.onTabChange(tab)}
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
