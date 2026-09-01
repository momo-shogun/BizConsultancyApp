import { Platform } from 'react-native';

import { useGetMobileAppSettingsQuery } from '@/features/AppSettings/api/mobileAppSettingsApi';

export interface RazorpayAvailability {
  isRazorpayEnabled: boolean;
  isLoading: boolean;
  /** iOS hides paid CTAs until settings load and Razorpay is enabled. Android always shows them. */
  canShowPaidPurchaseCtas: boolean;
}

export function useRazorpayAvailability(): RazorpayAvailability {
  const { data, isLoading, isFetching } = useGetMobileAppSettingsQuery();
  const isRazorpayEnabled = data?.skipRazorpayGateway !== true;
  const settingsResolved = data != null;

  return {
    isRazorpayEnabled,
    isLoading: isLoading || isFetching,
    canShowPaidPurchaseCtas:
      Platform.OS !== 'ios' || (settingsResolved && isRazorpayEnabled),
  };
}
