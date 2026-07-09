import type { NavigationProp } from '@react-navigation/native';

import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';
import { showGlobalToast } from '@/shared/components';

import type { EdpModuleLang } from '../types/edpCourseDetails.types';
import type { EdpFreeEdpModule } from '../types/edpCourses.types';
import { normalizeEdpModuleSlug } from './edpCourseDetailsParsing';
import { promptEdpEnrollment } from './edpEnrollPrompt';
import { isYoutubeUrl, resolveEdpVideoEmbed } from './edpMedia';

export function findEdpFreeEdpModuleBySlug(
  freeEdps: EdpFreeEdpModule[] | undefined,
  moduleSlug: string,
): EdpFreeEdpModule | null {
  const normalized = normalizeEdpModuleSlug(moduleSlug);
  if (normalized.length === 0 || freeEdps == null) {
    return null;
  }

  return (
    freeEdps.find((item) => {
      const slug = item.slug?.trim();
      if (slug != null && slug.length > 0) {
        return normalizeEdpModuleSlug(slug) === normalized;
      }
      return `id-${item.id}` === normalized;
    }) ?? null
  );
}

/** Guest-playable URL comes only from `freeEdps[].url` in the catalogue response. */
export function resolveEdpModuleOverviewUrl(
  freeEdps: EdpFreeEdpModule[] | undefined,
  moduleSlug: string,
): string | null {
  const module = findEdpFreeEdpModuleBySlug(freeEdps, moduleSlug);
  const url = module?.url?.trim();
  return url != null && url.length > 0 ? url : null;
}

export function openEdpModuleOverviewVideo(
  navigation: NavigationProp<EdpStackParamList>,
  params: { title: string; videoUrl: string },
): boolean {
  const url = params.videoUrl.trim();
  if (url.length === 0) {
    showGlobalToast({
      variant: 'info',
      message: 'Module video is not available yet.',
    });
    return false;
  }

  if (isYoutubeUrl(url) && resolveEdpVideoEmbed(url).youtubeVideoId == null) {
    showGlobalToast({
      variant: 'error',
      message: 'Could not load this video.',
    });
    return false;
  }

  navigation.navigate(ROUTES.Edp.OverviewVideo, {
    title: params.title,
    videoUrl: url,
  });
  return true;
}

export function openEdpModuleForUser(
  navigation: NavigationProp<EdpStackParamList>,
  params: {
    canAccessFullEdp: boolean;
    isLoggedInUser: boolean;
    isConsultant?: boolean;
    moduleSlug: string;
    moduleTitle: string;
    overviewVideoUrl: string | null | undefined;
    lang?: EdpModuleLang;
  },
): void {
  const {
    canAccessFullEdp,
    isLoggedInUser,
    isConsultant,
    moduleSlug,
    moduleTitle,
    overviewVideoUrl,
    lang = 'en',
  } = params;
  const slug = normalizeEdpModuleSlug(moduleSlug);

  if (isLoggedInUser && !canAccessFullEdp) {
    promptEdpEnrollment({ isConsultant });
    return;
  }

  if (!isLoggedInUser) {
    const url = overviewVideoUrl?.trim();
    if (url == null || url.length === 0) {
      showGlobalToast({
        variant: 'info',
        message: 'Module video is not available yet.',
      });
      return;
    }
    openEdpModuleOverviewVideo(navigation, { title: moduleTitle, videoUrl: url });
    return;
  }

  if (slug.length === 0 || slug.startsWith('id-')) {
    const url = overviewVideoUrl?.trim();
    if (url == null || url.length === 0) {
      showGlobalToast({
        variant: 'info',
        message: 'Module video is not available yet.',
      });
      return;
    }
    openEdpModuleOverviewVideo(navigation, { title: moduleTitle, videoUrl: url });
    return;
  }

  navigation.navigate(ROUTES.Edp.ModuleDetail, { slug, lang });
}
