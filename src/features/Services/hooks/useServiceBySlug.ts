import { useEffect } from 'react';

import { useGetPublicServicePageBySlugQuery } from '@/features/Services/api/servicesApi';

import type { ServicePage } from '../screens/types';

export interface UseServiceBySlugResult {
  service: ServicePage | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useServiceBySlug(slug: string): UseServiceBySlugResult {
  const query = useGetPublicServicePageBySlugQuery(slug, {
    skip: slug.length === 0,
  });

  const { data, isLoading, isFetching, isError, error } = query;

  useEffect(() => {
    if (!__DEV__ || slug.length === 0) {
      return;
    }
    console.log('[ServiceDetail] screen — loading', { slug, route: 'App/Services/Detail' });
  }, [slug]);

  useEffect(() => {
    if (!__DEV__ || slug.length === 0) {
      return;
    }
    if (isError) {
      console.log('[ServiceDetail] screen — error', { slug, error });
      return;
    }
    if (data != null && !isFetching) {
      console.log('[ServiceDetail] screen — ready', {
        slug,
        title: data.title,
        eligibility: data.eligibility,
      });
    }
  }, [slug, data, isError, error, isFetching]);

  return {
    service: data,
    isLoading: (isLoading || isFetching) && data == null,
    isError,
  };
}
