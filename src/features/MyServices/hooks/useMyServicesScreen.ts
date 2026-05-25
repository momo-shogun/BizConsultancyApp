import { useCallback, useEffect, useMemo, useState } from 'react';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import {
  myServicesApi,
  useGetMyOnboardingSubmissionsQuery,
} from '@/features/MyServices/api/myServicesApi';
import type {
  MyOnboardingSubmission,
  MyServicesFilterTab,
} from '@/features/MyServices/types/myServices.types';
import {
  canShowApplyButton,
  filterSubmissionsByTab,
  formatInrAmount,
  getSubmissionFilterTab,
  isUnpaidInProgress,
  sumSubmissionAmounts,
} from '@/features/MyServices/utils/myServicesStatus';
import { store } from '@/store';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';

const FILTER_TABS: Array<{ id: MyServicesFilterTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'action', label: 'Action needed' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'other', label: 'Other' },
];

export interface UseMyServicesScreenResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  items: MyOnboardingSubmission[];
  filteredItems: MyOnboardingSubmission[];
  activeTab: MyServicesFilterTab;
  filterTabs: typeof FILTER_TABS;
  tabCounts: Record<MyServicesFilterTab, number>;
  statsTotal: string;
  statsCount: number;
  selectedDetailId: number | null;
  setSelectedDetailId: (id: number | null) => void;
  setActiveTab: (tab: MyServicesFilterTab) => void;
  refresh: () => void;
  getCardFlags: (item: MyOnboardingSubmission) => {
    showContinue: boolean;
    showApply: boolean;
    isContinueLoading: boolean;
  };
}

export function useMyServicesScreen(): UseMyServicesScreenResult {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [activeTab, setActiveTab] = useState<MyServicesFilterTab>('all');
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const [applyEligibilityById, setApplyEligibilityById] = useState<
    Record<number, boolean>
  >({});
  const {
    data: items = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMyOnboardingSubmissionsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const errorMessage =
    error != null ? getApiErrorMessage(error, 'Failed to load services') : null;

  const tabCounts = useMemo((): Record<MyServicesFilterTab, number> => {
    const counts: Record<MyServicesFilterTab, number> = {
      all: items.length,
      action: 0,
      active: 0,
      completed: 0,
      other: 0,
    };
    for (const item of items) {
      counts[getSubmissionFilterTab(item)] += 1;
    }
    return counts;
  }, [items]);

  const filteredItems = useMemo(
    () => filterSubmissionsByTab(items, activeTab),
    [items, activeTab],
  );

  const statsTotal = useMemo(
    () => formatInrAmount(String(sumSubmissionAmounts(items))),
    [items],
  );

  useEffect(() => {
    let active = true;
    if (!isAuthenticated || items.length === 0) {
      setApplyEligibilityById({});
      return () => {
        active = false;
      };
    }

    void (async (): Promise<void> => {
      const entries = await Promise.all(
        items.map(async (item) => {
          try {
            const [ctx, docs] = await Promise.all([
              store
                .dispatch(
                  myServicesApi.endpoints.getServiceDetailFormContext.initiate(item.id, {
                    forceRefetch: false,
                  }),
                )
                .unwrap()
                .catch(() => null),
              store
                .dispatch(
                  myServicesApi.endpoints.getSubmissionDocumentRequirements.initiate(
                    item.id,
                    { forceRefetch: false },
                  ),
                )
                .unwrap()
                .catch(() => null),
            ]);
            const hasForm = (ctx?.form?.questions.length ?? 0) > 0;
            const hasDocs = (docs?.items.length ?? 0) > 0;
            return [item.id, hasForm || hasDocs] as const;
          } catch {
            return [item.id, false] as const;
          }
        }),
      );
      if (active) {
        setApplyEligibilityById(Object.fromEntries(entries));
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthenticated, items]);

  const refresh = useCallback((): void => {
    void refetch();
  }, [refetch]);

  const getCardFlags = useCallback(
    (item: MyOnboardingSubmission) => {
      const hasSlug = Boolean(item.serviceSlug?.trim());
      return {
        showContinue: isUnpaidInProgress(item) && hasSlug,
        showApply: canShowApplyButton(item, Boolean(applyEligibilityById[item.id])),
        isContinueLoading: false,
      };
    },
    [applyEligibilityById],
  );

  return {
    isAuthenticated,
    isLoading: isLoading && items.length === 0,
    isRefreshing: isFetching && !isLoading,
    errorMessage,
    items,
    filteredItems,
    activeTab,
    filterTabs: FILTER_TABS,
    tabCounts,
    statsTotal,
    statsCount: items.length,
    selectedDetailId,
    setSelectedDetailId,
    setActiveTab,
    refresh,
    getCardFlags,
  };
}
