import { useMemo } from 'react';

import type { RecommendedServiceItem } from '@/shared/components';

import { DEMO_SERVICES } from '../data/demoServices';
import { ServicePage } from '../screens/types';

export function useServiceBySlug(slug: string): ServicePage | undefined {
  return useMemo(() => DEMO_SERVICES.find((s) => s.slug === slug), [slug]);
}
