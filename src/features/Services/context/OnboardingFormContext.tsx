import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import type {
  OnboardingFieldValue,
  OnboardingFormQuestion,
  OnboardingPricingSummary,
} from '../types/serviceOnboarding.types';

export interface OnboardingFormContextValue {
  allQuestions: OnboardingFormQuestion[];
  formValues: Record<string, OnboardingFieldValue>;
  errors: Record<string, string | undefined>;
  pricingSummary: OnboardingPricingSummary | null;
  setFieldValue: (questionId: number, value: OnboardingFieldValue) => void;
  getQuestionsForStepNumber: (stepNumber: number) => OnboardingFormQuestion[];
}

const OnboardingFormContext = createContext<OnboardingFormContextValue | null>(
  null,
);

export interface OnboardingFormProviderProps {
  children: ReactNode;
  allQuestions: OnboardingFormQuestion[];
  formValues: Record<string, OnboardingFieldValue>;
  errors: Record<string, string | undefined>;
  pricingSummary: OnboardingPricingSummary | null;
  onFormValuesChange: (
    updater: (
      prev: Record<string, OnboardingFieldValue>,
    ) => Record<string, OnboardingFieldValue>,
  ) => void;
}

export function OnboardingFormProvider({
  children,
  allQuestions,
  formValues,
  errors,
  pricingSummary,
  onFormValuesChange,
}: OnboardingFormProviderProps): React.ReactElement {
  const setFieldValue = useCallback(
    (questionId: number, value: OnboardingFieldValue): void => {
      onFormValuesChange((prev) => ({
        ...prev,
        [String(questionId)]: value,
      }));
    },
    [onFormValuesChange],
  );

  const getQuestionsForStepNumber = useCallback(
    (stepNumber: number): OnboardingFormQuestion[] => {
      return allQuestions
        .filter((q) => (q.step > 0 ? q.step : 1) === stepNumber)
        .sort((a, b) => a.order - b.order || a.id - b.id);
    },
    [allQuestions],
  );

  const value = useMemo(
    (): OnboardingFormContextValue => ({
      allQuestions,
      formValues,
      errors,
      pricingSummary,
      setFieldValue,
      getQuestionsForStepNumber,
    }),
    [allQuestions, formValues, errors, pricingSummary, setFieldValue, getQuestionsForStepNumber],
  );

  return (
    <OnboardingFormContext.Provider value={value}>
      {children}
    </OnboardingFormContext.Provider>
  );
}

export function useOnboardingFormContext(): OnboardingFormContextValue {
  const ctx = useContext(OnboardingFormContext);
  if (ctx == null) {
    throw new Error('useOnboardingFormContext must be used within OnboardingFormProvider');
  }
  return ctx;
}
