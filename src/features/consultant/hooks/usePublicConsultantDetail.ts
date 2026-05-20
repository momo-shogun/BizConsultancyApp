import { useMemo } from 'react';

import { useGetPublicConsultantBySlugQuery } from '@/features/consultant/api/consultantApi';
import type { ConsultantDetail } from '@/features/consultant/types/consultantDetail.types';

export interface UsePublicConsultantDetailResult {
  detail: ConsultantDetail | null;
  isLoading: boolean;
  isFromApi: boolean;
}

export function usePublicConsultantDetail(slug: string): UsePublicConsultantDetailResult {
  const { data, isLoading, isFetching } = useGetPublicConsultantBySlugQuery(slug);

  const detail = useMemo((): ConsultantDetail | null => data ?? null, [data]);

  return {
    detail,
    isLoading: (isLoading || isFetching) && data == null,
    isFromApi: data != null,
  };
}
