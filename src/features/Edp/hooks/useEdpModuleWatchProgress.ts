import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useGetEdpModuleWatchSummaryMutation } from '@/features/Edp/api/edpProgressApi';
import type { EdpCourseDetailsResponse } from '@/features/Edp/types/edpCourseDetails.types';
import {
  edpModuleTotalSecondsAndSubIds,
  formatEdpModuleProgressDisplay,
  type EdpModuleProgressDisplay,
} from '@/features/Edp/utils/edpModuleProgress';
import { selectToken } from '@/features/Auth/store/authSelectors';

export interface UseEdpModuleWatchProgressResult extends EdpModuleProgressDisplay {
  totalDurationSeconds: number;
  spentSeconds: number;
  refreshProgress: () => void;
}

export function useEdpModuleWatchProgress(
  detail: EdpCourseDetailsResponse | undefined,
  moduleSlug: string,
): UseEdpModuleWatchProgressResult {
  const token = useSelector(selectToken);
  const [fetchSummary] = useGetEdpModuleWatchSummaryMutation();
  const [moduleTotalSeconds, setModuleTotalSeconds] = useState<number | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const meta = useMemo(() => {
    if (detail == null) {
      return { totalDurationSeconds: 0, subCategoryIds: [] as number[] };
    }
    return edpModuleTotalSecondsAndSubIds(detail);
  }, [detail]);

  const { totalDurationSeconds, subCategoryIds } = meta;

  useEffect(() => {
    if (token == null || token.length === 0) {
      setModuleTotalSeconds(null);
      return;
    }
    if (subCategoryIds.length === 0) {
      setModuleTotalSeconds(0);
      return;
    }
    let active = true;
    setModuleTotalSeconds(null);
    void fetchSummary(subCategoryIds)
      .unwrap()
      .then((response) => {
        if (!active) {
          return;
        }
        setModuleTotalSeconds(
          typeof response.totalSeconds === 'number' ? response.totalSeconds : 0,
        );
      })
      .catch(() => {
        if (active) {
          setModuleTotalSeconds(0);
        }
      });
    return () => {
      active = false;
    };
  }, [token, moduleSlug, subCategoryIds, refreshTick, fetchSummary]);

  const loadingModuleWatch = Boolean(
    token != null && token.length > 0 && subCategoryIds.length > 0 && moduleTotalSeconds === null,
  );

  const spentSeconds =
    token != null && token.length > 0 && moduleTotalSeconds !== null ? moduleTotalSeconds : 0;

  const display = formatEdpModuleProgressDisplay(
    spentSeconds,
    totalDurationSeconds,
    loadingModuleWatch,
  );

  const refreshProgress = useCallback((): void => {
    setRefreshTick((tick) => tick + 1);
  }, []);

  return {
    ...display,
    totalDurationSeconds,
    spentSeconds,
    refreshProgress,
  };
}
