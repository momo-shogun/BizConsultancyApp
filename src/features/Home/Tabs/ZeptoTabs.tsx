import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { darkenHex, ZEPTO_TABS_TRACK_DARKEN } from '@/utils/darkenHex';

import { ZEPTO, zeptoTabsStyles } from './ZeptoTabs.styles';
import type { ZeptoTabsProps } from './ZeptoTabs.types';

type Layout = { x: number; width: number };

function splitLabel(label: string): { top: string; bottom: string } {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { top: label.trim(), bottom: '' };
  }
  return { top: parts[0] ?? '', bottom: parts.slice(1).join(' ') };
}

function resolveTabColors(
  tabs: ZeptoTabsProps['tabs'],
  tabBackgroundColors: ZeptoTabsProps['tabBackgroundColors'],
  fallback: string,
): string[] {
  return tabs.map((t, i) => {
    if (Array.isArray(tabBackgroundColors)) {
      return tabBackgroundColors[i] ?? fallback;
    }
    return tabBackgroundColors[t.id] ?? fallback;
  });
}

export function ZeptoTabs(props: ZeptoTabsProps): React.ReactElement | null {
  const {
    tabs,
    activeIndex: activeIndexProp,
    defaultActiveIndex = 0,
    onChange,
    tabBackgroundColors,
    tabLabelColors,
    inactiveTabTileBackgroundColor,
    showSearch = false,
    searchPlaceholder = 'Search for “Iphone”',
    searchValue,
    onSearchChange,
    testID,
    style,
    contentContainerStyle,
  } = props;

  const fallbackTrack = '#E6C8A4';
  const resolvedColors = useMemo(
    () => (tabs.length ? resolveTabColors(tabs, tabBackgroundColors, fallbackTrack) : [fallbackTrack]),
    [tabs, tabBackgroundColors],
  );
  const resolvedColorsDarker = useMemo(() => {
    return resolvedColors.map((c) => darkenHex(c, ZEPTO_TABS_TRACK_DARKEN));
  }, [resolvedColors]);

  const resolvedLabelColors = useMemo(() => {
    if (!tabLabelColors) return null;
    const fallback = '#141414';
    return tabs.length ? resolveTabColors(tabs, tabLabelColors, fallback) : null;
  }, [tabs, tabLabelColors]);

  const maxIndex = tabs.length > 0 ? tabs.length - 1 : 0;
  const safeDefault = Math.min(Math.max(0, defaultActiveIndex), maxIndex);

  const [uncontrolledIndex, setUncontrolledIndex] = React.useState<number>(safeDefault);
  const isControlled = activeIndexProp !== undefined;
  const activeIndex = isControlled ? (activeIndexProp as number) : uncontrolledIndex;
  const clampedIndex =
    tabs.length > 0 ? Math.min(Math.max(0, activeIndex), tabs.length - 1) : 0;

  const setActiveIndex = useCallback(
    (idx: number) => {
      const next = Math.min(Math.max(0, idx), maxIndex);
      if (!isControlled) setUncontrolledIndex(next);
      const tab = tabs[next];
      if (tab) onChange?.(next, tab);
    },
    [isControlled, maxIndex, onChange, tabs],
  );

  const layoutsRef = useRef<Layout[]>([]);
  const everLaidOut = useRef(false);
  const pillRetryRef = useRef<{ index: number; tries: number } | null>(null);
  const rowWidthRef = useRef<number>(0);

  const activeProgress = useSharedValue(clampedIndex);
  const pillX = useSharedValue(0);
  const pillW = useSharedValue(0);

  useEffect(() => {
    layoutsRef.current = tabs.map(() => ({ x: 0, width: 0 }));
    everLaidOut.current = false;
  }, [tabs]);

  const onRowLayout = useCallback((e: LayoutChangeEvent) => {
    rowWidthRef.current = e.nativeEvent.layout.width;
  }, []);

  const colorInputRange = useMemo(() => {
    if (resolvedColors.length <= 1) return [0, 1];
    return resolvedColors.map((_, i) => i);
  }, [resolvedColors]);

  const colorOutputRange = useMemo(() => {
    if (resolvedColors.length <= 1) {
      const c = resolvedColors[0] ?? fallbackTrack;
      return [c, c];
    }
    return resolvedColors;
  }, [resolvedColors]);

  const applyPill = useCallback(
    (index: number, instant: boolean) => {
      const rowW = rowWidthRef.current;
      if (rowW > 0 && tabs.length > 0) {
        const totalGap = ZEPTO.gap * Math.max(0, tabs.length - 1);
        const w = Math.max(0, (rowW - totalGap) / tabs.length);
        const x = index * (w + ZEPTO.gap);
        const dur = instant ? 0 : 260;
        pillX.value = withTiming(x, { duration: dur });
        pillW.value = withTiming(w, { duration: dur });
        pillRetryRef.current = null;
        return;
      }

      const L = layoutsRef.current[index];
      if (!L || L.width <= 0) {
        // Layout can arrive after index changes (esp. on first render).
        // Retry a few times so the highlight pill doesn't get stuck.
        const cur = pillRetryRef.current;
        const tries = cur && cur.index === index ? cur.tries + 1 : 1;
        pillRetryRef.current = { index, tries };
        if (tries <= 6) {
          setTimeout(() => applyPill(index, true), 0);
        }
        return;
      }

      pillRetryRef.current = null;
      const dur = instant ? 0 : 260;
      pillX.value = withTiming(L.x, { duration: dur });
      pillW.value = withTiming(L.width, { duration: dur });
    },
    [pillW, pillX, tabs.length],
  );

  const syncProgress = useCallback((index: number, instant: boolean) => {
    if (resolvedColors.length <= 1) {
      activeProgress.value = 0;
      return;
    }
    activeProgress.value = instant ? index : withTiming(index, { duration: 280 });
  }, [activeProgress, resolvedColors.length]);

  useEffect(() => {
    if (!tabs.length) return;
    syncProgress(clampedIndex, false);
    applyPill(clampedIndex, false);
  }, [clampedIndex, tabs.length, syncProgress, applyPill]);

  const onTabLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      layoutsRef.current[index] = { x, width };
      if (index !== clampedIndex || width <= 0) return;
      if (!everLaidOut.current) {
        everLaidOut.current = true;
        syncProgress(clampedIndex, true);
        applyPill(clampedIndex, true);
        return;
      }
      applyPill(clampedIndex, false);
    },
    [applyPill, clampedIndex, syncProgress],
  );

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(activeProgress.value, colorInputRange, colorOutputRange, 'RGB'),
    };
  }, [colorInputRange, colorOutputRange]);

  const tabsBgAnimatedStyle = useAnimatedStyle(() => {
    const outRange =
      resolvedColorsDarker.length <= 1
        ? [resolvedColorsDarker[0] ?? fallbackTrack, resolvedColorsDarker[0] ?? fallbackTrack]
        : resolvedColorsDarker;
    return {
      backgroundColor: interpolateColor(activeProgress.value, colorInputRange, outRange, 'RGB'),
    };
  }, [colorInputRange, resolvedColorsDarker]);

  const highlightBgAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(activeProgress.value, colorInputRange, colorOutputRange, 'RGB'),
    };
  }, [colorInputRange, colorOutputRange]);

  const highlightAnimatedStyle = useAnimatedStyle(() => {
    return { width: pillW.value, transform: [{ translateX: pillX.value }] };
  });

  if (!tabs.length) return null;

  const selectTab = (index: number) => setActiveIndex(index);

  const tabRowOuterStyle = [zeptoTabsStyles.tabRowOuter, contentContainerStyle];

  return (
    <Animated.View style={[zeptoTabsStyles.outer, style]} testID={testID}>
      <Animated.View style={[zeptoTabsStyles.tabsBg, tabsBgAnimatedStyle]}>
        <View style={tabRowOuterStyle}>
          <View style={zeptoTabsStyles.tabRowInner} onLayout={onRowLayout}>
            <Animated.View
              pointerEvents="none"
              style={[zeptoTabsStyles.highlight, highlightAnimatedStyle, highlightBgAnimatedStyle]}
            />

            {tabs.map((tab, index) => {
              const active = index === clampedIndex;
              return (
                <Pressable
                  key={tab.id}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  onPress={() => selectTab(index)}
                  onLayout={onTabLayout(index)}
                  style={[
                    zeptoTabsStyles.pressable,
                    index < tabs.length - 1 && { marginRight: ZEPTO.gap },
                  ]}
                  collapsable={false}
                >
                  <View
                    style={[
                      zeptoTabsStyles.tabInner,
                      inactiveTabTileBackgroundColor != null && !active
                        ? { backgroundColor: inactiveTabTileBackgroundColor }
                        : null,
                      active ? zeptoTabsStyles.tabInnerActive : null,
                    ]}
                  >
                    {tab.icon != null ? <View style={zeptoTabsStyles.iconWrap}>{tab.icon}</View> : null}
                    <View style={zeptoTabsStyles.labelStack}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                        style={[
                          zeptoTabsStyles.label,
                          zeptoTabsStyles.labelTop,
                          active ? zeptoTabsStyles.labelActive : zeptoTabsStyles.labelInactive,
                          resolvedLabelColors != null
                            ? { color: resolvedLabelColors[index] ?? '#141414' }
                            : null,
                          !active ? zeptoTabsStyles.labelInactiveDim : null,
                        ]}
                      >
                        {splitLabel(tab.label).top}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                        style={[
                          zeptoTabsStyles.label,
                          zeptoTabsStyles.labelBottom,
                          active ? zeptoTabsStyles.labelActive : zeptoTabsStyles.labelInactive,
                          resolvedLabelColors != null
                            ? { color: resolvedLabelColors[index] ?? '#141414' }
                            : null,
                          !active ? zeptoTabsStyles.labelInactiveDim : null,
                        ]}
                      >
                        {splitLabel(tab.label).bottom}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Animated.View>

      {showSearch ? (
        <Animated.View style={[zeptoTabsStyles.searchBg, containerAnimatedStyle]}>
          <View style={zeptoTabsStyles.searchWrap}>
            <View style={zeptoTabsStyles.searchBar}>
              <View style={zeptoTabsStyles.searchIcon}>
                <View style={zeptoTabsStyles.searchIconCircle} />
                <View style={zeptoTabsStyles.searchIconHandle} />
              </View>
              <TextInput
                value={searchValue}
                onChangeText={onSearchChange}
                placeholder={searchPlaceholder}
                placeholderTextColor="rgba(17,24,39,0.55)"
                style={zeptoTabsStyles.searchInput}
              />
            </View>
          </View>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

ZeptoTabs.displayName = 'ZeptoTabs';

