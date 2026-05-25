import type { MyOnboardingSubmission, MyServicesFilterTab } from '../types/myServices.types';
import { isOnboardingSubmissionPaid } from '@/features/Services/utils/onboarding/onboardingSubmissionPaid';

export type StatusTone = 'success' | 'warning' | 'info' | 'neutral';

export interface StatusDisplay {
  label: string;
  tone: StatusTone;
}

export function normalizeSubmissionStatus(
  status: string | null | undefined,
): StatusDisplay {
  const raw = (status ?? 'enrolled').toLowerCase().replace(/_/g, ' ');
  if (raw.includes('complete')) {
    return { label: 'Completed', tone: 'success' };
  }
  if (raw.includes('applied')) {
    return { label: 'Applied', tone: 'success' };
  }
  if (raw.includes('progress')) {
    return { label: 'In progress', tone: 'info' };
  }
  if (raw.includes('enroll')) {
    return { label: 'Enrolled', tone: 'success' };
  }
  if (raw.length === 0) {
    return { label: 'Unknown', tone: 'neutral' };
  }
  return {
    label: raw.charAt(0).toUpperCase() + raw.slice(1),
    tone: 'neutral',
  };
}

export function isUnpaidInProgress(item: MyOnboardingSubmission): boolean {
  const status = (item.status ?? '').toString().trim().toLowerCase();
  return status === 'in_progress' && !isOnboardingSubmissionPaid(item);
}

export function canShowApplyButton(
  item: MyOnboardingSubmission,
  eligible: boolean,
): boolean {
  if (!eligible) {
    return false;
  }
  const status = (item.status ?? '').toString().trim().toLowerCase();
  return status === 'enrolled' && isOnboardingSubmissionPaid(item);
}

export function getSubmissionFilterTab(item: MyOnboardingSubmission): MyServicesFilterTab {
  const status = (item.status ?? '').toLowerCase();
  if (isUnpaidInProgress(item)) {
    return 'action';
  }
  if (status === 'completed' || status === 'applied') {
    return 'completed';
  }
  if (status === 'enrolled' || status === 'in_progress') {
    return 'active';
  }
  return 'other';
}

export function filterSubmissionsByTab(
  items: readonly MyOnboardingSubmission[],
  tab: MyServicesFilterTab,
): MyOnboardingSubmission[] {
  if (tab === 'all') {
    return [...items];
  }
  return items.filter((item) => getSubmissionFilterTab(item) === tab);
}

export function formatInrAmount(value: string | null | undefined): string {
  if (value == null || value.trim().length === 0) {
    return '—';
  }
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return value;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDisplayDate(value: string | null | undefined): string {
  if (value == null || value.trim().length === 0) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function sumSubmissionAmounts(items: readonly MyOnboardingSubmission[]): number {
  return items.reduce((sum, item) => sum + (Number(item.amount ?? 0) || 0), 0);
}
