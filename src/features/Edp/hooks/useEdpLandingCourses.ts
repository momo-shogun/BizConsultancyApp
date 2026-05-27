import { useMemo } from 'react';

import type { EdpMetricCardItem } from '@/shared/components/cards/EdpMetricCard/EdpMetricCard';
import type { EdpStatsStripItem } from '@/shared/components/cards/EdpStatsStrip/EdpStatsStrip';

import type { EdpCurriculumModule } from '../types/edpCurriculum.types';
import { useGetEdpCoursesWithDocumentsQuery } from '../api/edpLandingApi';
import { mapFreeEdpsToCurriculumModules } from '../utils/edpCurriculumMappers';
import {
  mapEdpStatsToMetricItems,
  mapEdpStatsToStripItems,
  resolveEdpLandingStats,
} from '../utils/edpLandingMappers';

export interface UseEdpLandingCoursesResult {
  stripStats: EdpStatsStripItem[];
  metricItems: EdpMetricCardItem[];
  curriculumModules: EdpCurriculumModule[];
  moduleCount: number;
  isLoading: boolean;
  isError: boolean;
  isCurriculumEmpty: boolean;
}

export function useEdpLandingCourses(): UseEdpLandingCoursesResult {
  const { data, isLoading, isError } = useGetEdpCoursesWithDocumentsQuery();

  const stats = useMemo(() => resolveEdpLandingStats(data), [data]);

  const stripStats = useMemo(() => mapEdpStatsToStripItems(stats), [stats]);
  const metricItems = useMemo(() => mapEdpStatsToMetricItems(stats), [stats]);
  const curriculumModules = useMemo(
    () => mapFreeEdpsToCurriculumModules(data?.freeEdps),
    [data?.freeEdps],
  );

  return {
    stripStats,
    metricItems,
    curriculumModules,
    moduleCount: curriculumModules.length,
    isLoading,
    isError,
    isCurriculumEmpty: !isLoading && curriculumModules.length === 0,
  };
}
