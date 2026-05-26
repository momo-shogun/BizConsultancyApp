import type { EdpMetricCardItem } from '@/shared/components/cards/EdpMetricCard/EdpMetricCard';
import type { EdpStatsStripItem } from '@/shared/components/cards/EdpStatsStrip/EdpStatsStrip';

import {
  EDP_ACCENT_AMBER,
  EDP_ACCENT_BLUE,
  EDP_ACCENT_GREEN,
  EDP_ACCENT_PURPLE,
} from '../data/edpLandingData';
import type { EdpCoursesWithDocumentsResponse } from '../types/edpCourses.types';

export interface EdpLandingStats {
  videos: number;
  pdfs: number;
  modules: number;
  assessments: number;
}

export function resolveEdpLandingStats(
  data: EdpCoursesWithDocumentsResponse | undefined,
): EdpLandingStats {
  const videos = data?.totalVideos ?? 0;
  const pdfs = data?.totaldocument ?? 0;
  const modules =
    data?.totalmodule ??
    data?.freeEdps?.length ??
    data?.edp_list?.length ??
    0;
  return {
    videos,
    pdfs,
    modules,
    assessments: 0,
  };
}

export function mapEdpStatsToStripItems(stats: EdpLandingStats): EdpStatsStripItem[] {
  return [
    { label: 'Videos', value: String(stats.videos) },
    { label: 'PDFs', value: String(stats.pdfs) },
    { label: 'Modules', value: String(stats.modules) },
    { label: 'Assessments', value: String(stats.assessments) },
  ];
}

export function mapEdpStatsToMetricItems(stats: EdpLandingStats): EdpMetricCardItem[] {
  return [
    {
      label: 'Video lectures',
      value: String(stats.videos),
      icon: '▶',
      accent: EDP_ACCENT_GREEN,
    },
    {
      label: 'PDF resources',
      value: String(stats.pdfs),
      icon: '⊞',
      accent: EDP_ACCENT_AMBER,
    },
    {
      label: 'Modules',
      value: String(stats.modules),
      icon: '◈',
      accent: EDP_ACCENT_BLUE,
    },
    {
      label: 'Assessments',
      value: String(stats.assessments),
      icon: '✦',
      accent: EDP_ACCENT_PURPLE,
    },
  ];
}

