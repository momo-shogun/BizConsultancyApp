import type {
  ServiceDetailDeclarationPayload,
  ServiceDetailFormDeclarationItem,
  ServiceDetailFormQuestion,
  ServiceDetailFormSection,
  ServiceDetailFormStep,
  SubmissionDocumentRequirementItem,
  SubmissionDocumentRequirements,
} from '../types/myServices.types';
import { isYesNoChoiceQuestion } from './serviceDetailQuestionOptions';

export const APPLY_ERROR_TOAST_DURATION_MS = 10_000;

export interface DocumentReviewIssue {
  label: string;
  need: number;
  have: number;
}

export interface ChecklistRow {
  section: string;
  requirement: string;
  complete: boolean;
}

type DetailAnswerState = Record<number, { answerText?: string; answerJson?: unknown }>;
type MultiInputState = Record<number, string[]>;

export function isDocumentRequired(isRequired: number | null | undefined): boolean {
  return Number(isRequired) === 1;
}

/** Merge local draft picks with server selectedUserDocumentIds (e.g. after upload auto-select). */
export function mergeDocumentSelections(
  items: Array<{
    serviceDocumentId: number;
    selectedUserDocumentIds: number[];
    availableDocuments?: Array<{ id: number }>;
  }>,
  draftSelections: Record<number, number[]>,
): Record<number, number[]> {
  const merged: Record<number, number[]> = {};
  for (const it of items) {
    const validIds = new Set((it.availableDocuments ?? []).map((doc) => doc.id));
    const filterValid = (ids: number[]): number[] =>
      validIds.size === 0 ? ids : ids.filter((id) => validIds.has(id));
    const local = filterValid(draftSelections[it.serviceDocumentId] ?? []);
    const server = filterValid(it.selectedUserDocumentIds ?? []);
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

export function questionDocumentTypeId(q: ServiceDetailFormQuestion): number | null {
  const raw = q.configJson?.documentTypeId;
  const documentTypeId = Number(raw);
  if (!Number.isFinite(documentTypeId) || documentTypeId <= 0) {
    return null;
  }
  return documentTypeId;
}

export function findRequirementForQuestion(
  q: ServiceDetailFormQuestion,
  reqData: SubmissionDocumentRequirements | null | undefined,
): SubmissionDocumentRequirementItem | null {
  const documentTypeId = questionDocumentTypeId(q);
  if (documentTypeId == null || reqData == null) {
    return null;
  }
  return reqData.items.find((it) => it.documentTypeId === documentTypeId) ?? null;
}

export function collectQuestionsFromSteps(steps: ServiceDetailFormStep[]): ServiceDetailFormQuestion[] {
  const out: ServiceDetailFormQuestion[] = [];
  for (const step of steps) {
    if (step.kind !== 'fields') {
      continue;
    }
    for (const section of step.sections) {
      out.push(...section.questions);
    }
  }
  return out;
}

export function collectSectionsFromSteps(steps: ServiceDetailFormStep[]): ServiceDetailFormSection[] {
  const out: ServiceDetailFormSection[] = [];
  for (const step of steps) {
    if (step.kind !== 'fields') {
      continue;
    }
    out.push(...step.sections);
  }
  return out;
}

function isNonUploadQuestionComplete(
  q: ServiceDetailFormQuestion,
  detailAnswers: DetailAnswerState,
  multiInputs: MultiInputState,
): boolean {
  if (q.isRequired !== 1) {
    return true;
  }
  if (q.answerType === 'multiinput') {
    const cfg = (q.configJson ?? {}) as { minEntries?: number };
    const min = Math.max(1, Number(cfg.minEntries) || 1);
    const filled = (multiInputs[q.id] ?? []).map((s) => s.trim()).filter(Boolean);
    return filled.length >= min;
  }
  if (isYesNoChoiceQuestion(q)) {
    const value = detailAnswers[q.id]?.answerJson;
    return value === true || value === false;
  }
  if (q.answerType === 'checkbox') {
    const selected = detailAnswers[q.id]?.answerJson;
    return Array.isArray(selected) && selected.length > 0;
  }
  if (q.answerType === 'radio' || q.answerType === 'text' || q.answerType === 'number') {
    return (detailAnswers[q.id]?.answerText?.trim() ?? '').length > 0;
  }
  return true;
}

function isUploadQuestionComplete(
  q: ServiceDetailFormQuestion,
  draftSelections: Record<number, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): boolean {
  if (q.isRequired !== 1) {
    return true;
  }
  const requirement = findRequirementForQuestion(q, reqData);
  if (requirement == null) {
    return false;
  }
  const effective =
    reqData != null
      ? mergeDocumentSelections(reqData.items, draftSelections)
      : draftSelections;
  return (effective[requirement.serviceDocumentId] ?? []).length > 0;
}

export function isSectionComplete(
  section: ServiceDetailFormSection,
  detailAnswers: DetailAnswerState,
  multiInputs: MultiInputState,
  draftSelections: Record<number, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): boolean {
  for (const q of section.questions) {
    if (q.answerType === 'upload') {
      if (!isUploadQuestionComplete(q, draftSelections, reqData)) {
        return false;
      }
    } else if (!isNonUploadQuestionComplete(q, detailAnswers, multiInputs)) {
      return false;
    }
  }
  return true;
}

export function buildChecklistRows(
  sections: ServiceDetailFormSection[],
  detailAnswers: DetailAnswerState,
  multiInputs: MultiInputState,
  draftSelections: Record<number, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): ChecklistRow[] {
  return sections.map((section) => ({
    section: `${section.letter}. ${section.title}`,
    requirement: section.description?.trim() || 'All required fields completed',
    complete: isSectionComplete(
      section,
      detailAnswers,
      multiInputs,
      draftSelections,
      reqData,
    ),
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
    if (q.answerType === 'upload') {
      continue;
    }
    if (!isNonUploadQuestionComplete(q, detailAnswers, multiInputs)) {
      issues.push(q.questionLabel);
    }
  }
  return issues;
}

export function buildUploadIssueLabels(
  questions: ServiceDetailFormQuestion[],
  draftSelections: Record<number, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): string[] {
  const issues: string[] = [];
  for (const q of questions) {
    if (q.isRequired !== 1 || q.answerType !== 'upload') {
      continue;
    }
    if (!isUploadQuestionComplete(q, draftSelections, reqData)) {
      issues.push(q.questionLabel);
    }
  }
  return issues;
}

export function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** YYYY-MM-DD → DD/MM/YYYY */
export function isoToDisplayDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (m == null) {
    return iso;
  }
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/** DD/MM/YYYY → YYYY-MM-DD (or null if invalid) */
export function displayToIsoDate(display: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(display.trim());
  if (m == null) {
    return null;
  }
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
    return null;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) {
    return null;
  }
  const dt = new Date(year, month - 1, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) {
    return null;
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function buildDeclarationPayload(
  submitterName: string,
  declarationDateIso: string,
  declarationAccepted: Record<number, boolean>,
): ServiceDetailDeclarationPayload {
  return {
    submitterName: submitterName.trim(),
    declarationDate: declarationDateIso,
    acceptedItemIds: Object.entries(declarationAccepted)
      .filter(([, v]) => v === true)
      .map(([k]) => Number(k))
      .filter((id) => Number.isFinite(id) && id > 0),
  };
}

export function isDeclarationReadyForSave(
  submitterName: string,
  declarationDateIso: string,
  declarationItems: ServiceDetailFormDeclarationItem[],
  declarationAccepted: Record<number, boolean>,
): boolean {
  if (submitterName.trim().length === 0) {
    return false;
  }
  if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(declarationDateIso)) {
    return false;
  }
  for (const item of declarationItems) {
    if (item.isRequired === 1 && declarationAccepted[item.id] !== true) {
      return false;
    }
  }
  return true;
}

export function buildDeclarationIssueLabels(
  submitterName: string,
  declarationDateDisplay: string,
  declarationItems: ServiceDetailFormDeclarationItem[],
  declarationAccepted: Record<number, boolean>,
): string[] {
  const issues: string[] = [];
  for (const item of declarationItems) {
    if (item.isRequired === 1 && declarationAccepted[item.id] !== true) {
      issues.push(item.label);
    }
  }
  if (submitterName.trim().length === 0) {
    issues.push('Name of person submitting');
  }
  if (displayToIsoDate(declarationDateDisplay) == null) {
    issues.push('Declaration date (DD/MM/YYYY)');
  }
  return issues;
}

export function formatApplyValidationError(
  detailIssueLabels: string[],
  uploadIssueLabels: string[],
  declarationIssueLabels: string[],
): string {
  const lines: string[] = [];
  for (const label of detailIssueLabels) {
    lines.push(`${label}: required`);
  }
  for (const label of uploadIssueLabels) {
    lines.push(`${label}: upload required`);
  }
  for (const label of declarationIssueLabels) {
    lines.push(`${label}: required`);
  }
  return lines.join('\n');
}
