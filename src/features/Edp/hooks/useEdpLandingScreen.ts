import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';

import { useBizAIScrollReporter } from '@/features/BizAI/hooks/useBizAIScrollReporter';

import { useEdpAccess } from './useEdpAccess';
import { useEdpLandingCourses } from './useEdpLandingCourses';
import { useEdpLandingFaqs } from './useEdpLandingFaqs';

export interface UseEdpLandingScreenOptions {
  onModulePress?: (moduleSlug: string) => void;
  onViewAllModules?: () => void;
  onAskQuestion?: () => void;
}

export function useEdpLandingScreen(options: UseEdpLandingScreenOptions = {}) {
  const { onModulePress, onViewAllModules, onAskQuestion: onAskQuestionOption } = options;
  const navigation = useNavigation<NavigationProp<EdpStackParamList>>();
  const onBizAiScroll = useBizAIScrollReporter();
  const courses = useEdpLandingCourses();
  const faqs = useEdpLandingFaqs();
  const { canAccessFullEdp, isLoggedInUser, promptEnroll } = useEdpAccess();

  const navigateToModules = useCallback((): void => {
    if (isLoggedInUser && !canAccessFullEdp) {
      promptEnroll();
      return;
    }
    navigation.navigate(ROUTES.Edp.Modules);
  }, [canAccessFullEdp, isLoggedInUser, navigation, promptEnroll]);

  const onGetStarted = useCallback((): void => {
    navigateToModules();
  }, [navigateToModules]);

  const onAskQuestion = useCallback((): void => {
    if (onAskQuestionOption != null) {
      onAskQuestionOption();
      return;
    }

    navigation.navigate(ROUTES.Edp.AskQuestions);
  }, [navigation, onAskQuestionOption]);

  const openModules = useCallback((): void => {
    if (onViewAllModules != null) {
      onViewAllModules();
      return;
    }
    navigateToModules();
  }, [navigateToModules, onViewAllModules]);

  const handleModulePress = useCallback(
    (moduleSlug: string): void => {
      if (onModulePress != null) {
        onModulePress(moduleSlug);
        return;
      }
      navigateToModules();
    },
    [navigateToModules, onModulePress],
  );

  return {
    onBizAiScroll,
    courses,
    faqs,
    onGetStarted,
    onAskQuestion,
    openModules,
    handleModulePress,
  };
}
