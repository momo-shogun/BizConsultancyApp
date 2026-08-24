import { baseApi } from '@/services/api/baseApi';

export interface MobileAppSettings {
  skipRazorpayGateway: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  return false;
}

function parseMobileAppSettings(response: unknown): MobileAppSettings {
  if (!isRecord(response)) {
    return { skipRazorpayGateway: false };
  }
  return {
    skipRazorpayGateway: parseBoolean(response.skipRazorpayGateway),
  };
}

export const mobileAppSettingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMobileAppSettings: build.query<MobileAppSettings, void>({
      query: () => ({ url: 'public/mobile-app-settings' }),
      transformResponse: (response: unknown): MobileAppSettings =>
        parseMobileAppSettings(response),
    }),
  }),
});

export const {
  useGetMobileAppSettingsQuery,
} = mobileAppSettingsApi;
