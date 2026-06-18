import { useMemo } from 'react';

import { selectHasVerifiedLogin } from '@/features/Auth/store/authSelectors';
import { useGetMyOnboardingSubmissionsQuery } from '@/features/MyServices/api/myServicesApi';
import { useAppSelector } from '@/store/typedHooks';

import {
  buildPurchasedServicesBySlug,
  getPurchasedServiceEntry,
  isServiceSlugPurchased,
  type PurchasedServiceEntry,
  type PurchasedServicesBySlug,
} from '../utils/purchasedServiceLookup';

export interface UsePurchasedServicesLookupResult {
  purchasedBySlug: PurchasedServicesBySlug;
  isLoading: boolean;
  isServicePurchased: (slug: string) => boolean;
  getPurchasedEntry: (slug: string) => PurchasedServiceEntry | null;
}

export function usePurchasedServicesLookup(): UsePurchasedServicesLookupResult {
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const { data: submissions = [], isLoading, isFetching } = useGetMyOnboardingSubmissionsQuery(
    undefined,
    { skip: !hasVerifiedLogin },
  );

  const purchasedBySlug = useMemo(
    () => buildPurchasedServicesBySlug(submissions),
    [submissions],
  );

  return {
    purchasedBySlug,
    isLoading: hasVerifiedLogin && (isLoading || isFetching),
    isServicePurchased: (slug: string) => isServiceSlugPurchased(purchasedBySlug, slug),
    getPurchasedEntry: (slug: string) => getPurchasedServiceEntry(purchasedBySlug, slug),
  };
}
