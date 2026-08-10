import type { ServiceDetailFormQuestion } from '../types/myServices.types';

export interface AnswerSnapshot {
  answerText?: string;
  answerJson?: unknown;
}

export type TextInputVariant = 'text' | 'textarea' | 'email' | 'tel' | 'date';

export function parseShowWhen(
  cfg: Record<string, unknown> | null | undefined,
): { questionId: number; equals: string } | null {
  const raw = cfg?.showWhen;
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const row = raw as { questionId?: unknown; equals?: unknown };
  const questionId = Number(row.questionId);
  const equals = String(row.equals ?? '').trim();
  if (!Number.isFinite(questionId) || questionId <= 0 || equals.length === 0) {
    return null;
  }
  return { questionId, equals };
}

export function parseTextInputVariant(
  cfg: Record<string, unknown> | null | undefined,
): TextInputVariant {
  const raw = String(cfg?.inputVariant ?? '').trim();
  if (raw === 'textarea' || raw === 'email' || raw === 'tel' || raw === 'date') {
    return raw;
  }
  return 'text';
}

export function parseNumberBounds(
  cfg: Record<string, unknown> | null | undefined,
): { min: number | null; max: number | null } {
  const minRaw = cfg?.min;
  const maxRaw = cfg?.max;
  const min = minRaw == null || minRaw === '' ? null : Number(minRaw);
  const max = maxRaw == null || maxRaw === '' ? null : Number(maxRaw);
  return {
    min: min != null && Number.isFinite(min) ? min : null,
    max: max != null && Number.isFinite(max) ? max : null,
  };
}

function hasChoiceOptions(cfg: Record<string, unknown> | null | undefined): boolean {
  return Array.isArray(cfg?.options) && (cfg.options as unknown[]).length > 0;
}

export function triggerComparableValue(
  q: Pick<ServiceDetailFormQuestion, 'answerType' | 'configJson'>,
  answer: AnswerSnapshot | undefined,
): string | null {
  if (answer == null) {
    return null;
  }
  if (q.answerType === 'radio') {
    const text = String(answer.answerText ?? '').trim();
    return text.length > 0 ? text : null;
  }
  if (q.answerType === 'checkbox' && !hasChoiceOptions(q.configJson)) {
    if (answer.answerJson === true) {
      return 'yes';
    }
    if (answer.answerJson === false) {
      return 'no';
    }
  }
  return null;
}

export function isQuestionVisible(
  q: ServiceDetailFormQuestion,
  allQuestions: ServiceDetailFormQuestion[],
  answersByQuestionId: Record<number, AnswerSnapshot>,
): boolean {
  const showWhen = parseShowWhen(q.configJson);
  if (showWhen == null) {
    return true;
  }
  const parent = allQuestions.find((row) => row.id === showWhen.questionId);
  if (parent == null) {
    return false;
  }
  const parentValue = triggerComparableValue(parent, answersByQuestionId[parent.id]);
  return parentValue != null && parentValue === showWhen.equals;
}

export function scrubHiddenAnswers(
  questions: ServiceDetailFormQuestion[],
  answers: Record<number, AnswerSnapshot>,
  multiInputs: Record<number, string[]>,
): {
  answers: Record<number, AnswerSnapshot>;
  multiInputs: Record<number, string[]>;
} {
  const nextAnswers = { ...answers };
  const nextMulti = { ...multiInputs };
  let changed = false;
  for (const q of questions) {
    if (isQuestionVisible(q, questions, nextAnswers)) {
      continue;
    }
    if (nextAnswers[q.id] != null) {
      delete nextAnswers[q.id];
      changed = true;
    }
    if (nextMulti[q.id] != null) {
      delete nextMulti[q.id];
      changed = true;
    }
  }
  return changed
    ? { answers: nextAnswers, multiInputs: nextMulti }
    : { answers, multiInputs };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return (
    digits.length >= 8 &&
    digits.length <= 15 &&
    /^[+]?[\d\s()-]{8,20}$/.test(value.trim())
  );
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function sanitizeNumberInput(raw: string): string {
  let out = '';
  let seenDot = false;
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i] ?? '';
    if (ch === '-' && i === 0) {
      out += ch;
      continue;
    }
    if (ch === '.' && !seenDot) {
      seenDot = true;
      out += ch;
      continue;
    }
    if (ch >= '0' && ch <= '9') {
      out += ch;
    }
  }
  return out;
}
