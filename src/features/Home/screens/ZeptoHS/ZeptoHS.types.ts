import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { ZeptoHeaderV1Props } from '../../navigation/Header/ZeptoHeaderV1.types';

/** IDs matching the top category tabs defined inside ZeptoHS. */
export type HomeCategoryId = 'diagnosis' | 'services' | 'consultation' | 'mentorship';

/** Per-category shell color tokens (background + accent) used by header, tabs, chip strip. */
export interface ZeptoHSShellColors {
  headerBackground: string;
  topTabsBackground: string;
  categoryStripBackground: string;
  tabLabelColor: string;
}

export interface ZeptoHSProps {
  header: ZeptoHeaderV1Props;
  /**
   * Render prop — receives the active top category ID so the parent can swap
   * section content. Also accepts plain ReactNode.
   *
   * @example
   * ```tsx
   * <ZeptoHS header={...}>
   *   {(categoryId) => <HomeCategoryContent category={categoryId} />}
   * </ZeptoHS>
   * ```
   */
  children?: ReactNode | ((categoryId: HomeCategoryId) => ReactNode);
  testID?: string;
  style?: StyleProp<ViewStyle>;
}
