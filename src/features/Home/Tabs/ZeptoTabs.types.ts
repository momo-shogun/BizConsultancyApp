import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ZeptoTabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export type ZeptoTabBackgroundColors = string[] | Record<string, string>;
export type ZeptoTabLabelColors = ZeptoTabBackgroundColors;

export type ZeptoTabsEmbeddedParts = {
  /** Tab strip + animated track (no outer shell). */
  tabsRow: ReactNode;
  /** Search band or `null` when `showSearch` is false. */
  searchBand: ReactNode | null;
};

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
  /**
   * Mount tab strip + search as separate nodes (e.g. collapsing header + sticky search in a parent `ScrollView`).
   * When set, `style` applies only in the default (non-embedded) layout.
   */
  embedded?: (parts: ZeptoTabsEmbeddedParts) => ReactNode;
}

