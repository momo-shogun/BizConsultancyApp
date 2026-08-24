import { Platform } from 'react-native';

/**
 * iOS will not present Razorpay while a React Native Modal is still dismissing.
 * Android is more tolerant, but a short yield still avoids a race with the overlay.
 */
const NATIVE_MODAL_DISMISS_MS = Platform.OS === 'ios' ? 600 : 150;

export function waitForNativeModalDismiss(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, NATIVE_MODAL_DISMISS_MS);
  });
}
