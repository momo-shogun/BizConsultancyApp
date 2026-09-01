import { Platform } from 'react-native';

import { useGetMobileAppSettingsQuery } from '@/features/AppSettings/api/mobileAppSettingsApi';

export interface RazorpayAvailability {
  isLoading: boolean;
  /**
   * Razorpay checkout is enabled server-side (`skipRazorpayGateway !== true`).
   * On iOS this is only true when paid purchase CTAs are also allowed.
   */
  isRazorpayEnabled: boolean;
  /**
   * Master gate for any in-app purchase UI or wallet/Razorpay checkout.
   * Sourced from `GET public/mobile-app-settings` → `skipRazorpayGateway`.
   * Android: always true once settings load. iOS: false while loading or when skipped.
   */
  canShowPaidPurchaseCtas: boolean;
}

export function useRazorpayAvailability(): RazorpayAvailability {
  const { data, isLoading, isFetching } = useGetMobileAppSettingsQuery();
  const settingsResolved = data != null;
  const razorpayAllowedByServer = data?.skipRazorpayGateway !== true;

  const canShowPaidPurchaseCtas =
    Platform.OS !== 'ios' || (settingsResolved && razorpayAllowedByServer);

  return {
    isLoading: isLoading || isFetching,
    canShowPaidPurchaseCtas,
    isRazorpayEnabled: canShowPaidPurchaseCtas && razorpayAllowedByServer,
  };
}
