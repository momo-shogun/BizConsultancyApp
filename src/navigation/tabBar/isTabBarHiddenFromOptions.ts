import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { ViewStyle } from 'react-native';

function styleHidesTabBar(style: unknown): boolean {
  if (style == null || typeof style !== 'object') {
    return false;
  }
  return (style as ViewStyle).display === 'none';
}

export function isTabBarHiddenFromOptions(options: BottomTabNavigationOptions): boolean {
  const { tabBarStyle } = options;
  if (tabBarStyle == null) {
    return false;
  }

  const styles = Array.isArray(tabBarStyle) ? tabBarStyle : [tabBarStyle];
  return styles.some(styleHidesTabBar);
}
