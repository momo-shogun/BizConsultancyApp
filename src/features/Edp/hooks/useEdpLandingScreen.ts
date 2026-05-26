import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';

import { useBizAIScrollReporter } from '@/features/BizAI/hooks/useBizAIScrollReporter';

import { useEdpLandingCourses } from './useEdpLandingCourses';
import { useEdpLandingFaqs } from './useEdpLandingFaqs';

export interface UseEdpLandingScreenOptions {
  onModulePress?: (moduleSlug: string) => void;
  onViewAllModules?: () => void;
}

export function useEdpLandingScreen(options: UseEdpLandingScreenOptions = {}) {
  const navigation = useNavigation<NavigationProp<EdpStackParamList>>();
  const onBizAiScroll = useBizAIScrollReporter();
  const courses = useEdpLandingCourses();
  const faqs = useEdpLandingFaqs();

  const navigateToModules = useCallback((): void => {
    navigation.navigate(ROUTES.Edp.Modules);
  }, [navigation]);

  const onGetStarted = useCallback((): void => {
    navigateToModules();
  }, [navigateToModules]);

  const openModules = useCallback((): void => {
    if (options.onViewAllModules != null) {
      options.onViewAllModules();
      return;
    }
    navigateToModules();
  }, [navigateToModules, options.onViewAllModules]);

  const handleModulePress = useCallback(
    (moduleSlug: string): void => {
      if (options.onModulePress != null) {
        options.onModulePress(moduleSlug);
        return;
      }
      navigateToModules();
    },
    [navigateToModules, options.onModulePress],
  );

  return {
    onBizAiScroll,
    courses,
    faqs,
    onGetStarted,
    openModules,
    handleModulePress,
  };
}
