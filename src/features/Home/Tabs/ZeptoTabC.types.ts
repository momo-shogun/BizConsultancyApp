import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ZeptoTabCBadgeVariant = 'new' | 'sale';

export interface ZeptoTabCBadge {
  text: string;
  variant?: ZeptoTabCBadgeVariant;
}

export interface ZeptoTabCItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: ZeptoTabCBadge;
}

export interface ZeptoTabCProps {
  tabs: ZeptoTabCItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (index: number, tab: ZeptoTabCItem) => void;
  backgroundColor?: string;
  accentColor?: string;
  labelColor?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

