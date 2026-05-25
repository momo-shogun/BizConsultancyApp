import type { ViewStyle } from 'react-native';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'alert';

export type ToastPosition = 'top' | 'bottom';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastConfig {
  variant?: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
  dismissible?: boolean;
  position?: ToastPosition;
  /** Defaults to 2. Use a higher value for long error messages. */
  messageNumberOfLines?: number;
}

export interface ToastProps extends ToastConfig {
  visible: boolean;
  onDismiss: () => void;
  style?: ViewStyle;
}

export interface ToastContextValue {
  show: (config: ToastConfig | string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  alert: (message: string, title?: string) => void;
  dismiss: () => void;
}
