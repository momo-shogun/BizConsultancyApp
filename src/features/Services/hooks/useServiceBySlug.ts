import { useGetPublicServicePageBySlugQuery } from '@/features/Services/api/servicesApi';

import type { ServicePage } from '../screens/types';

export interface UseServiceBySlugResult {
  service: ServicePage | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useServiceBySlug(slug: string): UseServiceBySlugResult {
  const { data, isLoading, isFetching, isError } = useGetPublicServicePageBySlugQuery(slug, {
    skip: !slug,
  });

  return {
    service: data,
    isLoading: (isLoading || isFetching) && data == null,
    isError,
  };
}
