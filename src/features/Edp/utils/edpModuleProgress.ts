import type { EdpCourseDetailsResponse } from '../types/edpCourseDetails.types';
import type { EdpFreeEdpModule } from '../types/edpCourses.types';

import { parseMysqlTimeToSeconds } from './edpCourseDetailsParsing';

/** Approximate minutes from `HH:MM:SS` (web `parseDurationToMinutesApprox`). */
export function parseDurationToMinutesApprox(value: string | undefined): number {
  if (value == null || value.trim().length === 0) {
    return 0;
  }
  const parts = value.split(':').map((part) => Number(part.trim()));
  if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
    return Math.round(parts[0] * 60 + parts[1] + parts[2] / 60);
  }
  const n = Number(value);
  if (Number.isFinite(n) && n > 0) {
    return Math.round(n / 60);
  }
  return 0;
}

export interface EdpModuleProgressMeta {
  totalDurationSeconds: number;
  subCategoryIds: number[];
}

/** Denominator + sub-topic ids — same rules as web `/edp/modules/[slug]`. */
export function edpModuleTotalSecondsAndSubIds(
  detail: EdpCourseDetailsResponse,
): EdpModuleProgressMeta {
  const subs = detail.edpSubSubCategories ?? [];
  const subCategoryIds = subs.map((sub) => sub.id).filter((id) => Number.isFinite(id) && id > 0);
  const course = detail.edpCourseDetail;
  const videoCount = course.e_videos_count ?? 0;
  const totalPieces = subs.reduce((acc, sub) => acc + (sub.edp_content?.length ?? 0), 0);
  const moduleTotalMin = parseDurationToMinutesApprox(course.total_duration);
  const estMinutesTotal =
    moduleTotalMin > 0 ? moduleTotalMin : Math.max(20, videoCount * 12 + totalPieces * 8);
  const fromCourse = parseMysqlTimeToSeconds(course.total_duration);
  const totalDurationSeconds =
    fromCourse > 0 ? fromCourse : Math.max(20 * 60, estMinutesTotal * 60);
  return { totalDurationSeconds, subCategoryIds };
}

/** Fallback when course-details fetch fails — catalogue topics only (web `metaFromCatalogueModule`). */
export function metaFromCatalogueModule(module: EdpFreeEdpModule): EdpModuleProgressMeta {
  const subCategoryIds = (module.sub_sub_category ?? [])
    .map((sub) => sub.id)
    .filter((id) => Number.isFinite(id) && id > 0);
  const videoCount = module.e_videos_count ?? 0;
  const docCount = module.e_documents_count ?? 0;
  const totalDurationSeconds = Math.max(20 * 60, videoCount * 12 * 60 + docCount * 8 * 60);
  return { totalDurationSeconds, subCategoryIds };
}

export interface EdpModuleProgressDisplay {
  progressPercent: number;
  spentLabel: string;
  remainingLabel: string;
  progressLabel: string;
  isLoading: boolean;
}

export function formatEdpModuleProgressDisplay(
  spentSeconds: number,
  totalDurationSeconds: number,
  isLoading: boolean,
): EdpModuleProgressDisplay {
  if (isLoading) {
    return {
      progressPercent: 0,
      spentLabel: '—',
      remainingLabel: '—',
      progressLabel: '—',
      isLoading: true,
    };
  }
  const spentMinutes = Math.floor(spentSeconds / 60);
  const plannedMinutes = Math.max(1, Math.ceil(totalDurationSeconds / 60));
  const leftMinutes = Math.max(0, plannedMinutes - spentMinutes);
  const progressPercent =
    totalDurationSeconds > 0
      ? Math.min(100, Math.round((spentSeconds / totalDurationSeconds) * 100))
      : 0;
  return {
    progressPercent,
    spentLabel: `${spentMinutes}m`,
    remainingLabel: `${leftMinutes}m`,
    progressLabel: `${progressPercent}%`,
    isLoading: false,
  };
}
