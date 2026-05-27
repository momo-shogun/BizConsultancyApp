import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useGetEdpModuleWatchSummariesBatchMutation } from '@/features/Edp/api/edpProgressApi';
import { edpModuleApi } from '@/features/Edp/api/edpModuleApi';
import type { EdpFreeEdpModule } from '@/features/Edp/types/edpCourses.types';
import {
  edpModuleTotalSecondsAndSubIds,
  metaFromCatalogueModule,
} from '@/features/Edp/utils/edpModuleProgress';
import { selectToken } from '@/features/Auth/store/authSelectors';
import { store } from '@/store';

export interface EdpModuleListProgressRow {
  progressPercent: number;
  spentMinutes: number;
  leftMinutes: number;
}

function resolveModuleSlug(module: EdpFreeEdpModule): string {
  const slug = module.slug?.trim();
  return slug != null && slug.length > 0 ? slug : `id-${module.id}`;
}

/**
 * Same flow as web `/edp/modules`: course-details per module → batch watch summary → %.
 */
export function useEdpModulesListProgress(
  modules: EdpFreeEdpModule[] | undefined,
): {
  progressBySlug: Record<string, EdpModuleListProgressRow>;
  isProgressLoading: boolean;
} {
  const token = useSelector(selectToken);
  const [batchSummary] = useGetEdpModuleWatchSummariesBatchMutation();
  const [progressBySlug, setProgressBySlug] = useState<Record<string, EdpModuleListProgressRow>>(
    {},
  );
  const [isProgressLoading, setIsProgressLoading] = useState(false);

  const moduleKey = useMemo(() => {
    if (modules == null || modules.length === 0) {
      return '';
    }
    return modules.map((module) => resolveModuleSlug(module)).join('|');
  }, [modules]);

  useEffect(() => {
    if (modules == null || modules.length === 0) {
      setProgressBySlug({});
      setIsProgressLoading(false);
      return;
    }

    let cancelled = false;
    setIsProgressLoading(true);

    void (async () => {
      try {
        const details = await Promise.all(
          modules.map((module) => {
            const slug = resolveModuleSlug(module);
            if (slug.startsWith('id-')) {
              return Promise.resolve(null);
            }
            return store
              .dispatch(edpModuleApi.endpoints.getEdpCourseDetails.initiate(slug))
              .unwrap()
              .catch(() => null);
          }),
        );

        if (cancelled) {
          return;
        }

        const meta = modules.map((module, index) => {
          const detail = details[index];
          return detail != null
            ? edpModuleTotalSecondsAndSubIds(detail)
            : metaFromCatalogueModule(module);
        });

        let totals: number[] = meta.map(() => 0);
        if (token != null && token.length > 0 && meta.some((row) => row.subCategoryIds.length > 0)) {
          try {
            const response = await batchSummary(meta.map((row) => row.subCategoryIds)).unwrap();
            totals = response.totals;
          } catch {
            totals = meta.map(() => 0);
          }
        }

        if (cancelled) {
          return;
        }

        const next: Record<string, EdpModuleListProgressRow> = {};
        modules.forEach((module, index) => {
          const slug = resolveModuleSlug(module);
          const denom = meta[index].totalDurationSeconds;
          const watched = totals[index] ?? 0;
          const progressPercent =
            denom > 0 ? Math.min(100, Math.round((watched / denom) * 100)) : 0;
          const spentMinutes = Math.floor(watched / 60);
          const plannedMinutes = Math.max(1, Math.ceil(denom / 60));
          const leftMinutes = Math.max(0, plannedMinutes - spentMinutes);
          next[slug] = { progressPercent, spentMinutes, leftMinutes };
        });
        setProgressBySlug(next);
      } catch {
        if (!cancelled) {
          setProgressBySlug({});
        }
      } finally {
        if (!cancelled) {
          setIsProgressLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [moduleKey, modules, token, batchSummary]);

  return { progressBySlug, isProgressLoading };
}
