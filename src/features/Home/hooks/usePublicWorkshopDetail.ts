import { useMemo } from 'react';

import { useGetPublicWorkshopBySlugQuery } from '@/features/Home/api/workshopsApi';
import type { PublicWorkshopApiRow } from '@/features/Home/types/publicWorkshopApi.types';

export interface UsePublicWorkshopDetailResult {
  workshop: PublicWorkshopApiRow | null;
  isLoading: boolean;
  isError: boolean;
}

export function usePublicWorkshopDetail(slug: string): UsePublicWorkshopDetailResult {
  const { data, isLoading, isFetching, isError } = useGetPublicWorkshopBySlugQuery(slug, {
    skip: slug.trim().length === 0,
  });

  const workshop = useMemo((): PublicWorkshopApiRow | null => data ?? null, [data]);

  return {
    workshop,
    isLoading: (isLoading || isFetching) && data == null,
    isError,
  };
}
