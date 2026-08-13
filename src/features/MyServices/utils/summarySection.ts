import type {
  ApplyInstanceDraft,
  ServiceDetailFormQuestion,
  ServiceDetailFormSection,
  ServiceDetailFormStep,
  SummarySectionConfig,
} from '../types/myServices.types';
import { formatLocationAnswerDisplay } from './locationAnswer';

export function isSummarySection(section: ServiceDetailFormSection): boolean {
  return section.kind === 'summary';
}

export function fieldSections(step: ServiceDetailFormStep): ServiceDetailFormSection[] {
  return step.sections.filter((s) => !isSummarySection(s));
}

export function summarySections(step: ServiceDetailFormStep): ServiceDetailFormSection[] {
  return step.sections.filter(isSummarySection);
}

export function formatSummaryAnswerDisplay(
  question: ServiceDetailFormQuestion | undefined,
  instance: ApplyInstanceDraft | undefined,
): string {
  if (question == null || instance == null) {
    return '—';
  }
  if (question.answerType === 'multiinput') {
    const arr = (instance.multiInputs[question.id] ?? [])
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return arr.length > 0 ? arr.join(', ') : '—';
  }
  const cur = instance.detailAnswers[question.id];
  if (question.answerType === 'checkbox') {
    const cfg = question.configJson as { options?: unknown[] } | null;
    const hasOptions = Array.isArray(cfg?.options) && cfg.options.length > 0;
    if (!hasOptions) {
      if (cur?.answerJson === true) {
        return 'Yes';
      }
      if (cur?.answerJson === false) {
        return 'No';
      }
      return '—';
    }
    const selected = Array.isArray(cur?.answerJson)
      ? (cur.answerJson as unknown[]).map(String)
      : [];
    return selected.length > 0 ? selected.join(', ') : '—';
  }
  if (question.answerType === 'location') {
    const loc = formatLocationAnswerDisplay(cur?.answerJson);
    if (loc.length > 0) {
      return loc;
    }
    const text = (cur?.answerText ?? '').trim();
    return text.length > 0 ? text : '—';
  }
  const text = (cur?.answerText ?? '').trim();
  return text.length > 0 ? text : '—';
}

export interface SummaryAggregateResult {
  ok: boolean;
  sum: number;
  target: number;
}

export function sumAggregateForSummary(
  config: SummarySectionConfig | null,
  instancesByStep: Record<number, ApplyInstanceDraft[]>,
): SummaryAggregateResult | null {
  if (config?.aggregate == null) {
    return null;
  }
  const sourceStepId = Number(config.sourceStepId);
  const questionId = Number(config.aggregate.questionId);
  const target = Number(config.aggregate.equals);
  if (
    !Number.isFinite(sourceStepId) ||
    !Number.isFinite(questionId) ||
    !Number.isFinite(target)
  ) {
    return null;
  }
  const instances = instancesByStep[sourceStepId] ?? [];
  let sum = 0;
  for (const inst of instances) {
    const raw = (inst.detailAnswers[questionId]?.answerText ?? '').trim();
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      return { ok: false, sum, target };
    }
    sum += n;
  }
  return { ok: Math.abs(sum - target) <= 0.0001, sum, target };
}

export function buildSummaryIssueLabels(
  steps: ServiceDetailFormStep[],
  instancesByStep: Record<number, ApplyInstanceDraft[]>,
): string[] {
  const issues: string[] = [];
  for (const step of steps) {
    if (step.kind !== 'fields') {
      continue;
    }
    for (const section of summarySections(step)) {
      const agg = sumAggregateForSummary(section.configJson, instancesByStep);
      if (agg != null && !agg.ok) {
        issues.push(
          `${section.title}: total must equal ${agg.target}% (currently ${agg.sum}%)`,
        );
      }
    }
  }
  return issues;
}

export function buildQuestionsByIdMap(
  steps: ServiceDetailFormStep[],
): Map<number, ServiceDetailFormQuestion> {
  const map = new Map<number, ServiceDetailFormQuestion>();
  for (const step of steps) {
    for (const section of step.sections) {
      for (const q of section.questions) {
        map.set(q.id, q);
      }
    }
  }
  return map;
}
