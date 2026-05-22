import type { PublicMembershipApiRow } from '@/features/Home/types/publicMembershipApi.types';

import type {
  FeatureChip,
  MembershipPlan,
  PlanNameStyle,
  PriceOption,
} from '../types/membershipPlan.types';

const NAME_STYLES: readonly PlanNameStyle[] = ['white', 'blue', 'amber'];
const CARD_BACKGROUNDS: readonly string[] = ['#F0F4FF', '#F0FFF8', '#FFFBF0'];
const PLAN_ICONS: readonly string[] = ['⭐', '🎯', '🚀', '💎', '👑'];

function parseAmount(value: string | number | null | undefined): number {
  if (value == null) {
    return 0;
  }
  const n = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isFinite(n) ? n : 0;
}

function membershipIcon(row: PublicMembershipApiRow, index: number): string {
  const raw = row.icon?.trim();
  if (raw === 'Users') {
    return '👤';
  }
  if (raw != null && raw.length > 0 && raw.length <= 4) {
    return raw;
  }
  return PLAN_ICONS[index % PLAN_ICONS.length] ?? '⭐';
}

function buildPriceOptions(row: PublicMembershipApiRow): PriceOption[] {
  const totalPrice = Math.round(parseAmount(row.amount));
  const days = row.days != null && row.days > 0 ? row.days : 365;
  const perMonth = days > 0 ? Math.max(1, Math.round(totalPrice / (days / 30))) : totalPrice;

  return [
    {
      id: 'default',
      duration: `${days} DAYS`,
      totalPrice,
      perMonth,
    },
  ];
}

function buildFeatureChips(row: PublicMembershipApiRow): FeatureChip[] {
  const titles =
    row.scopes
      ?.map((scope) => scope.title.trim())
      .filter((title) => title.length > 0) ?? [];

  const source =
    titles.length > 0
      ? titles
      : (row.feature?.map((item) => item.trim()).filter((item) => item.length > 0) ?? []);

  return source.slice(0, 5).map((title) => ({
    icon: { variant: 'glyph', content: '✓' },
    label: title,
  }));
}

function buildFeatureList(row: PublicMembershipApiRow): string[] {
  const fromScopes =
    row.scopes
      ?.map((scope) => scope.title.trim())
      .filter((title) => title.length > 0) ?? [];
  if (fromScopes.length > 0) {
    return fromScopes;
  }
  return row.feature?.map((item) => item.trim()).filter((item) => item.length > 0) ?? [];
}

function adsLabel(row: PublicMembershipApiRow): string | undefined {
  const badge = row.badge?.trim();
  if (badge != null && badge.length > 0) {
    return badge;
  }
  if (row.isMostPopular === 1) {
    return 'MOST POPULAR';
  }
  return undefined;
}

export function mapPublicMembershipToMembershipPlan(
  row: PublicMembershipApiRow,
  index: number,
): MembershipPlan {
  const name = row.name.trim();
  const days = row.days != null && row.days > 0 ? row.days : 365;
  const tierBadge =
    row.badge?.trim().toUpperCase() ||
    row.slug?.trim().toUpperCase() ||
    name.toUpperCase().slice(0, 12);

  return {
    id: String(row.id),
    tierBadge,
    name,
    nameStyle: NAME_STYLES[index % NAME_STYLES.length] ?? 'white',
    cardBgColor: CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length] ?? '#F0F4FF',
    adsLabel: adsLabel(row),
    features: buildFeatureChips(row),
    priceOptions: buildPriceOptions(row),
    defaultCollapsed: false,
    icon: membershipIcon(row, index),
    gstNote: `GST Inclusive • ${days} Days`,
    featureList: buildFeatureList(row),
    ctaLabel: `Start with ${name}`,
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
  return sorted.map(mapPublicMembershipToMembershipPlan);
}
