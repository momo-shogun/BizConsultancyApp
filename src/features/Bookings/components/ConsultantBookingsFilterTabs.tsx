import React, { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { ConsultantBookingsFilter } from '@/features/Bookings/types/consultantSelfBooking.types';

import { styles } from './ConsultantBookingsFilterTabs.styles';

const TABS: ConsultantBookingsFilter[] = ['upcoming', 'past'];

const SPRING = { damping: 18, stiffness: 220, mass: 0.85 };

interface FilterTabButtonProps {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}

function FilterTabButton(props: FilterTabButtonProps): React.ReactElement {
  const { label, count, active, onPress } = props;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.tab, pressed ? styles.tabPressed : null]}
    >
      <Text style={[styles.tabLabel, active ? styles.tabLabelActive : null]}>{label}</Text>
      <View style={[styles.badge, active ? styles.badgeActive : null]}>
        <Text style={[styles.badgeText, active ? styles.badgeTextActive : null]}>{count}</Text>
      </View>
    </Pressable>
  );
}

interface ConsultantBookingsFilterTabsProps {
  filter: ConsultantBookingsFilter;
  upcomingCount: number;
  pastCount: number;
  onFilterChange: (filter: ConsultantBookingsFilter) => void;
}

function filterToIndex(filter: ConsultantBookingsFilter): number {
  return filter === 'upcoming' ? 0 : 1;
}

export function ConsultantBookingsFilterTabs(
  props: ConsultantBookingsFilterTabsProps,
): React.ReactElement {
  const { filter, upcomingCount, pastCount, onFilterChange } = props;
  const activeIndex = filterToIndex(filter);

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

  const counts: Record<ConsultantBookingsFilter, number> = {
    upcoming: upcomingCount,
    past: pastCount,
  };

  const labels: Record<ConsultantBookingsFilter, string> = {
    upcoming: 'Upcoming',
    past: 'Past',
  };

  return (
    <View style={styles.track} accessibilityRole="tablist">
      <View style={styles.row} onLayout={onRowLayout}>
        <Animated.View pointerEvents="none" style={[styles.pill, pillStyle]} />
        {TABS.map((tab, index) => (
          <FilterTabButton
            key={tab}
            label={labels[tab]}
            count={counts[tab]}
            active={index === activeIndex}
            onPress={() => onFilterChange(tab)}
          />
        ))}
      </View>
    </View>
  );
}
