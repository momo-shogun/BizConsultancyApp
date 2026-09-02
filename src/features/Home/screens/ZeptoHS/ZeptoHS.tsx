import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Platform, RefreshControl, StyleSheet, UIManager, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ZeptoHeaderV1 } from '../../navigation/Header/ZeptoHeaderV1';
import { ZeptoTabs } from '../../Tabs/ZeptoTabs';
import { ZeptoTabsSearchBand } from '../../Tabs/ZeptoTabsSearchBand';
import { THEME } from '@/constants/theme';
import { darkenHex, ZEPTO_TABS_TRACK_DARKEN } from '@/utils/darkenHex';
import {
  PTR_THRESHOLD,
  PullToRefreshIndicator,
} from '@/shared/components/pullToRefresh';

import { reportBizAIScroll } from '@/features/BizAI/engine/bizAiScrollBridge';

import { ZeptoHSCategorySpotlight } from './ZeptoHSCategorySpotlight';
import type { HomeCategoryId, ZeptoHSProps, ZeptoHSShellColors } from './ZeptoHS.types';
import { ROUTES } from '@/navigation/routeNames';
import { navigationRef } from '@/navigation/RootNavigator';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

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

const HAPTIC_OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
} as const;

const PULL_SPRING = { damping: 18, stiffness: 220, mass: 0.7 } as const;

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

function fireRefreshArmedHaptic(): void {
  ReactNativeHapticFeedback.trigger(
    Platform.OS === 'ios' ? 'impactLight' : 'keyboardTap',
    HAPTIC_OPTIONS,
  );
}

export function ZeptoHS(props: ZeptoHSProps): React.ReactElement {
  const { header, children, testID, style, onShellColorsChange, onRefresh } = props;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTopCategoryIndex, setActiveTopCategoryIndex] = React.useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const refreshInFlightRef = useRef(false);

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

  React.useEffect(() => {
    onShellColorsChange?.(activeShell);
  }, [activeShell, onShellColorsChange]);

  const headerBackgroundColor = useMemo(
    () => darkenHex(activeShell.topTabsBackground, ZEPTO_TABS_TRACK_DARKEN),
    [activeShell.topTabsBackground],
  );

  const scrollY = useSharedValue(0);
  const headerBlockH = useSharedValue(FALLBACK_HEADER_H);
  const tabsBlockH = useSharedValue(FALLBACK_TABS_H);
  const pullProgress = useSharedValue(0);
  const refreshingSV = useSharedValue(0);

  const finishRefresh = useCallback((): void => {
    refreshInFlightRef.current = false;
    setRefreshing(false);
    refreshingSV.value = 0;
    pullProgress.value = withSpring(0, PULL_SPRING);
  }, [pullProgress, refreshingSV]);

  const runRefresh = useCallback((): void => {
    if (onRefresh == null || refreshInFlightRef.current) {
      return;
    }
    refreshInFlightRef.current = true;
    setRefreshing(true);
    refreshingSV.value = 1;
    pullProgress.value = withSpring(1, PULL_SPRING);

    void Promise.resolve(onRefresh()).finally(() => {
      finishRefresh();
    });
  }, [finishRefresh, onRefresh, pullProgress, refreshingSV]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      scrollY.value = offsetY;
      reportBizAIScroll({
        offsetY,
        velocityY: event.velocity?.y,
      });

      if (refreshingSV.value === 1) {
        return;
      }
      // iOS overscroll + Android rubber-band (when enabled) report negative Y while pulling.
      if (offsetY < 0) {
        pullProgress.value = Math.min(-offsetY / PTR_THRESHOLD, 1.35);
      } else if (pullProgress.value !== 0) {
        pullProgress.value = withSpring(0, PULL_SPRING);
      }
    },
  });

  useAnimatedReaction(
    () => pullProgress.value >= 1 && refreshingSV.value === 0,
    (armed, wasArmed) => {
      if (armed && !wasArmed) {
        runOnJS(fireRefreshArmedHaptic)();
      }
    },
    [],
  );

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

  const onTalkToExpertPress = useCallback((): void => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.Root.ConsultantsList);
    }
  }, []);

  const onBusinessDiagnosisPress = useCallback((): void => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.Root.BusinessDiagnosis);
    }
  }, []);

  const onTopCategoryChange = useCallback((index: number): void => {
    setActiveTopCategoryIndex(index);
  }, []);

  const onOpenSearch = useCallback((): void => {
    navigation.navigate(ROUTES.Root.Search, {
      headerBackground: activeShell.topTabsBackground,
      accentColor: activeShell.tabLabelColor,
    });
  }, [activeShell.tabLabelColor, activeShell.topTabsBackground, navigation]);

  const onRefreshControl = useCallback((): void => {
    runRefresh();
  }, [runRefresh]);

  /** iOS: arm refresh on release past threshold (RefreshControl also covers this). */
  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
      if (onRefresh == null || refreshInFlightRef.current) {
        return;
      }
      const y = e.nativeEvent.contentOffset.y;
      if (y <= -PTR_THRESHOLD) {
        runRefresh();
      }
    },
    [onRefresh, runRefresh],
  );

  const renderedChildren =
    children != null
      ? typeof children === 'function'
        ? (children as (id: HomeCategoryId) => ReactNode)(activeTopCategoryId)
        : children
      : null;

  const refreshEnabled = onRefresh != null;

  const scrollBottomPadding = useMemo((): number => {
    // Tab bar sits outside this scroll view; keep only a small iOS tail inset.
    const base = THEME.spacing[12];
    if (Platform.OS === 'ios') {
      return base;
    }
    return base + Math.max(insets.bottom, 0);
  }, [insets.bottom]);

  return (
    <View style={[{ flex: 1 }, style]} testID={testID}>
      {refreshEnabled ? (
        <PullToRefreshIndicator
          pullProgress={pullProgress}
          refreshing={refreshingSV}
          tintColor={THEME.colors.splashGreen3}
          testID="zepto_hs_ptr_indicator"
        />
      ) : null}

      <Animated.ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={refreshEnabled}
        alwaysBounceVertical={refreshEnabled}
        {...Platform.select({
          android: {
            persistentScrollbar: false,
            overScrollMode: refreshEnabled ? ('always' as const) : ('never' as const),
          },
          default: {},
        })}
        onScroll={onScroll}
        onScrollEndDrag={refreshEnabled ? onScrollEndDrag : undefined}
        scrollEventThrottle={16}
        refreshControl={
          refreshEnabled ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefreshControl}
              // Drive refresh only — hide native circle (Android elevation/shadow).
              // Visible spinner is PullToRefreshIndicator above.
              tintColor="transparent"
              colors={[THEME.colors.splashGreen3]}
              progressBackgroundColor="transparent"
              progressViewOffset={Platform.OS === 'android' ? -120 : undefined}
            />
          ) : undefined
        }
      >
        <Animated.View style={collapsingHeaderOpacityStyle} onLayout={onHeaderLayout} collapsable={false}>
          <ZeptoHeaderV1 {...header} backgroundColor={headerBackgroundColor} />
        </Animated.View>

        <Animated.View style={collapsingHeaderOpacityStyle} onLayout={onTabsLayout} collapsable={false}>
          <ZeptoTabs
            tabs={[...ZEPTO_HS_TOP_CATEGORY_TABS]}
            tabBackgroundColors={topTabsTabBackgroundColors}
            tabLabelColors={topTabsTabLabelColors}
            inactiveTabTileBackgroundColor={ZEPTO_HS_INACTIVE_TAB_TILE_BG}
            activeIndex={activeTopCategoryIndex}
            defaultActiveIndex={0}
            onChange={onTopCategoryChange}
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
          onTalkToExpertPress={onTalkToExpertPress}
          onDiagnosePress={onBusinessDiagnosisPress}
        />

        {renderedChildren}
      </Animated.ScrollView>

      <Animated.View style={stickySearchLiftStyle} pointerEvents="box-none">
        <View style={{ paddingTop: STICKY_SEARCH_TOP_PAD, backgroundColor: activeShell.topTabsBackground }}>
          <ZeptoTabsSearchBand
            backgroundColor={activeShell.topTabsBackground}
            searchPlaceholder="Search for services"
            onPress={onOpenSearch}
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
    flexGrow: 0,
  },
});
