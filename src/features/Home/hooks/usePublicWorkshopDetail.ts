import { useMemo } from 'react';

import { useGetPublicWorkshopBySlugQuery } from '@/features/Home/api/workshopsApi';
import type { PublicWorkshopApiRow } from '@/features/Home/types/publicWorkshopApi.types';

export interface UsePublicWorkshopDetailResult {
  workshop: PublicWorkshopApiRow | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
}

export function usePublicWorkshopDetail(slug: string): UsePublicWorkshopDetailResult {
  const { data, isLoading, isFetching, isError, refetch } = useGetPublicWorkshopBySlugQuery(slug, {
    skip: slug.trim().length === 0,
  });

  const workshop = useMemo((): PublicWorkshopApiRow | null => data ?? null, [data]);

  return {
    workshop,
    isLoading: (isLoading || isFetching) && data == null,
    isFetching,
    isError,
    refetch,
  };
}
