import React, { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useControlledState } from '@/hooks/useControlledState';

import { ZEPTO_TAB_C, zeptoTabCStyles } from './ZeptoTabC.styles';
import type { ZeptoTabCProps } from './ZeptoTabC.types';

const DEFAULT_BG = '#F3DFCC';
const DEFAULT_ACCENT = '#0A0A0A';

export function ZeptoTabC(props: ZeptoTabCProps): React.ReactElement | null {
  const {
    tabs,
    activeIndex: activeIndexProp,
    defaultActiveIndex = 0,
    onChange,
    backgroundColor = DEFAULT_BG,
    accentColor = DEFAULT_ACCENT,
    labelColor = DEFAULT_ACCENT,
    testID,
    style,
    contentContainerStyle,
  } = props;

  const maxIndex = tabs.length > 0 ? tabs.length - 1 : 0;
  const safeDefault = Math.min(Math.max(0, defaultActiveIndex), maxIndex);

  const handleIndexChange = useCallback(
    (idx: number) => {
      const tab = tabs[idx];
      if (tab) onChange?.(idx, tab);
    },
    [onChange, tabs],
  );

  const [activeIndex, setActiveIndex] = useControlledState(activeIndexProp, safeDefault, handleIndexChange);

  const clampedIndex = tabs.length > 0 ? Math.min(Math.max(0, activeIndex), tabs.length - 1) : 0;

  useEffect(() => {
    if (activeIndexProp === undefined && tabs.length > 0 && activeIndex !== clampedIndex) {
      setActiveIndex(clampedIndex);
    }
  }, [activeIndex, activeIndexProp, clampedIndex, setActiveIndex, tabs.length]);

  const scrollRef = useRef<ScrollView | null>(null);
  const tabXs = useRef<number[]>([]);
  const tabWidths = useRef<number[]>([]);

  useEffect(() => {
    tabXs.current = tabs.map(() => 0);
    tabWidths.current = tabs.map(() => 0);
  }, [tabs]);

  const scrollToTab = useCallback((index: number) => {
    const x = tabXs.current[index] ?? 0;
    const w = tabWidths.current[index] ?? ZEPTO_TAB_C.tabMinWidth;
    const pad = ZEPTO_TAB_C.padH;
    const target = Math.max(0, x - pad - w * 0.15);
    scrollRef.current?.scrollTo({ x: target, animated: true });
  }, []);

  const selectTab = (index: number) => {
    setActiveIndex(index);
    scrollToTab(index);
  };

  const onTabLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      tabXs.current[index] = x;
      tabWidths.current[index] = width;
    },
    [],
  );

  if (!tabs.length) return null;

  return (
    <View style={[zeptoTabCStyles.outer, { backgroundColor }, style]} testID={testID}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces
        contentContainerStyle={[zeptoTabCStyles.scrollContent, contentContainerStyle]}
      >
        {tabs.map((tab, index) => {
          const active = index === clampedIndex;
          const badge = tab.badge;
          const isSaleBadge = Boolean(badge?.variant === 'sale');
          const isNewBadge = Boolean(badge) && !isSaleBadge;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onLayout={onTabLayout(index)}
              onPress={() => selectTab(index)}
              style={zeptoTabCStyles.tabPressable}
            >
              <View style={zeptoTabCStyles.tabInner}>
                <View style={zeptoTabCStyles.iconWrap}>
                  {tab.icon}
                  {isNewBadge ? (
                    <View style={zeptoTabCStyles.badgeNew}>
                      <Text style={zeptoTabCStyles.badgeNewText} numberOfLines={1}>
                        {badge!.text.toUpperCase()}
                      </Text>
                    </View>
                  ) : null}
                  {isSaleBadge ? (
                    <View style={zeptoTabCStyles.badgeSale}>
                      <View style={zeptoTabCStyles.badgeSaleInner}>
                        <Text style={zeptoTabCStyles.badgeSaleText} numberOfLines={1}>
                          {badge!.text.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    zeptoTabCStyles.label,
                    { color: labelColor },
                    active ? zeptoTabCStyles.labelActive : zeptoTabCStyles.labelInactive,
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    zeptoTabCStyles.underline,
                    { backgroundColor: active ? accentColor : 'transparent' },
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

ZeptoTabC.displayName = 'ZeptoTabC';

