import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { showGlobalToast } from '@/shared/components';
import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';

import type { EdpCurriculumModule } from '../types/edpCurriculum.types';
import { useEdpAccess } from './useEdpAccess';
import { isYoutubeUrl, resolveEdpVideoEmbed } from '../utils/edpMedia';
import { openEdpModulePdf } from '../utils/edpPdfActions';

export interface UseEdpCurriculumActionsResult {
  onKnowMore: (module: EdpCurriculumModule) => void;
  onViewModulePdf: (module: EdpCurriculumModule) => void;
}

export function useEdpCurriculumActions(): UseEdpCurriculumActionsResult {
  const navigation = useNavigation<NavigationProp<EdpStackParamList>>();
  const { canAccessFullEdp, isLoggedInUser, promptEnroll } = useEdpAccess();

  const onKnowMore = useCallback(
    (module: EdpCurriculumModule): void => {
      if (isLoggedInUser && !canAccessFullEdp) {
        promptEnroll();
        return;
      }

      const slug = module.slug.trim();
      if (canAccessFullEdp && slug.length > 0 && !slug.startsWith('id-')) {
        navigation.navigate(ROUTES.Edp.ModuleDetail, { slug, lang: 'en' });
        return;
      }

      const url = module.videoUrl?.trim();
      if (url == null || url.length === 0) {
        showGlobalToast({
          variant: 'info',
          message: 'Module video is not available yet.',
        });
        return;
      }

      if (isYoutubeUrl(url) && resolveEdpVideoEmbed(url).youtubeVideoId == null) {
        showGlobalToast({
          variant: 'error',
          message: 'Could not load this video.',
        });
        return;
      }

      navigation.navigate(ROUTES.Edp.OverviewVideo, {
        title: module.name,
        videoUrl: url,
      });
    },
    [canAccessFullEdp, isLoggedInUser, navigation, promptEnroll],
  );

  const onViewModulePdf = useCallback(
    (module: EdpCurriculumModule): void => {
      if (!canAccessFullEdp) {
        if (isLoggedInUser) {
          promptEnroll();
        } else {
          showGlobalToast({
            variant: 'info',
            message: 'Enroll in the EDP programme to download module PDFs.',
          });
        }
        return;
      }
      void openEdpModulePdf(module.modulePdfUrl, module.name);
    },
    [canAccessFullEdp, isLoggedInUser, promptEnroll],
  );

  return {
    onKnowMore,
    onViewModulePdf,
  };
}
