import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ZeptoTabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export type ZeptoTabBackgroundColors = string[] | Record<string, string>;
export type ZeptoTabLabelColors = ZeptoTabBackgroundColors;

export interface ZeptoTabsProps {
  tabs: ZeptoTabItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (index: number, tab: ZeptoTabItem) => void;
  tabBackgroundColors: ZeptoTabBackgroundColors;
  tabLabelColors?: ZeptoTabLabelColors;
  inactiveTabTileBackgroundColor?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

