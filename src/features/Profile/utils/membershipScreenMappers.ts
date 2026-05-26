import type {
  PublicMembershipApiRow,
  PublicMembershipScopeApiRow,
} from '@/features/Home/types/publicMembershipApi.types';

import type { MembershipPlan, MembershipPlanScope } from '../types/membershipPlan.types';
import { getMembershipPlanTheme } from './membershipPlanTheme';

function parseAmount(value: string | number | null | undefined): number | null {
  if (value == null) {
    return null;
  }
  const n = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isFinite(n) ? n : null;
}

function formatRupee(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function formatScopeAmount(amount: string | number | null | undefined): string | null {
  const n = parseAmount(amount);
  if (n == null || n <= 0) {
    return null;
  }
  return formatRupee(n);
}

function mapScopes(scopes: PublicMembershipScopeApiRow[] | undefined): MembershipPlanScope[] {
  if (!Array.isArray(scopes)) {
    return [];
  }
  return scopes
    .filter((row) => row.status !== 0 && (row.isDeleted ?? 0) === 0)
    .map((row) => ({
      id: row.id,
      title: row.title.trim(),
      amountLabel: formatScopeAmount(row.amount),
    }))
    .filter((item) => item.title.length > 0);
}

function buildGstLabel(row: PublicMembershipApiRow): string {
  const sgst = parseAmount(row.sgst);
  const cgst = parseAmount(row.cgst);
  const igst = parseAmount(row.igst);
  const parts: string[] = [];
  if (sgst != null && sgst > 0) {
    parts.push(`${sgst}% SGST`);
  }
  if (cgst != null && cgst > 0) {
    parts.push(`${cgst}% CGST`);
  }
  if (igst != null && igst > 0) {
    parts.push(`${igst}% IGST`);
  }
  if (parts.length > 0) {
    return `Inclusive of ${parts.join(' + ')}`;
  }
  return 'Taxes as applicable';
}

function buildWalletLabel(row: PublicMembershipApiRow): string | null {
  const wallet = parseAmount(row.walletTransferAmounts);
  if (wallet == null || wallet <= 0) {
    return null;
  }
  return `${formatRupee(wallet)} wallet credit included`;
}

export function mapPublicMembershipToMembershipPlan(
  row: PublicMembershipApiRow,
  index: number,
): MembershipPlan {
  const name = row.name.trim();
  const amount = parseAmount(row.amount) ?? 0;
  const basePrice = parseAmount(row.basePrice);
  const days = row.days != null && row.days > 0 ? row.days : 0;
  const description = row.description?.trim() ?? null;
  const features =
    row.feature?.map((item) => item.trim()).filter((item) => item.length > 0) ?? [];
  const termConditions =
    row.termCondition?.map((item) => item.trim()).filter((item) => item.length > 0) ?? [];

  const membershipId = row.id;
  const tierRank = row.tierRank > 0 ? row.tierRank : membershipId;

  return {
    id: String(membershipId),
    membershipId,
    tierRank,
    membershipType: row.membershipType.trim(),
    name,
    slug: row.slug?.trim() ?? '',
    description: description != null && description !== name ? description : null,
    badge: row.badge?.trim() ?? null,
    icon: row.icon?.trim() ?? null,
    isMostPopular: row.isMostPopular === 1,
    amount,
    basePrice: basePrice != null && basePrice > 0 ? Math.round(basePrice) : null,
    days,
    walletTransferLabel: buildWalletLabel(row),
    gstLabel: buildGstLabel(row),
    scopes: mapScopes(row.scopes),
    features,
    termConditions,
    ctaLabel: `Choose ${name}`,
    ctaMode: 'choose',
    theme: getMembershipPlanTheme(index),
  };
}

export function mapPublicMembershipsToMembershipPlans(
  rows: PublicMembershipApiRow[],
): MembershipPlan[] {
  const active = rows.filter((row) => row.status === 1 && (row.isDeleted ?? 0) === 0);
  const sorted = [...active].sort((a, b) => {
    const rankA = a.tierRank > 0 ? a.tierRank : a.id;
    const rankB = b.tierRank > 0 ? b.tierRank : b.id;
    return rankA - rankB;
  });
  return sorted.map((row, index) => mapPublicMembershipToMembershipPlan(row, index));
}
