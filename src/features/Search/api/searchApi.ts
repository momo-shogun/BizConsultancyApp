import { baseApi } from '@/services/api/baseApi';

import type { ServiceSearchHit, ServiceSearchQuery } from '../types/search.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseServiceSearchHit(raw: unknown): ServiceSearchHit | null {
  if (!isRecord(raw)) {
    return null;
  }
  const title = raw.title;
  const slug = raw.slug;
  if (typeof title !== 'string' || typeof slug !== 'string') {
    return null;
  }
  if (title.trim().length === 0 || slug.trim().length === 0) {
    return null;
  }
  const categorySlug = raw.categorySlug;
  return {
    title: title.trim(),
    slug: slug.trim(),
    categorySlug: typeof categorySlug === 'string' ? categorySlug : null,
  };
}

export function parseServiceSearchResponse(raw: unknown): ServiceSearchHit[] {
  const tryList = (items: unknown[]): ServiceSearchHit[] => {
    const result: ServiceSearchHit[] = [];
    for (const item of items) {
      const hit = parseServiceSearchHit(item);
      if (hit != null) {
        result.push(hit);
      }
    }
    return result;
  };

  if (Array.isArray(raw)) {
    return tryList(raw);
  }
  if (!isRecord(raw)) {
    return [];
  }
  const nested = raw.data ?? raw.results ?? raw.items;
  if (Array.isArray(nested)) {
    return tryList(nested);
  }
  return [];
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchServices: build.query<ServiceSearchHit[], ServiceSearchQuery>({
      query: ({ q, limit }) => ({
        url: 'public/service-search',
        params: { q: q.trim(), limit: limit ?? 10 },
      }),
      transformResponse: (response: unknown): ServiceSearchHit[] => parseServiceSearchResponse(response),
      keepUnusedDataFor: 120,
    }),
  }),
});

export const { useSearchServicesQuery, useLazySearchServicesQuery } = searchApi;
