import type {
  ApplyInstanceDraft,
  ServiceDetailAnswerInstance,
  ServiceDetailDeclarationPayload,
  ServiceDetailFormDeclarationItem,
  ServiceDetailFormQuestion,
  ServiceDetailFormSection,
  ServiceDetailFormStep,
  ServiceDetailInstancePayload,
  SubmissionDocumentRequirementItem,
  SubmissionDocumentRequirements,
  SubmissionDocumentSelectionItem,
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

export function newClientKey(): string {
  return `ck_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Server id when known; otherwise local clientKey (never the literal `null`). */
export function instanceDraftKeyPart(instance: ApplyInstanceDraft): string {
  if (instance.id != null && Number.isFinite(instance.id) && instance.id > 0) {
    return String(instance.id);
  }
  return instance.clientKey;
}

export function docSelectionKey(
  serviceDocumentId: number,
  answerInstanceId: number | string | null | undefined,
): string {
  if (typeof answerInstanceId === 'string' && answerInstanceId.trim().length > 0) {
    return `${serviceDocumentId}:${answerInstanceId.trim()}`;
  }
  if (
    answerInstanceId != null &&
    typeof answerInstanceId === 'number' &&
    Number.isFinite(answerInstanceId) &&
    answerInstanceId > 0
  ) {
    return `${serviceDocumentId}:${String(answerInstanceId)}`;
  }
  return `${serviceDocumentId}:null`;
}

export function parseDocSelectionKey(
  key: string,
): { serviceDocumentId: number; answerInstanceId: number | null } | null {
  const colon = key.indexOf(':');
  if (colon < 0) {
    return null;
  }
  const serviceDocumentId = Number(key.slice(0, colon));
  const instancePart = key.slice(colon + 1);
  if (!Number.isFinite(serviceDocumentId)) {
    return null;
  }
  if (instancePart === 'null' || instancePart === '') {
    return { serviceDocumentId, answerInstanceId: null };
  }
  const answerInstanceId = Number(instancePart);
  if (!Number.isFinite(answerInstanceId) || answerInstanceId <= 0) {
    // Client keys (ck_…) are not sent to the API until remapped to a server id.
    return { serviceDocumentId, answerInstanceId: null };
  }
  return { serviceDocumentId, answerInstanceId };
}

export function remapDraftSelectionsClientKeysToServerIds(
  drafts: Record<number, ApplyInstanceDraft[]>,
  draftSelections: Record<string, number[]>,
): Record<string, number[]> {
  const next: Record<string, number[]> = { ...draftSelections };
  for (const list of Object.values(drafts)) {
    for (const inst of list) {
      if (inst.id == null || inst.id <= 0) {
        continue;
      }
      const suffix = `:${inst.clientKey}`;
      for (const key of Object.keys(draftSelections)) {
        if (!key.endsWith(suffix)) {
          continue;
        }
        const docPart = key.slice(0, key.lastIndexOf(':'));
        const newKey = `${docPart}:${inst.id}`;
        if (!(newKey in next)) {
          next[newKey] = draftSelections[key] ?? [];
        }
        delete next[key];
      }
    }
  }
  return next;
}

export function scrubUserDocumentFromDraftSelections(
  draftSelections: Record<string, number[]>,
  userDocumentId: number,
): Record<string, number[]> {
  const next: Record<string, number[]> = {};
  for (const [k, arr] of Object.entries(draftSelections)) {
    next[k] = (arr ?? []).filter((id) => id !== userDocumentId);
  }
  return next;
}

export function scrubDraftSelectionsForInstanceParts(
  draftSelections: Record<string, number[]>,
  instanceParts: string[],
): Record<string, number[]> {
  const skip = new Set(instanceParts.filter((p) => p.length > 0));
  if (skip.size === 0) {
    return draftSelections;
  }
  const next: Record<string, number[]> = {};
  for (const [k, arr] of Object.entries(draftSelections)) {
    const part = k.slice(k.lastIndexOf(':') + 1);
    if (skip.has(part)) {
      continue;
    }
    next[k] = arr;
  }
  return next;
}

/** Merge local draft picks with server selections (per answerInstanceId). */
export function mergeDocumentSelections(
  items: Array<{
    serviceDocumentId: number;
    selectedUserDocumentIds: number[];
    selections?: Array<{ answerInstanceId: number | null; userDocumentIds: number[] }>;
    availableDocuments?: Array<{ id: number }>;
  }>,
  draftSelections: Record<string, number[]>,
): Record<string, number[]> {
  const merged: Record<string, number[]> = { ...draftSelections };
  for (const it of items) {
    const validIds = new Set((it.availableDocuments ?? []).map((doc) => doc.id));
    const filterValid = (ids: number[]): number[] =>
      validIds.size === 0 ? ids : ids.filter((id) => validIds.has(id));

    const groups =
      it.selections != null && it.selections.length > 0
        ? it.selections
        : it.selectedUserDocumentIds.length > 0
          ? [{ answerInstanceId: null as number | null, userDocumentIds: it.selectedUserDocumentIds }]
          : [];

    for (const group of groups) {
      const key = docSelectionKey(it.serviceDocumentId, group.answerInstanceId);
      const local = filterValid(draftSelections[key] ?? []);
      const server = filterValid(group.userDocumentIds ?? []);
      merged[key] = [...new Set([...local, ...server])];
    }
  }
  return merged;
}

export function buildDocumentSelectionPayload(
  items: SubmissionDocumentRequirementItem[],
  draftSelections: Record<string, number[]>,
): SubmissionDocumentSelectionItem[] {
  const merged = mergeDocumentSelections(items, draftSelections);
  const out: SubmissionDocumentSelectionItem[] = [];
  const seen = new Set<string>();

  for (const [key, userDocumentIds] of Object.entries(merged)) {
    const parsed = parseDocSelectionKey(key);
    if (parsed == null) {
      continue;
    }
    if (parsed.answerInstanceId == null) {
      continue;
    }
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push({
      serviceDocumentId: parsed.serviceDocumentId,
      userDocumentIds,
      answerInstanceId: parsed.answerInstanceId,
    });
  }

  return out;
}

export function buildDocumentReviewIssues(
  items: Array<{
    serviceDocumentId: number;
    documentTypeName: string | null;
    isRequired: number;
    selectedUserDocumentIds: number[];
    selections?: Array<{ answerInstanceId: number | null; userDocumentIds: number[] }>;
  }>,
  draftSelections: Record<string, number[]>,
): DocumentReviewIssue[] {
  const effective = mergeDocumentSelections(items, draftSelections);

  return items
    .filter((it) => isDocumentRequired(it.isRequired))
    .filter((it) => {
      const keys = Object.keys(effective).filter((k) =>
        k.startsWith(`${it.serviceDocumentId}:`),
      );
      if (keys.length === 0) {
        return true;
      }
      return keys.every((k) => (effective[k] ?? []).length < 1);
    })
    .map((it) => ({
      label: it.documentTypeName ?? 'Document',
      need: 1,
      have: 0,
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

export function stepQuestions(step: ServiceDetailFormStep): ServiceDetailFormQuestion[] {
  return step.sections.flatMap((s) => s.questions);
}

export function defaultInstanceLabel(step: ServiceDetailFormStep, index: number): string {
  const base = (step.instanceLabel ?? '').trim() || 'Record';
  return `${base} ${index + 1}`;
}

export function addAnotherButtonLabel(step: ServiceDetailFormStep): string {
  const custom = (step.addAnotherLabel ?? '').trim();
  if (custom.length > 0) {
    return custom;
  }
  const base = (step.instanceLabel ?? '').trim() || 'record';
  return `+ Add another ${base}`;
}

function emptyMultiInputs(questions: ServiceDetailFormQuestion[]): MultiInputState {
  const multi: MultiInputState = {};
  for (const q of questions) {
    if (q.answerType === 'multiinput') {
      const cfg = (q.configJson ?? {}) as { minEntries?: number };
      const min = Math.max(1, Number(cfg.minEntries) || 1);
      multi[q.id] = Array.from({ length: min }, () => '');
    }
  }
  return multi;
}

function hydrateAnswersFromServer(
  answers: Array<{ questionId: number; answerText: string | null; answerJson: unknown }>,
  questions: ServiceDetailFormQuestion[],
): { detailAnswers: DetailAnswerState; multiInputs: MultiInputState } {
  const detailAnswers: DetailAnswerState = {};
  const multiInputs = emptyMultiInputs(questions);

  for (const a of answers) {
    const q = questions.find((x) => x.id === a.questionId);
    let answerJson = a.answerJson;
    if (q != null && isYesNoChoiceQuestion(q) && typeof answerJson !== 'boolean') {
      const text = (a.answerText ?? '').trim().toLowerCase();
      if (text === 'yes' || text === 'true' || text === '1') {
        answerJson = true;
      } else if (text === 'no' || text === 'false' || text === '0') {
        answerJson = false;
      }
    }
    detailAnswers[a.questionId] = {
      answerText: a.answerText ?? undefined,
      answerJson,
    };
    if (q?.answerType === 'multiinput' && Array.isArray(a.answerJson)) {
      multiInputs[a.questionId] = (a.answerJson as unknown[]).map((x) => String(x));
    }
  }

  return { detailAnswers, multiInputs };
}

export function createEmptyInstance(
  step: ServiceDetailFormStep,
  index: number,
): ApplyInstanceDraft {
  const questions = stepQuestions(step);
  return {
    clientKey: newClientKey(),
    id: null,
    stepId: step.id,
    instanceIndex: index,
    label: step.isRepeatable === 1 ? defaultInstanceLabel(step, index) : null,
    detailAnswers: {},
    multiInputs: emptyMultiInputs(questions),
  };
}

export function buildInitialInstancesByStep(
  steps: ServiceDetailFormStep[],
  serverInstances: ServiceDetailAnswerInstance[],
  flatAnswers: Array<{ questionId: number; answerText: string | null; answerJson: unknown }>,
): Record<number, ApplyInstanceDraft[]> {
  const fieldsSteps = steps.filter((s) => s.kind === 'fields');
  const out: Record<number, ApplyInstanceDraft[]> = {};

  for (const step of fieldsSteps) {
    const questions = stepQuestions(step);
    const forStep = serverInstances
      .filter((i) => i.stepId === step.id)
      .sort((a, b) => a.instanceIndex - b.instanceIndex || a.id - b.id);

    if (forStep.length > 0) {
      out[step.id] = forStep.map((inst, idx) => {
        const hydrated = hydrateAnswersFromServer(inst.answers, questions);
        return {
          clientKey: newClientKey(),
          id: inst.id,
          stepId: step.id,
          instanceIndex: idx,
          label:
            (inst.label ?? '').trim() ||
            (step.isRepeatable === 1 ? defaultInstanceLabel(step, idx) : null),
          detailAnswers: hydrated.detailAnswers,
          multiInputs: hydrated.multiInputs,
        };
      });
      continue;
    }

    // Legacy flat answers → single instance for non-repeatable / first hydrate.
    const minCount = step.isRepeatable === 1 ? Math.max(1, step.minInstances) : 1;
    const drafts: ApplyInstanceDraft[] = [];
    for (let i = 0; i < minCount; i++) {
      if (i === 0 && flatAnswers.length > 0 && step.isRepeatable !== 1) {
        const stepQIds = new Set(questions.map((q) => q.id));
        const relevant = flatAnswers.filter((a) => stepQIds.has(a.questionId));
        const hydrated = hydrateAnswersFromServer(relevant, questions);
        drafts.push({
          clientKey: newClientKey(),
          id: null,
          stepId: step.id,
          instanceIndex: 0,
          label: null,
          detailAnswers: hydrated.detailAnswers,
          multiInputs: hydrated.multiInputs,
        });
      } else {
        drafts.push(createEmptyInstance(step, i));
      }
    }
    out[step.id] = drafts;
  }

  return out;
}

/** Sync server-assigned instance ids onto local drafts (matched by step + index). */
export function syncInstanceIdsFromServer(
  local: Record<number, ApplyInstanceDraft[]>,
  serverInstances: ServiceDetailAnswerInstance[],
): Record<number, ApplyInstanceDraft[]> {
  const next: Record<number, ApplyInstanceDraft[]> = {};
  for (const [stepIdStr, drafts] of Object.entries(local)) {
    const stepId = Number(stepIdStr);
    const serverForStep = serverInstances
      .filter((i) => i.stepId === stepId)
      .sort((a, b) => a.instanceIndex - b.instanceIndex || a.id - b.id);
    next[stepId] = drafts.map((draft, idx) => {
      const server = serverForStep[idx];
      if (server == null) {
        return draft;
      }
      if (draft.id === server.id) {
        return draft;
      }
      return { ...draft, id: server.id };
    });
  }
  return next;
}

export function buildInstanceAnswersPayload(
  questions: ServiceDetailFormQuestion[],
  detailAnswers: DetailAnswerState,
  multiInputs: MultiInputState,
): Array<{ questionId: number; answerText?: string | null; answerJson?: unknown }> {
  const out: Array<{
    questionId: number;
    answerText?: string | null;
    answerJson?: unknown;
  }> = [];
  for (const q of questions) {
    if (q.answerType === 'upload') {
      continue;
    }
    const cur = detailAnswers[q.id] ?? {};
    if (q.answerType === 'multiinput') {
      const arr = (multiInputs[q.id] ?? []).map((s) => s.trim()).filter(Boolean);
      out.push({ questionId: q.id, answerText: null, answerJson: arr });
      continue;
    }
    if (q.answerType === 'checkbox') {
      const options = Array.isArray((q.configJson as { options?: unknown[] } | null)?.options)
        ? ((q.configJson as { options: unknown[] }).options)
        : [];
      const hasOptions = options.length > 0;
      if (!hasOptions) {
        out.push({
          questionId: q.id,
          answerText: null,
          answerJson: typeof cur.answerJson === 'boolean' ? cur.answerJson : null,
        });
      } else {
        out.push({
          questionId: q.id,
          answerText: null,
          answerJson: Array.isArray(cur.answerJson) ? cur.answerJson : [],
        });
      }
      continue;
    }
    if (q.answerType === 'radio') {
      const options = Array.isArray((q.configJson as { options?: unknown[] } | null)?.options)
        ? ((q.configJson as { options: unknown[] }).options)
        : [];
      if (options.length === 0) {
        out.push({
          questionId: q.id,
          answerText: null,
          answerJson: typeof cur.answerJson === 'boolean' ? cur.answerJson : null,
        });
      } else {
        out.push({
          questionId: q.id,
          answerText: cur.answerText ?? '',
          answerJson: null,
        });
      }
      continue;
    }
    out.push({
      questionId: q.id,
      answerText: cur.answerText ?? '',
      answerJson: null,
    });
  }
  return out;
}

export function buildInstancesPayload(
  steps: ServiceDetailFormStep[],
  instancesByStep: Record<number, ApplyInstanceDraft[]>,
): ServiceDetailInstancePayload[] {
  const out: ServiceDetailInstancePayload[] = [];
  for (const step of steps) {
    if (step.kind !== 'fields') {
      continue;
    }
    const questions = stepQuestions(step);
    const drafts = instancesByStep[step.id] ?? [createEmptyInstance(step, 0)];
    drafts.forEach((draft, idx) => {
      out.push({
        stepId: step.id,
        instanceIndex: idx,
        label: draft.label,
        answers: buildInstanceAnswersPayload(
          questions,
          draft.detailAnswers,
          draft.multiInputs,
        ),
      });
    });
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

function isUploadQuestionCompleteForInstance(
  q: ServiceDetailFormQuestion,
  answerInstanceId: number | null,
  draftSelections: Record<string, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): boolean {
  if (q.isRequired !== 1) {
    return true;
  }
  if (answerInstanceId == null || answerInstanceId <= 0) {
    return false;
  }
  const requirement = findRequirementForQuestion(q, reqData);
  if (requirement == null) {
    return false;
  }
  const effective =
    reqData != null
      ? mergeDocumentSelections(reqData.items, draftSelections)
      : draftSelections;
  const key = docSelectionKey(requirement.serviceDocumentId, answerInstanceId);
  return (effective[key] ?? []).length > 0;
}

export function isInstanceComplete(
  questions: ServiceDetailFormQuestion[],
  instance: ApplyInstanceDraft,
  draftSelections: Record<string, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): boolean {
  for (const q of questions) {
    if (q.answerType === 'upload') {
      if (
        !isUploadQuestionCompleteForInstance(
          q,
          instance.id,
          draftSelections,
          reqData,
        )
      ) {
        return false;
      }
    } else if (
      !isNonUploadQuestionComplete(q, instance.detailAnswers, instance.multiInputs)
    ) {
      return false;
    }
  }
  return true;
}

export function isSectionComplete(
  section: ServiceDetailFormSection,
  detailAnswers: DetailAnswerState,
  multiInputs: MultiInputState,
  answerInstanceId: number | null,
  draftSelections: Record<string, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): boolean {
  for (const q of section.questions) {
    if (q.answerType === 'upload') {
      if (
        !isUploadQuestionCompleteForInstance(q, answerInstanceId, draftSelections, reqData)
      ) {
        return false;
      }
    } else if (!isNonUploadQuestionComplete(q, detailAnswers, multiInputs)) {
      return false;
    }
  }
  return true;
}

export function buildChecklistRows(
  steps: ServiceDetailFormStep[],
  instancesByStep: Record<number, ApplyInstanceDraft[]>,
  draftSelections: Record<string, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): ChecklistRow[] {
  const rows: ChecklistRow[] = [];

  for (const step of steps) {
    if (step.kind !== 'fields') {
      continue;
    }
    const questions = stepQuestions(step);
    const drafts = instancesByStep[step.id] ?? [];

    if (step.isRepeatable === 1) {
      drafts.forEach((inst, idx) => {
        const label =
          (inst.label ?? '').trim() || defaultInstanceLabel(step, idx);
        rows.push({
          section: label,
          requirement: step.description?.trim() || 'All required fields completed',
          complete: isInstanceComplete(questions, inst, draftSelections, reqData),
        });
      });
      if (drafts.length < step.minInstances) {
        rows.push({
          section: step.title,
          requirement: `At least ${step.minInstances} ${(step.instanceLabel ?? 'record').trim() || 'record'}(s) required`,
          complete: false,
        });
      }
      continue;
    }

    const inst = drafts[0];
    for (const section of step.sections) {
      rows.push({
        section: `${section.letter}. ${section.title}`,
        requirement: section.description?.trim() || 'All required fields completed',
        complete:
          inst != null &&
          isSectionComplete(
            section,
            inst.detailAnswers,
            inst.multiInputs,
            inst.id,
            draftSelections,
            reqData,
          ),
      });
    }
  }

  return rows;
}

export function buildDetailIssueLabels(
  questions: ServiceDetailFormQuestion[],
  detailAnswers: DetailAnswerState,
  multiInputs: MultiInputState,
  instanceLabel?: string | null,
): string[] {
  const prefix =
    instanceLabel != null && instanceLabel.trim().length > 0
      ? `${instanceLabel.trim()}: `
      : '';
  const issues: string[] = [];
  for (const q of questions) {
    if (q.isRequired !== 1) {
      continue;
    }
    if (q.answerType === 'upload') {
      continue;
    }
    if (!isNonUploadQuestionComplete(q, detailAnswers, multiInputs)) {
      issues.push(`${prefix}${q.questionLabel}`);
    }
  }
  return issues;
}

export function buildUploadIssueLabels(
  questions: ServiceDetailFormQuestion[],
  answerInstanceId: number | null,
  draftSelections: Record<string, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
  instanceLabel?: string | null,
): string[] {
  const prefix =
    instanceLabel != null && instanceLabel.trim().length > 0
      ? `${instanceLabel.trim()}: `
      : '';
  const issues: string[] = [];
  for (const q of questions) {
    if (q.isRequired !== 1 || q.answerType !== 'upload') {
      continue;
    }
    if (
      !isUploadQuestionCompleteForInstance(q, answerInstanceId, draftSelections, reqData)
    ) {
      issues.push(`${prefix}${q.questionLabel}`);
    }
  }
  return issues;
}

export function buildStepIssueLabels(
  step: ServiceDetailFormStep,
  drafts: ApplyInstanceDraft[],
  draftSelections: Record<string, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): string[] {
  const questions = stepQuestions(step);
  const issues: string[] = [];

  if (step.isRepeatable === 1 && drafts.length < step.minInstances) {
    const label = (step.instanceLabel ?? 'record').trim() || 'record';
    issues.push(
      `${step.title}: add at least ${step.minInstances} ${label}(s) (have ${drafts.length})`,
    );
  }

  drafts.forEach((inst, idx) => {
    const label =
      step.isRepeatable === 1
        ? (inst.label ?? '').trim() || defaultInstanceLabel(step, idx)
        : null;
    issues.push(
      ...buildDetailIssueLabels(questions, inst.detailAnswers, inst.multiInputs, label),
    );
    issues.push(
      ...buildUploadIssueLabels(
        questions,
        inst.id,
        draftSelections,
        reqData,
        label,
      ),
    );
  });

  return issues;
}

export function buildAllFieldsIssueLabels(
  steps: ServiceDetailFormStep[],
  instancesByStep: Record<number, ApplyInstanceDraft[]>,
  draftSelections: Record<string, number[]>,
  reqData: SubmissionDocumentRequirements | null | undefined,
): string[] {
  const issues: string[] = [];
  for (const step of steps) {
    if (step.kind !== 'fields') {
      continue;
    }
    issues.push(
      ...buildStepIssueLabels(
        step,
        instancesByStep[step.id] ?? [],
        draftSelections,
        reqData,
      ),
    );
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

export function formatIssueList(issues: string[]): string {
  return issues.map((label) => `${label}: required`).join('\n');
}
