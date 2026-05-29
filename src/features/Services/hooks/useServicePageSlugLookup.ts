import { useCallback, useMemo } from 'react';

import { useGetPublicServicesQuery } from '@/features/Services/api/servicesApi';

import type { RecommendedServiceCard } from '../screens/types';

const SERVICE_CATALOG_LIMIT = 100;

export interface UseServicePageSlugLookupResult {
  resolveRecommendedTargetSlug: (item: RecommendedServiceCard) => string;
}

/**
 * Resolves recommended-card `servicePageId` to the canonical public service slug
 * (same catalog as the services list). Falls back to href-derived slug on the item.
 */
export function useServicePageSlugLookup(): UseServicePageSlugLookupResult {
  const { data } = useGetPublicServicesQuery({ limit: SERVICE_CATALOG_LIMIT });

  const slugByPageId = useMemo((): ReadonlyMap<number, string> => {
    const map = new Map<number, string>();
    for (const row of data?.items ?? []) {
      map.set(row.id, row.slug);
    }
    return map;
  }, [data?.items]);

  const resolveRecommendedTargetSlug = useCallback(
    (item: RecommendedServiceCard): string => {
      const pageId = item.servicePageId;
      if (pageId != null) {
        const fromCatalog = slugByPageId.get(pageId);
        if (fromCatalog != null && fromCatalog.length > 0) {
          return fromCatalog;
        }
      }
      return item.slug.trim();
    },
    [slugByPageId],
  );

  return { resolveRecommendedTargetSlug };
}
