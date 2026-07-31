import type { SharedValue } from 'react-native-reanimated';

export interface PullToRefreshIndicatorProps {
  /** 0 → idle, increases with pull distance (typically 0–1+). */
  pullProgress: SharedValue<number>;
  /** 1 while a refresh is in flight. */
  refreshing: SharedValue<number>;
  /** Accent / brand stroke color. */
  tintColor?: string;
  testID?: string;
}
