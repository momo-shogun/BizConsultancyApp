import {
  useGetPublicServiceFormBySlugQuery,
  useLazyGetPublicServiceFormBySlugQuery,
} from '@/features/Services/api/servicesApi';

import type { PublicServiceFormConfig } from '../types/publicServiceApi.types';

export interface UsePublicServiceFormResult {
  form: PublicServiceFormConfig | undefined;
  isLoading: boolean;
  isError: boolean;
}

/** Onboarding form config for a service slug (for future intake flows). */
export function usePublicServiceForm(slug: string): UsePublicServiceFormResult {
  const { data, isLoading, isFetching, isError } = useGetPublicServiceFormBySlugQuery(slug, {
    skip: !slug,
  });

  return {
    form: data,
    isLoading: (isLoading || isFetching) && data == null,
    isError,
  };
}

export { useLazyGetPublicServiceFormBySlugQuery };
