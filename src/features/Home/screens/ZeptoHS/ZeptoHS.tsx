import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Platform, StyleSheet, UIManager, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { ZeptoHeaderV1 } from '../../navigation/Header/ZeptoHeaderV1';
import { ZeptoTabs } from '../../Tabs/ZeptoTabs';
import { ZeptoTabsSearchBand } from '../../Tabs/ZeptoTabsSearchBand';
import { THEME } from '@/constants/theme';
import { darkenHex, ZEPTO_TABS_TRACK_DARKEN } from '@/utils/darkenHex';

import { ZeptoHSCategorySpotlight } from './ZeptoHSCategorySpotlight';
import type { HomeCategoryId, ZeptoHSProps, ZeptoHSShellColors } from './ZeptoHS.types';
import { ROUTES } from '@/navigation/routeNames';
import { useNavigation } from 'node_modules/@react-navigation/core/lib/typescript/src/useNavigation';
import { navigationRef } from '@/navigation/RootNavigator';

if (
  Platform.OS === 'android' &&
  typeof UIManager.setLayoutAnimationEnabledExperimental === 'function'
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Must match sticky search wrapper (top pad + search band). */
const SEARCH_SCROLL_SPACER_HEIGHT = 64;
const STICKY_SEARCH_TOP_PAD = 6;
/** Scroll distance over which header + tabs row fade out. */
const HEADER_TABS_FADE_DISTANCE = 100;
/** Fallback totals before layout; replaced by onLayout heights. */
const FALLBACK_HEADER_H = 64;
const FALLBACK_TABS_H = 80;

function uniformShell(fallbackBackground: string): ZeptoHSShellColors {
  return {
    headerBackground: fallbackBackground,
    topTabsBackground: fallbackBackground,
    categoryStripBackground: fallbackBackground,
    tabLabelColor: '#0A0A0A',
  };
}

function shell(topTabsBackground: string, tabLabelColor: string): ZeptoHSShellColors {
  return {
    headerBackground: topTabsBackground,
    topTabsBackground,
    categoryStripBackground: topTabsBackground,
    tabLabelColor,
  };
}

const ZEPTO_HS_INACTIVE_TAB_TILE_BG = '#FFFFFF';

export const ZEPTO_HS_SHELL_BY_CATEGORY_ID: Record<string, ZeptoHSShellColors> = {
  diagnosis: shell('#E0F2FE', '#2563EB'),
  services: shell('#ECFDF5', '#16A34A'),
  consultation: shell('#FFF3E6', '#F97316'),
  mentorship: shell('#F7F5FF', '#6D28D9'),
};

export const ZEPTO_HS_TOP_CATEGORY_TABS = [
  { id: 'diagnosis', label: 'Business Diagnosis' },
  { id: 'services', label: 'Business Services' },
  { id: 'consultation', label: 'Expert Consultation' },
  { id: 'mentorship', label: 'Mentorship Program' },
] as const;

export function resolveZeptoHSShellColors(
  categoryId: string | undefined,
  fallbackBackground: string,
): ZeptoHSShellColors {
  if (!categoryId) return uniformShell(fallbackBackground);
  return ZEPTO_HS_SHELL_BY_CATEGORY_ID[categoryId] ?? uniformShell(fallbackBackground);
}

export function ZeptoHS(props: ZeptoHSProps): React.ReactElement {
  const { header, children, testID, style } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopCategoryIndex, setActiveTopCategoryIndex] = useState(0);

  const activeTopCategoryId: HomeCategoryId =
    (ZEPTO_HS_TOP_CATEGORY_TABS[activeTopCategoryIndex]?.id as HomeCategoryId) ?? 'diagnosis';

  const topTabsTabBackgroundColors = useMemo(() => {
    const byId: Record<string, string> = {};
    for (const tab of ZEPTO_HS_TOP_CATEGORY_TABS) {
      const row = resolveZeptoHSShellColors(tab.id, header.backgroundColor);
      byId[tab.id] = row.topTabsBackground;
    }
    return byId;
  }, [header.backgroundColor]);

  const topTabsTabLabelColors = useMemo(() => {
    const byId: Record<string, string> = {};
    for (const tab of ZEPTO_HS_TOP_CATEGORY_TABS) {
      const row = resolveZeptoHSShellColors(tab.id, header.backgroundColor);
      byId[tab.id] = row.tabLabelColor;
    }
    return byId;
  }, [header.backgroundColor]);

  const activeShell = resolveZeptoHSShellColors(activeTopCategoryId, header.backgroundColor);

  const headerBackgroundColor = useMemo(
    () => darkenHex(activeShell.topTabsBackground, ZEPTO_TABS_TRACK_DARKEN),
    [activeShell.topTabsBackground],
  );

  const scrollY = useSharedValue(0);
  const headerBlockH = useSharedValue(FALLBACK_HEADER_H);
  const tabsBlockH = useSharedValue(FALLBACK_TABS_H);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const collapsingHeaderOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, HEADER_TABS_FADE_DISTANCE],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const stickySearchLiftStyle = useAnimatedStyle(() => {
    const startTop = headerBlockH.value + tabsBlockH.value;
    const pinnedTop = 0;
    const travel = Math.max(startTop - pinnedTop, 1);
    const top = interpolate(scrollY.value, [0, travel], [startTop, pinnedTop], Extrapolation.CLAMP);
    const stuck = interpolate(scrollY.value, [travel * 0.5, travel], [0, 1], Extrapolation.CLAMP);

    return {
      position: 'absolute' as const,
      left: 0,
      right: 0,
      top,
      zIndex: 40,
    };
  });

  const onHeaderLayout = (e: LayoutChangeEvent): void => {
    headerBlockH.value = e.nativeEvent.layout.height;
  };

  const onTabsLayout = (e: LayoutChangeEvent): void => {
    tabsBlockH.value = e.nativeEvent.layout.height;
  };

  const renderedChildren =
    children != null
      ? typeof children === 'function'
        ? (children as (id: HomeCategoryId) => ReactNode)(activeTopCategoryId)
        : children
      : null;

  return (
    <View style={[{ flex: 1 }, style]} testID={testID}>
      <Animated.ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Animated.View style={collapsingHeaderOpacityStyle} onLayout={onHeaderLayout} collapsable={false}>
          <ZeptoHeaderV1 {...header} backgroundColor={headerBackgroundColor}  onWalletPress={()=> navigationRef.navigate(ROUTES.Root.Wallet)} />
        </Animated.View>

        <Animated.View style={collapsingHeaderOpacityStyle} onLayout={onTabsLayout} collapsable={false}>
          <ZeptoTabs
            tabs={[...ZEPTO_HS_TOP_CATEGORY_TABS]}
            tabBackgroundColors={topTabsTabBackgroundColors}
            tabLabelColors={topTabsTabLabelColors}
            inactiveTabTileBackgroundColor={ZEPTO_HS_INACTIVE_TAB_TILE_BG}
            activeIndex={activeTopCategoryIndex}
            defaultActiveIndex={0}
            onChange={setActiveTopCategoryIndex}
            showSearch={false}
            style={{ borderRadius: 0 }}
          />
        </Animated.View>

        {/* Reserves vertical space aligned with sticky search */}
        <View
          style={{ height: SEARCH_SCROLL_SPACER_HEIGHT, backgroundColor: activeShell.topTabsBackground }}
          collapsable
        />

        <ZeptoHSCategorySpotlight
          key={activeTopCategoryId}
          categoryId={activeTopCategoryId}
          backgroundColor={activeShell.categoryStripBackground}
          accentColor={activeShell.tabLabelColor}
        />

        {renderedChildren}
      </Animated.ScrollView>

      <Animated.View style={stickySearchLiftStyle} pointerEvents="box-none">
        <View style={{ paddingTop: STICKY_SEARCH_TOP_PAD, backgroundColor: activeShell.topTabsBackground }}>
          <ZeptoTabsSearchBand
            backgroundColor={activeShell.topTabsBackground}
            searchPlaceholder="Search for services, experts..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            testID="zepto_hs_sticky_search"
          />
        </View>
      </Animated.View>
    </View>
  );
}

ZeptoHS.displayName = 'ZeptoHS';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    paddingBottom: THEME.spacing[24],
  },
});
