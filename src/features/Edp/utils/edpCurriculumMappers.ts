import type { EdpCurriculumModule, EdpCurriculumTopic } from '../types/edpCurriculum.types';
import type { EdpFreeEdpModule } from '../types/edpCourses.types';
import { resolveEdpOverviewModulePdfUrl } from './edpMedia';

function resolveModuleSlug(module: EdpFreeEdpModule): string {
  const slug = module.slug?.trim();
  return slug != null && slug.length > 0 ? slug : `id-${module.id}`;
}

function mapTopics(module: EdpFreeEdpModule): EdpCurriculumTopic[] {
  const rows = module.sub_sub_category ?? [];
  return rows.map((topic, index) => ({
    serial: index + 1,
    name: topic.name.trim() || `Topic ${index + 1}`,
  }));
}

/** Same source and shape as web `overviewModules` from `freeEdps`. */
export function mapFreeEdpsToCurriculumModules(
  freeEdps: EdpFreeEdpModule[] | undefined,
): EdpCurriculumModule[] {
  if (freeEdps == null || freeEdps.length === 0) {
    return [];
  }

  return freeEdps.map((module, moduleIndex) => {
    const videoUrl = module.url?.trim();
    return {
      id: resolveModuleSlug(module),
      name: module.name.trim() || `Module ${moduleIndex + 1}`,
      videoCount: module.e_videos_count ?? 0,
      pdfCount: module.e_documents_count ?? 0,
      videoUrl: videoUrl != null && videoUrl.length > 0 ? videoUrl : undefined,
      modulePdfUrl: resolveEdpOverviewModulePdfUrl(moduleIndex),
      topics: mapTopics(module),
    };
  });
}
