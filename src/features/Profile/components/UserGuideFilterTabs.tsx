import React, { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { styles } from './UserGuideFilterTabs.styles';

export type UserGuideTabKey = 'videos' | 'faq';

const TABS: UserGuideTabKey[] = ['videos', 'faq'];

const LABELS: Record<UserGuideTabKey, string> = {
  videos: 'Videos',
  faq: 'FAQ',
};

const SPRING = { damping: 20, stiffness: 260, mass: 0.75 };

function tabToIndex(tab: UserGuideTabKey): number {
  return tab === 'videos' ? 0 : 1;
}

export interface UserGuideFilterTabsProps {
  activeTab: UserGuideTabKey;
  videosCount: number;
  faqCount: number;
  onTabChange: (tab: UserGuideTabKey) => void;
}

function countForTab(
  tab: UserGuideTabKey,
  counts: Pick<UserGuideFilterTabsProps, 'videosCount' | 'faqCount'>,
): number {
  return tab === 'videos' ? counts.videosCount : counts.faqCount;
}

export function UserGuideFilterTabs(props: UserGuideFilterTabsProps): React.ReactElement {
  const activeIndex = tabToIndex(props.activeTab);
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
    <View style={styles.shell}>
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
                <Text
                  style={[styles.tabLabel, active ? styles.tabLabelActive : null]}
                  numberOfLines={1}
                >
                  {LABELS[tab]}
                </Text>
                <View style={[styles.badge, active ? styles.badgeActive : null]}>
                  <Text style={[styles.badgeText, active ? styles.badgeTextActive : null]}>
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
