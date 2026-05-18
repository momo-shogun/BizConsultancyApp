import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type Ionicons from 'react-native-vector-icons/Ionicons';

export type PremiumTabIconName = ComponentProps<typeof Ionicons>['name'];

export interface PremiumTabItem<T extends string = string> {
  key: T;
  label: string;
  icon?: PremiumTabIconName;
}

export type PremiumTabBarTheme = 'light' | 'dark';

export interface PremiumHorizontalTabBarProps<T extends string = string> {
  tabs: readonly PremiumTabItem<T>[];
  activeKey: T;
  onTabPress: (key: T) => void;
  theme?: PremiumTabBarTheme;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
