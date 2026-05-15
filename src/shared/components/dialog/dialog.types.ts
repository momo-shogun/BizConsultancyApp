import type { ViewStyle } from 'react-native';

export type DialogVariant = 'default' | 'destructive' | 'success' | 'warning';

export interface DialogAction {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
}

export interface DialogProps {
  visible: boolean;
  onClose: () => void;

  variant?: DialogVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;

  actions?: DialogAction[];
  dismissible?: boolean;
  closeOnBackdrop?: boolean;

  children?: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}
