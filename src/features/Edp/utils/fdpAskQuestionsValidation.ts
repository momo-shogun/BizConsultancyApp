import type { FdpAskQuestionsFormState } from '../types/fdpAskQuestions.types';

export const REMARK_MAX_LENGTH = 500;

export function sanitizeRemark(value: string): string {
  return value.slice(0, REMARK_MAX_LENGTH);
}

export function validateFdpAskQuestionsForm(
  form: FdpAskQuestionsFormState,
): string | null {
  if (form.categoryId.trim().length === 0) {
    return 'Please select a category.';
  }

  if (form.segmentId.trim().length === 0) {
    return 'Please select a segment.';
  }

  if (form.remark.trim().length > REMARK_MAX_LENGTH) {
    return `Remark must be ${REMARK_MAX_LENGTH} characters or fewer.`;
  }

  return null;
}
