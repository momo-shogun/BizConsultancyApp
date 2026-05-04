import React from 'react';
import type { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PLANK_BAR_V1_BLUE } from '../tabNavigators/plankBarV1/plankBarV1.styles';

/** Plank bar V1 — colors/layout matched to design reference (royal blue bar, white active pill). */
const plankV1 = {
  bar: PLANK_BAR_V1_BLUE,
  inactiveIcon: 'rgba(255, 255, 255, 0.92)',
  activePill: '#FFFFFF',
  activeForeground: '#0F172A',
  barRadiusBottom: 32,
  barRadiusTop: 14,
  /** Slightly under default icon size; ≥44pt hit area via `hitSlop` on tabs. */
  iconSize: 20,
  /** ≥12pt body-scale minimum; `adjustsFontSizeToFit` keeps full label on one line on narrow widths. */
  labelSize: 12,
  labelMinScale: 0.82,
};

function tabDisplayTitle(options: BottomTabNavigationOptions, routeName: string): string {
  const barLabel = options.tabBarLabel;
  if (typeof barLabel === 'string' && barLabel.length > 0) {
    return barLabel;
  }
  const title = options.title;
  if (typeof title === 'string' && title.length > 0) {
    return title;
  }
  const tail = routeName.split('/').pop();
  return tail && tail.length > 0 ? tail : routeName;
}

export type PlanckBridgedTabBarProps = BottomTabBarProps & {
  tabBarVariant?: 'plankBarV1';
};

export function PlanckBridgedTabBar({
  state,
  descriptors,
  navigation,
  tabBarVariant = 'plankBarV1',
}: PlanckBridgedTabBarProps): React.ReactElement | null {
  const insets = useSafeAreaInsets();

  if (tabBarVariant !== 'plankBarV1') {
    return null;
  }

  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View style={[styles.barShell, { paddingBottom: bottomPad }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const displayTitle = tabDisplayTitle(options, route.name);
          const a11yLabel = options.tabBarAccessibilityLabel ?? displayTitle;

          const onPress = (): void => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = (): void => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const inactiveColor = plankV1.inactiveIcon;
          const activeColor = plankV1.activeForeground;
          const color = focused ? activeColor : inactiveColor;
          const size = plankV1.iconSize;
          const iconEl = options.tabBarIcon?.({ focused, color, size }) ?? null;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? a11yLabel}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabCell}
            >
              {focused ? (
                <View style={styles.activePill}>
                  {iconEl}
                  <Text
                    style={styles.activeLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={plankV1.labelMinScale}
                    allowFontScaling
                  >
                    {displayTitle}
                  </Text>
                </View>
              ) : (
                <View style={styles.inactiveSlot}>{iconEl}</View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barShell: {
    width: '100%',
    paddingTop: 6,
    backgroundColor: plankV1.bar,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: plankV1.bar,
    borderTopLeftRadius: plankV1.barRadiusTop,
    borderTopRightRadius: plankV1.barRadiusTop,
    borderBottomLeftRadius: plankV1.barRadiusBottom,
    borderBottomRightRadius: plankV1.barRadiusBottom,
    paddingVertical: 8,
    paddingHorizontal: 3,
    minHeight: 52,
  },
  tabCell: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    maxWidth: '100%',
    gap: 4,
    backgroundColor: plankV1.activePill,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  activeLabel: {
    flexShrink: 1,
    fontSize: plankV1.labelSize,
    fontWeight: '700',
    color: plankV1.activeForeground,
  },
  inactiveSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
});
