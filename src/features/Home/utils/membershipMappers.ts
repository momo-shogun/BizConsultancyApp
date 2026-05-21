import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { THEME } from '@/constants/theme';
import type { MembershipPlanItem } from '@/shared/components/cards/MembershipPlanCard/MembershipPlanCard';

import type { PublicMembershipApiRow } from '../types/publicMembershipApi.types';

export interface MapPublicMembershipsOptions {
  showMembershipTypeBadge?: boolean;
}

function normalizeMembershipType(membershipType: string): string {
  return membershipType.trim().toLowerCase();
}

function isActiveMembership(row: PublicMembershipApiRow): boolean {
  return row.status === 1 && (row.isDeleted ?? 0) === 0;
}

/** Guest: users + experts. Logged-in user: users only. Consultant: experts only. */
export function filterMembershipsForHome(
  rows: PublicMembershipApiRow[],
  isAuthenticated: boolean,
  accountRole: AuthRole | null,
): PublicMembershipApiRow[] {
  const active = rows.filter(isActiveMembership);

  if (!isAuthenticated) {
    return active.filter((row) => {
      const type = normalizeMembershipType(row.membershipType);
      return type === 'users' || type === 'experts';
    });
  }

  if (accountRole === 'consultant') {
    return active.filter((row) => normalizeMembershipType(row.membershipType) === 'experts');
  }

  return active.filter((row) => normalizeMembershipType(row.membershipType) === 'users');
}

const MEMBERSHIP_GRADIENTS: readonly [readonly [string, string], readonly [string, string], readonly [string, string]] = [
  [THEME.colors.chooseAccountUserGrad1, THEME.colors.chooseAccountUserGrad2],
  [THEME.colors.chooseAccountConsultantGrad1, THEME.colors.chooseAccountConsultantGrad2],
  [THEME.colors.splashGreen3, THEME.colors.splashGreen4],
];

function parseAmount(value: string | number | null | undefined): number {
  if (value == null) {
    return 0;
  }
  const n = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isFinite(n) ? n : 0;
}

function formatRupee(value: string | number | null | undefined): string {
  const n = parseAmount(value);
  if (n <= 0) {
    return 'Free';
  }
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export function formatMembershipTypeLabel(membershipType: string): string {
  const type = membershipType.trim().toLowerCase();
  if (type === 'users') {
    return 'Users';
  }
  if (type === 'experts') {
    return 'Experts';
  }
  if (type === 'suppliers') {
    return 'Suppliers';
  }
  if (type.length === 0) {
    return 'Membership';
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function membershipAudienceLabel(membershipType: string): string | undefined {
  const type = membershipType.trim().toLowerCase();
  if (type === 'users') {
    return 'For individuals & solo founders';
  }
  if (type === 'experts') {
    return 'For consultants & experts';
  }
  if (type === 'suppliers') {
    return 'For suppliers & vendors';
  }
  return undefined;
}

function membershipFeatures(row: PublicMembershipApiRow): string[] {
  const fromScopes =
    row.scopes
      ?.map((scope) => scope.title.trim())
      .filter((title) => title.length > 0) ?? [];
  if (fromScopes.length > 0) {
    return fromScopes;
  }
  const fromFeature =
    row.feature
      ?.map((item) => item.trim())
      .filter((item) => item.length > 0) ?? [];
  return fromFeature;
}

function membershipBadgeLabel(row: PublicMembershipApiRow): string | undefined {
  const badge = row.badge?.trim();
  if (badge != null && badge.length > 0) {
    return badge;
  }
  if (row.isMostPopular === 1) {
    return 'Most popular';
  }
  return undefined;
}

function membershipPeriodLabel(days: number | null): string | undefined {
  if (days == null || days <= 0) {
    return undefined;
  }
  return `/${days} days`;
}

export function mapPublicMembershipToPlanItem(
  row: PublicMembershipApiRow,
  index: number,
  options?: MapPublicMembershipsOptions,
): MembershipPlanItem {
  const showMembershipTypeBadge = options?.showMembershipTypeBadge === true;
  const title = row.name.trim();
  const subtitle =
    row.description?.trim() ||
    (row.days != null && row.days > 0 ? `Valid for ${row.days} days` : undefined);

  return {
    id: String(row.id),
    membershipTypeLabel: showMembershipTypeBadge
      ? formatMembershipTypeLabel(row.membershipType)
      : undefined,
    audienceLabel: membershipAudienceLabel(row.membershipType),
    title,
    subtitle,
    priceLabel: formatRupee(row.amount),
    periodLabel: membershipPeriodLabel(row.days),
    badgeLabel: membershipBadgeLabel(row),
    ctaLabel: `Get ${title}`,
    features: membershipFeatures(row),
    gradientColors: MEMBERSHIP_GRADIENTS[index % MEMBERSHIP_GRADIENTS.length],
  };
}

export function mapPublicMembershipsToPlanItems(
  rows: PublicMembershipApiRow[],
  options?: MapPublicMembershipsOptions,
): MembershipPlanItem[] {
  const sorted = [...rows].sort((a, b) => {
    const rankA = a.tierRank > 0 ? a.tierRank : a.id;
    const rankB = b.tierRank > 0 ? b.tierRank : b.id;
    return rankA - rankB;
  });
  return sorted.map((row, index) => mapPublicMembershipToPlanItem(row, index, options));
}
