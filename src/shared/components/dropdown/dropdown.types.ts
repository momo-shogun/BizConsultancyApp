import type { StyleProp, ViewStyle } from 'react-native';

import type { DropdownMenuTheme } from './dropdown.styles';
import type { DropdownProps as ElementDropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';

export type DropdownProps<T> = Omit<
  ElementDropdownProps<T>,
  'style' | 'disable' | 'containerStyle'
> & {
  disabled?: boolean;
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  /** Merged into the closed trigger row (same role as `Input` `containerStyle`). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Merged into the library’s dropdown panel (`containerStyle` on the element dropdown). */
  menuContainerStyle?: StyleProp<ViewStyle>;
  /**
   * When true, menu opens anchored directly under the trigger (use inside bottom sheets / modals).
   */
  anchorMenu?: boolean;
  /** Panel colors when `anchorMenu` is true. `consultant` matches profile header green. */
  anchorMenuTheme?: DropdownMenuTheme;
};