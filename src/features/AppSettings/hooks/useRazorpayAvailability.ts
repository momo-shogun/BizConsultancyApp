import { useGetMobileAppSettingsQuery } from '@/features/AppSettings/api/mobileAppSettingsApi';

export interface RazorpayAvailability {
  isRazorpayEnabled: boolean;
  isLoading: boolean;
}

export function useRazorpayAvailability(): RazorpayAvailability {
  const { data, isLoading, isFetching } = useGetMobileAppSettingsQuery();

  return {
    isRazorpayEnabled: data?.skipRazorpayGateway !== true,
    isLoading: isLoading || isFetching,
  };
}
