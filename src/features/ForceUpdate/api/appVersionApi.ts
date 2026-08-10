import { baseApi } from '@/services/api/baseApi';

export interface AppVersionPolicy {
  androidMinVersionCode: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readNonNegativeInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }
  return null;
}

function parseAppVersionPolicy(raw: unknown): AppVersionPolicy | null {
  if (!isRecord(raw)) {
    return null;
  }
  const androidMinVersionCode = readNonNegativeInt(raw.androidMinVersionCode);
  if (androidMinVersionCode == null) {
    return null;
  }
  return { androidMinVersionCode };
}

export const appVersionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAppVersionPolicy: build.query<AppVersionPolicy, void>({
      query: () => ({ url: 'public/app-version' }),
      transformResponse: (response: unknown): AppVersionPolicy => {
        const parsed = parseAppVersionPolicy(response);
        if (parsed == null) {
          return { androidMinVersionCode: 0 };
        }
        return parsed;
      },
    }),
  }),
});

export const { useGetAppVersionPolicyQuery, useLazyGetAppVersionPolicyQuery } = appVersionApi;
