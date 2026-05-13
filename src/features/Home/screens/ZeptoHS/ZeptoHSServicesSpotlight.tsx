import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AppTabParamList } from '@/navigation/types';

import { ServiceSpotlightCard } from './components/ServiceSpotlightCard';
import {
  SERVICES_CATEGORY_TREE,
  type ServicePageRef,
  type ServicesSubCategory,
  type ServicesTopCategory,
} from './data/servicesCategoryTree.static';

// ─────────────────────────────────────────────────────────────────────────────
// Spring / timing configs
//
// WHY THESE VALUES:
//   PILL_SPRING  — damping 18 + stiffness 220 produces one barely-visible
//                  overshoot then a fast settle. Feels like a physical puck
//                  sliding to a stop on glass. mass 0.6 keeps initial
//                  acceleration snappy (lower mass = less inertia to overcome).
//
//   MICRO_SPRING — tighter damping (22) so scale/opacity micro-interactions
//                  settle immediately with no overshoot — just a crisp pop.
//
//   EASE_OUT_CUBIC — for opacity / color changes that must never overshoot.
//                    Mimics the iOS standard easing curve.
// ─────────────────────────────────────────────────────────────────────────────
const PILL_SPRING = {
  damping: 18,
  stiffness: 220,
  mass: 0.6,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
} as const;

const MICRO_SPRING = {
  damping: 22,
  stiffness: 300,
  mass: 0.4,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
} as const;

/** Inactive tab label — solid black like reference; active uses `accentColor` (green). */
const TAB_LABEL_INACTIVE = THEME.colors.black;

const EASE_OUT_CUBIC = Easing.bezier(0.25, 0.46, 0.45, 0.94);

function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace('#', '').trim();
  if (raw.length !== 3 && raw.length !== 6) return `rgba(16, 163, 74, ${alpha})`;

  let r: number;
  let g: number;
  let b: number;

  if (raw.length === 3) {
    r = Number.parseInt(raw[0] + raw[0], 16);
    g = Number.parseInt(raw[1] + raw[1], 16);
    b = Number.parseInt(raw[2] + raw[2], 16);
  } else {
    r = Number.parseInt(raw.slice(0, 2), 16);
    g = Number.parseInt(raw.slice(2, 4), 16);
    b = Number.parseInt(raw.slice(4, 6), 16);
  }

  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(16, 163, 74, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// AnimatedPillIndicator
//
// The sliding accent-tint background pill that lives BEHIND the tab text.
//
// WHY SEPARATE COMPONENT:
//   If we animated borderColor / backgroundColor on every tab, every tab would
//   re-run its animated style on every frame. By isolating the background into
//   one component that uses translateX + width, only ONE animated style runs
//   per frame — the compositor handles it entirely off the JS thread.
// ─────────────────────────────────────────────────────────────────────────────
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
  const pillWidth  = useSharedValue(width);

  // WHY useDerivedValue instead of useEffect + runOnJS:
  //   useDerivedValue runs on the UI thread. The spring starts the frame the
  //   derived value is re-evaluated — no JS→UI bridge round-trip, no one-frame
  //   delay. translateX and pillWidth animate in the same worklet execution,
  //   so they are guaranteed to start in sync.
  useDerivedValue(() => {
    translateX.value = withSpring(x, PILL_SPRING);
    // WHY spring the width too:
    //   Tab labels have different lengths. Springing the width as the pill
    //   slides means it stretches/contracts naturally — like a rubber band
    //   being pulled — rather than snapping to the new size instantly.
    pillWidth.value = withSpring(width, PILL_SPRING);
  }, [x, width]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: pillWidth.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pillIndicator,
        {
          borderColor: accentColor,
          backgroundColor: hexToRgba(accentColor, 0.06),
          borderBottomWidth: 0,
          borderBottomColor: 'transparent',
        },
        indicatorStyle,
      ]}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PillTab — single animated tab button
// ─────────────────────────────────────────────────────────────────────────────
interface PillTabProps {
  label: string;
  isActive: boolean;
  accentColor: string;
  onPress: () => void;
  onLayout: (x: number, width: number) => void;
}

const PillTab = React.memo(function PillTab({
  label,
  isActive,
  accentColor,
  onPress,
  onLayout,
}: PillTabProps): React.ReactElement {
  // WHY two separate shared values (active + pressed):
  //   Keeping them separate means press feedback and active-state transitions
  //   run on independent animation tracks. Pressing an already-active tab still
  //   shows press feedback without fighting the active animation.
  const active  = useSharedValue(isActive ? 1 : 0);
  const pressed = useSharedValue(0);

  // WHY useDerivedValue instead of useEffect:
  //   Reaction to isActive prop change is immediate on the UI thread.
  //   No setState → re-render → useEffect → startAnimation chain.
  useDerivedValue(() => {
    active.value = withSpring(isActive ? 1 : 0, MICRO_SPRING);
  }, [isActive]);

  // ── Text color + scale ──────────────────────────────────────────────────
  // WHY interpolateColor on UI thread:
  //   Color interpolation in JS would require the bridge on every frame.
  //   On the UI thread it's a pure worklet computation — zero bridge cost.
  //
  // WHY scale 0.97 → 1.0:
  //   A 3% scale difference is below conscious perception but above the
  //   threshold where the eye notices "something moved." It reinforces the
  //   active state without looking animated.
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      active.value,
      [0, 1],
      [TAB_LABEL_INACTIVE, accentColor],
    ),
    transform: [
      { scale: interpolate(active.value, [0, 1], [0.97, 1.0]) },
    ],
  }));

  // ── Press feedback — scale + translateY ─────────────────────────────────
  // WHY scale 0.97 on press (not 0.95):
  //   0.95 looks like a bug or an over-engineered animation on small elements.
  //   0.97 is subliminal — it tells your finger "I registered that" without
  //   distracting the eye.
  //
  // WHY translateY 1px:
  //   A 1px downward nudge on press physically grounds the interaction —
  //   makes it feel like pressing a real surface. The spring release (1.01
  //   overshoot) creates a micro-"pop" on lift, like a physical button.
  //
  // WHY high stiffness (400) + low mass (0.3) for press:
  //   Press feedback must be INSTANT. Low mass + high stiffness means the
  //   spring reaches its target in <1 frame visually. The settle overshoot
  //   happens in the ~80ms after lift — that's the "pop."
  const pressStyle = useAnimatedStyle(() => {
    const isPressing = pressed.value === 1;
    return {
      transform: [
        {
          scale: withSpring(
            isPressing ? 0.97 : 1.0,
            { damping: 15, stiffness: 400, mass: 0.3 },
          ),
        },
        {
          translateY: withSpring(
            isPressing ? 1 : 0,
            { damping: 15, stiffness: 400, mass: 0.3 },
          ),
        },
      ],
    };
  });

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
      onLayout={(e) => onLayout(e.nativeEvent.layout.x, e.nativeEvent.layout.width)}
      onPressIn={() => { pressed.value = 1; }}
      onPressOut={() => { pressed.value = 0; }}
      onPress={onPress}
      // WHY hitSlop: tap targets should always be ≥44pt per HIG.
      // Visual size of inactive tabs is small; hitSlop compensates.
      hitSlop={{ top: 8, bottom: 8, left: 2, right: 2 }}
    >
      <Animated.View
        style={[
          isActive ? styles.pillActive : styles.pillInactive,
          pressStyle,
        ]}
      >
        <Animated.Text style={[styles.pillText, textStyle]} numberOfLines={1}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export interface ZeptoHSServicesSpotlightProps {
  backgroundColor: string;
  accentColor: string;
}

export function ZeptoHSServicesSpotlight({
  backgroundColor,
  accentColor,
}: ZeptoHSServicesSpotlightProps): React.ReactElement {
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const { width } = useWindowDimensions();
  const categories = SERVICES_CATEGORY_TREE.categories;
  const cardWidth  = useMemo(() => Math.min(168, Math.round(width * 0.42)), [width]);

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Stores measured x + width for each tab so the indicator knows where to go.
  // WHY useRef (not useState): layout measurements don't need to trigger
  // re-renders — we only need them at press time.
  const pillLayouts = useRef<Record<number, { x: number; width: number }>>({});

  // Indicator position lives in state because AnimatedPillIndicator needs to
  // re-receive new props when the active tab changes.
  const [indicatorLayout, setIndicatorLayout] = useState({ x: 0, width: 0 });

  const handleTabLayout = useCallback(
    (index: number, x: number, w: number) => {
      pillLayouts.current[index] = { x, width: w };
      // WHY initialise only for active tab:
      //   All tabs fire onLayout on mount. We only care about the active one
      //   for the initial indicator position — avoids a flicker where the
      //   indicator starts at 0,0 then jumps.
      if (index === activeCategoryIndex) {
        setIndicatorLayout({ x, width: w });
      }
    },
    [activeCategoryIndex],
  );

  const handleTabPress = useCallback((index: number) => {
    const layout = pillLayouts.current[index];
    if (layout) {
      // WHY update indicator before setActiveCategoryIndex:
      //   Both state updates batch in React 18, but calling setIndicatorLayout
      //   first ensures AnimatedPillIndicator receives new props in the same
      //   commit as PillTab receives isActive=true. They animate from frame 1
      //   together — synchronized start = premium feel.
      setIndicatorLayout(layout);
    }
    setActiveCategoryIndex(index);
  }, []);

  const activeCategory: ServicesTopCategory | undefined =
    categories[activeCategoryIndex] ?? categories[0];

  const goToService = useCallback(
    (slug: string): void => {
      navigation.navigate(ROUTES.App.Services, {
        screen: ROUTES.Services.Detail,
        params: { slug },
      });
    },
    [navigation],
  );

  const renderPageItem = useCallback<ListRenderItem<ServicePageRef>>(
    ({ item }) => (
      <ServiceSpotlightCard
        title={item.title}
        slug={item.slug}
        accentColor={accentColor}
        cardWidth={cardWidth}
        onPress={() => goToService(item.slug)}
      />
    ),
    [accentColor, cardWidth, goToService],
  );

  const pageKeyExtractor = useCallback((p: ServicePageRef): string => p.slug, []);

  const ListSeparator = useCallback(
    (): React.ReactElement => <View style={styles.cardGap} />,
    [],
  );

  const renderSubCategorySection = useCallback(
    (sub: ServicesSubCategory): React.ReactElement => (
      <View key={sub.slug} style={styles.section}>
        <Text style={styles.sectionTitle} numberOfLines={2}>
          {sub.name.trim()}
        </Text>
        <FlatList
          horizontal
          nestedScrollEnabled
          data={sub.pages}
          renderItem={renderPageItem}
          keyExtractor={pageKeyExtractor}
          ItemSeparatorComponent={ListSeparator}
          showsHorizontalScrollIndicator={false}
          style={styles.hRow}
          contentContainerStyle={styles.hRowContent}
        />
      </View>
    ),
    [ListSeparator, pageKeyExtractor, renderPageItem],
  );

  if (activeCategory == null) {
    return <View style={[styles.wrap, { backgroundColor }]} />;
  }

  return (
    <View style={[styles.wrap, { backgroundColor }]}>

      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <View style={styles.tabBarWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
          accessibilityRole="tablist"
          // WHY "fast": makes the tab strip feel native — matches App Store /
          // Settings scroll deceleration on iOS.
          decelerationRate="fast"
        >
          {/*
            WHY indicator is INSIDE the ScrollView:
              If it were outside, it would not scroll with the tabs. Placing it
              inside + absolutely positioned means it tracks tab positions
              correctly even when the list is scrolled.
          */}
          <AnimatedPillIndicator
            x={indicatorLayout.x}
            width={indicatorLayout.width}
            accentColor={accentColor}
          />

          {categories.map((cat, index) => (
            <PillTab
              key={cat.slug}
              label={cat.name.trim()}
              isActive={index === activeCategoryIndex}
              accentColor={accentColor}
              onPress={() => handleTabPress(index)}
              onLayout={(x, w) => handleTabLayout(index, x, w)}
            />
          ))}
        </ScrollView>

        {/* Full-width accent underline */}
        <View style={[styles.bottomLine, { backgroundColor: accentColor }]} />
      </View>

      <Animated.View
        key={activeCategoryIndex}
        entering={FadeIn.duration(180).delay(60).easing(EASE_OUT_CUBIC)}
        style={styles.sections}
      >
        {activeCategory.subCategories.map((sub) => renderSubCategorySection(sub))}
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingBottom: THEME.spacing[12],
    paddingTop: THEME.spacing[8],
  },

  // Tab bar container
  tabBarWrap: {
    width: '100%',
  },

  // ScrollView content — position relative so absolute indicator is contained
  pillRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[4],
    position: 'relative',
  },

  // Sliding “folder tab” — no bottom stroke (meets full-width bar cleanly)
  pillIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 0,
  },

  pillActive: {
    backgroundColor: 'transparent',
    paddingHorizontal: THEME.spacing[10],
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[8],
    zIndex: 1,
  },

  pillInactive: {
    backgroundColor: 'transparent',
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[8],
    zIndex: 1,
  },

  pillText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
    letterSpacing: -0.15,
  },

  bottomLine: {
    height: 1.5,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Content
  sections: {
    gap: THEME.spacing[20],
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[16],
    backgroundColor: 'white',
  },
  section: {
    gap: THEME.spacing[10],
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },
  hRow: {
    flexGrow: 0,
  },
  hRowContent: {
    paddingVertical: 2,
    paddingRight: THEME.spacing[4],
  },
  cardGap: {
    width: THEME.spacing[12],
  },
});