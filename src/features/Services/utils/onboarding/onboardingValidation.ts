import type {
  OnboardingFieldValue,
  OnboardingFormQuestion,
} from '../../types/serviceOnboarding.types';

export function isFieldValueEmpty(
  value: OnboardingFieldValue,
  question: OnboardingFormQuestion,
): boolean {
  if (value == null) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (typeof value === 'number') {
    return String(value).length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'boolean') {
    const hasOptions = question.options.length > 0;
    return value === false && !hasOptions;
  }
  return false;
}

export function validateStepQuestions(
  questions: readonly OnboardingFormQuestion[],
  formValues: Record<string, OnboardingFieldValue>,
): { valid: boolean; errors: Record<string, string | undefined> } {
  const errors: Record<string, string | undefined> = {};
  let valid = true;

  for (const question of questions) {
    const key = String(question.id);
    const value = formValues[key];
    if (question.required && isFieldValueEmpty(value, question)) {
      errors[key] = 'This field is required.';
      valid = false;
      continue;
    }
    errors[key] = undefined;
  }

  return { valid, errors };
}
