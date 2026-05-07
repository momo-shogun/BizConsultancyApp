import { useMemo } from 'react';

import type { RecommendedServiceItem } from '@/shared/components';

import { DEMO_SERVICES } from '../data/demoServices';

export function useServiceBySlug(slug: string): RecommendedServiceItem | undefined {
  return useMemo(() => DEMO_SERVICES.find((s) => s.slug === slug), [slug]);
}
