import type { MyOnboardingSubmission } from '@/features/MyServices/types/myServices.types';
import { isOnboardingSubmissionPaid } from '@/features/Services/utils/onboarding/onboardingSubmissionPaid';

export interface PurchasedServiceEntry {
  submissionId: number;
  status: string | null;
}

export type PurchasedServicesBySlug = ReadonlyMap<string, PurchasedServiceEntry>;

function normalizeServiceSlug(slug: string | null | undefined): string | null {
  const trimmed = slug?.trim().toLowerCase();
  return trimmed != null && trimmed.length > 0 ? trimmed : null;
}

export function buildPurchasedServicesBySlug(
  submissions: readonly MyOnboardingSubmission[],
): PurchasedServicesBySlug {
  const map = new Map<string, PurchasedServiceEntry>();

  for (const submission of submissions) {
    if (!isOnboardingSubmissionPaid(submission)) {
      continue;
    }

    const slug = normalizeServiceSlug(submission.serviceSlug);
    if (slug == null) {
      continue;
    }

    const existing = map.get(slug);
    if (existing == null || submission.id > existing.submissionId) {
      map.set(slug, {
        submissionId: submission.id,
        status: submission.status,
      });
    }
  }

  return map;
}

export function isServiceSlugPurchased(
  lookup: PurchasedServicesBySlug,
  slug: string,
): boolean {
  const normalized = normalizeServiceSlug(slug);
  return normalized != null && lookup.has(normalized);
}

export function getPurchasedServiceEntry(
  lookup: PurchasedServicesBySlug,
  slug: string,
): PurchasedServiceEntry | null {
  const normalized = normalizeServiceSlug(slug);
  if (normalized == null) {
    return null;
  }
  return lookup.get(normalized) ?? null;
}
