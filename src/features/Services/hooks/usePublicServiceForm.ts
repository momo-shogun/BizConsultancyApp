import {
  useGetPublicServiceFormBySlugQuery,
  useLazyGetPublicServiceFormBySlugQuery,
} from '../api/servicesApi';
import type { OnboardingFormConfigResponse } from '../types/serviceOnboarding.types';

export interface UsePublicServiceFormResult {
  form: OnboardingFormConfigResponse | null | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function usePublicServiceForm(slug: string): UsePublicServiceFormResult {
  const { data, isLoading, isFetching, isError } = useGetPublicServiceFormBySlugQuery(slug, {
    skip: slug.length === 0,
  });

  return {
    form: data,
    isLoading,
    isFetching,
    isError,
  };
}

export { useLazyGetPublicServiceFormBySlugQuery };
