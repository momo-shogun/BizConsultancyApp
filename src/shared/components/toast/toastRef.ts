import type { ToastConfig, ToastContextValue } from './toast.types';

let ref: ToastContextValue | null = null;

export function setToastRef(toast: ToastContextValue) {
  ref = toast;
}

export function showGlobalToast(config: ToastConfig | string) {
  ref?.show(config);
}

export function showGlobalError(message: string, title?: string) {
  ref?.error(message, title);
}
