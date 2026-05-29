import { useEffect, useState } from 'react';

import {
  BIZ_AI_THINKING_STEP_MS,
  BIZ_AI_THINKING_STEPS,
} from '../constants/bizAiThinkingSteps';

/**
 * Advances thinking steps only while Biz Assistant chat request is loading
 * (same behaviour as portal ChatWidget while `loading` is true).
 */
export function useBizAIThinkingStep(isActive: boolean): number {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setStepIndex(0);
      return;
    }

    setStepIndex(0);
    const timer = setInterval(() => {
      setStepIndex((prev) =>
        prev < BIZ_AI_THINKING_STEPS.length - 1 ? prev + 1 : prev,
      );
    }, BIZ_AI_THINKING_STEP_MS);

    return () => {
      clearInterval(timer);
    };
  }, [isActive]);

  return stepIndex;
}
