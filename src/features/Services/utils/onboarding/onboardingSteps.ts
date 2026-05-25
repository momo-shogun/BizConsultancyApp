import { DynamicStep } from '../../components/steps/DynamicStep';
import { MandatoryThirdStep } from '../../components/steps/MandatoryThirdStep';
import type { StepConfig } from '../../components/types';
import type {
  OnboardingFieldValue,
  OnboardingFormQuestion,
} from '../../types/serviceOnboarding.types';

export const PRICING_STEP_KEY = 'pricing-review';

export function sortQuestions(
  questions: readonly OnboardingFormQuestion[],
): OnboardingFormQuestion[] {
  return [...questions].sort((a, b) => a.order - b.order || a.id - b.id);
}

export function getMaxQuestionStep(questions: readonly OnboardingFormQuestion[]): number {
  if (questions.length === 0) {
    return 0;
  }
  return Math.max(...questions.map((q) => (q.step > 0 ? q.step : 1)));
}

export function questionsForStepNumber(
  questions: readonly OnboardingFormQuestion[],
  stepNumber: number,
): OnboardingFormQuestion[] {
  return sortQuestions(questions).filter((q) => (q.step > 0 ? q.step : 1) === stepNumber);
}

export function getDefaultValueForQuestion(
  question: OnboardingFormQuestion,
): OnboardingFieldValue {
  if (question.type === 'checkbox') {
    return question.options.length > 0 ? [] : false;
  }
  if (question.type === 'number') {
    return '';
  }
  return '';
}

export function buildDefaultFormValues(
  questions: readonly OnboardingFormQuestion[],
): Record<string, OnboardingFieldValue> {
  const initial: Record<string, OnboardingFieldValue> = {};
  for (const question of questions) {
    initial[String(question.id)] = getDefaultValueForQuestion(question);
  }
  return initial;
}

export function mergeAnswersIntoDefaults(
  questions: readonly OnboardingFormQuestion[],
  answers: Record<string, unknown> | null | undefined,
): Record<string, OnboardingFieldValue> {
  const merged = buildDefaultFormValues(questions);
  if (answers == null || typeof answers !== 'object' || Array.isArray(answers)) {
    return merged;
  }
  for (const question of questions) {
    const key = String(question.id);
    const raw = answers[key];
    if (raw !== undefined && raw !== null) {
      merged[key] = raw as OnboardingFieldValue;
    }
  }
  return merged;
}

function isFieldValueNonEmpty(value: OnboardingFieldValue): boolean {
  if (value == null) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (typeof value === 'number') {
    return String(value).length > 0;
  }
  if (typeof value === 'boolean') {
    return value === true;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return false;
}

export function inferResumeStepIndex(
  questions: readonly OnboardingFormQuestion[],
  formValues: Record<string, OnboardingFieldValue>,
  stepConfigs: readonly StepConfig[],
): number {
  const maxStep = getMaxQuestionStep(questions);
  let maxFilled = 1;
  for (const question of questions) {
    if (isFieldValueNonEmpty(formValues[String(question.id)])) {
      maxFilled = Math.max(maxFilled, question.step > 0 ? question.step : 1);
    }
  }
  const capped = Math.min(maxFilled, maxStep || 1);
  const targetKey =
    maxStep === 0
      ? PRICING_STEP_KEY
      : String(capped);
  const index = stepConfigs.findIndex((s) => s.key === targetKey);
  return index >= 0 ? index : 0;
}

export function buildOnboardingStepConfigs(
  questions: readonly OnboardingFormQuestion[],
): StepConfig[] {
  const sorted = sortQuestions(questions);
  const maxStep = getMaxQuestionStep(sorted);
  const stepNumbers =
    maxStep > 0
      ? Array.from({ length: maxStep }, (_, i) => i + 1)
      : [];

  const configs: StepConfig[] = stepNumbers.map((stepNumber) => {
    const stepQuestions = questionsForStepNumber(sorted, stepNumber);
    const firstTitle = stepQuestions[0]?.question ?? `Step ${stepNumber}`;
    return {
      key: `step-${stepNumber}`,
      title: `Step ${stepNumber}`,
      description: firstTitle.length > 80 ? `${firstTitle.slice(0, 77)}...` : firstTitle,
      component: DynamicStep,
      data: { stepNumber, questionCount: stepQuestions.length },
    };
  });

  configs.push({
    key: PRICING_STEP_KEY,
    title: 'Review & Confirm',
    description: 'Review pricing and complete your registration.',
    component: MandatoryThirdStep,
  });

  return configs;
}

export function isPricingStepIndex(
  stepIndex: number,
  stepConfigs: readonly StepConfig[],
): boolean {
  return stepConfigs[stepIndex]?.key === PRICING_STEP_KEY;
}

export function getQuestionsForStepIndex(
  allQuestions: readonly OnboardingFormQuestion[],
  stepIndex: number,
  stepConfigs: readonly StepConfig[],
): OnboardingFormQuestion[] {
  const config = stepConfigs[stepIndex];
  if (config == null || config.key === PRICING_STEP_KEY) {
    return [];
  }
  const stepNumber = Number.parseInt(config.key.replace('step-', ''), 10);
  if (!Number.isFinite(stepNumber)) {
    return [];
  }
  return questionsForStepNumber(allQuestions, stepNumber);
}
