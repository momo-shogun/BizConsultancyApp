import type { ServiceDetailFormQuestion } from '../types/myServices.types';
import type { DocumentReviewIssue } from '../components/ApplyServiceReviewStep';

export const APPLY_ERROR_TOAST_DURATION_MS = 10_000;

type DetailAnswerState = Record<number, { answerText?: string; answerJson?: unknown }>;
type MultiInputState = Record<number, string[]>;

export function isDocumentRequired(isRequired: number | null | undefined): boolean {
  return Number(isRequired) === 1;
}

/** Merge local draft picks with server `selectedUserDocumentIds` (e.g. after upload auto-select). */
export function mergeDocumentSelections(
  items: Array<{
    serviceDocumentId: number;
    selectedUserDocumentIds: number[];
  }>,
  draftSelections: Record<number, number[]>,
): Record<number, number[]> {
  const merged: Record<number, number[]> = {};
  for (const it of items) {
    const local = draftSelections[it.serviceDocumentId] ?? [];
    const server = it.selectedUserDocumentIds ?? [];
    merged[it.serviceDocumentId] = [...new Set([...local, ...server])];
  }
  return merged;
}

export function buildDocumentReviewIssues(
  items: Array<{
    serviceDocumentId: number;
    documentTypeName: string | null;
    isRequired: number;
    selectedUserDocumentIds: number[];
  }>,
  draftSelections: Record<number, number[]>,
): DocumentReviewIssue[] {
  const effective = mergeDocumentSelections(items, draftSelections);

  return items
    .filter((it) => isDocumentRequired(it.isRequired))
    .filter((it) => (effective[it.serviceDocumentId] ?? []).length < 1)
    .map((it) => ({
      label: it.documentTypeName ?? 'Document',
      need: 1,
      have: (effective[it.serviceDocumentId] ?? []).length,
    }));
}

export function buildDetailIssueLabels(
  questions: ServiceDetailFormQuestion[],
  detailAnswers: DetailAnswerState,
  multiInputs: MultiInputState,
): string[] {
  const issues: string[] = [];
  for (const q of questions) {
    if (q.isRequired !== 1) {
      continue;
    }
    if (q.answerType === 'multiinput') {
      const hasValue = (multiInputs[q.id] ?? []).some((entry) => entry.trim().length > 0);
      if (!hasValue) {
        issues.push(q.questionLabel);
      }
      continue;
    }
    if (q.answerType === 'checkbox') {
      const cfg = q.configJson as { options?: unknown[] } | null;
      const hasOptions = Array.isArray(cfg?.options) && cfg.options.length > 0;
      if (hasOptions) {
        const selected = detailAnswers[q.id]?.answerJson;
        if (!Array.isArray(selected) || selected.length < 1) {
          issues.push(q.questionLabel);
        }
      } else if (detailAnswers[q.id]?.answerJson !== true) {
        issues.push(q.questionLabel);
      }
      continue;
    }
    const text = detailAnswers[q.id]?.answerText?.trim() ?? '';
    if (text.length === 0) {
      issues.push(q.questionLabel);
    }
  }
  return issues;
}

export function formatApplyValidationError(
  documentIssues: DocumentReviewIssue[],
  detailIssueLabels: string[],
): string {
  const lines: string[] = [];
  for (const issue of documentIssues) {
    lines.push(`${issue.label}: upload ${Math.max(0, issue.need - issue.have)} more`);
  }
  for (const label of detailIssueLabels) {
    lines.push(`${label}: required`);
  }
  return lines.join('\n');
}
