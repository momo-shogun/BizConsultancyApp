import type { ServiceDetailFormQuestion } from '../types/myServices.types';

export interface ServiceDetailQuestionOption {
  label: string;
  value: string;
}

function optionFromUnknown(raw: unknown, index: number): ServiceDetailQuestionOption | null {
  if (typeof raw === 'string') {
    const value = raw.trim();
    if (value.length === 0) {
      return null;
    }
    return { label: value, value };
  }
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const row = raw as Record<string, unknown>;
  const labelRaw =
    typeof row.label === 'string'
      ? row.label
      : typeof row.name === 'string'
        ? row.name
        : typeof row.value === 'string'
          ? row.value
          : null;
  const valueRaw =
    typeof row.value === 'string'
      ? row.value
      : typeof row.id === 'string' || typeof row.id === 'number'
        ? String(row.id)
        : labelRaw;
  if (labelRaw == null || valueRaw == null) {
    return null;
  }
  const label = labelRaw.trim();
  const value = String(valueRaw).trim();
  if (label.length === 0 || value.length === 0) {
    return null;
  }
  return { label, value: value.length > 0 ? value : `option_${index}` };
}

export function getServiceDetailQuestionOptions(
  question: ServiceDetailFormQuestion,
): ServiceDetailQuestionOption[] {
  const raw = question.configJson?.options;
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: ServiceDetailQuestionOption[] = [];
  raw.forEach((item, index) => {
    const parsed = optionFromUnknown(item, index);
    if (parsed != null) {
      out.push(parsed);
    }
  });
  return out;
}

/** Checkbox / radio without options → Yes/No boolean choice. */
export function isYesNoChoiceQuestion(question: ServiceDetailFormQuestion): boolean {
  if (question.answerType !== 'checkbox' && question.answerType !== 'radio') {
    return false;
  }
  return getServiceDetailQuestionOptions(question).length === 0;
}

export const YES_NO_OPTIONS: ServiceDetailQuestionOption[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];
