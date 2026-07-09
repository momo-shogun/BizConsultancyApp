import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useGetPublicMembershipsQuery } from '@/features/Home/api/homePublicApi';
import type {
  PublicMembershipApiRow,
  PublicMembershipScopeApiRow,
} from '@/features/Home/types/publicMembershipApi.types';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';

import { useGetMyMembershipDashboardQuery } from '../api/membershipRegistrationApi';
import type {
  MyMembershipFeatureDto,
  UserProfileMembershipBenefit,
} from '../types/membershipDashboard.types';
import {
  formatMembershipDateLabel,
  isMembershipFeatureScopeActive,
  membershipFeatureStatusLabel,
} from '../utils/membershipDashboardParsing';

type AccountNav = NativeStackNavigationProp<AccountStackParamList>;

const MAX_BENEFITS = 8;
const MAX_PLAN_TEASERS = 3;

export interface ProfilePlanTeaser {
  id: number;
  name: string;
  priceLabel: string;
  durationLabel: string | null;
  perkCount: number;
  themeIndex: number;
  isPopular: boolean;
}

export interface UserProfileMembershipSectionModel {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  hasPlan: boolean;
  planName: string;
  statusLabel: string;
  isActive: boolean;
  validityText: string | null;
  daysRemaining: number | null;
  progressPercent: number;
  benefits: UserProfileMembershipBenefit[];
  upgradeHint: string | null;
  showUpgradeCta: boolean;
  upgradeCtaLabel: string;
  onMembershipPress: () => void;
  priceLabel: string | null;
  durationLabel: string | null;
  planThemeIndex: number;
  planTeasers: ProfilePlanTeaser[];
}

function parseAmount(value: string | number | null | undefined): number | null {
  if (value == null) {
    return null;
  }
  const n = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isFinite(n) ? n : null;
}

function formatPlanPrice(row: PublicMembershipApiRow): string {
  const amount = parseAmount(row.amount);
  if (amount == null || amount <= 0) {
    return 'Free';
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function planPerkCount(row: PublicMembershipApiRow): number {
  const scopes =
    row.scopes
      ?.filter((scope) => scope.status !== 0 && (scope.isDeleted ?? 0) === 0)
      .map((scope) => scope.title.trim())
      .filter((title) => title.length > 0) ?? [];
  if (scopes.length > 0) {
    return scopes.length;
  }
  return row.feature?.map((item) => item.trim()).filter((item) => item.length > 0).length ?? 0;
}

function formatPlanDuration(days: number | null): string | null {
  if (days == null || days <= 0) {
    return null;
  }
  if (days >= 365) {
    const years = Math.round(days / 365);
    return years === 1 ? '1 year' : `${years} years`;
  }
  if (days >= 30) {
    const months = Math.round(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }
  return days === 1 ? '1 day' : `${days} days`;
}

function activePublicPlans(rows: PublicMembershipApiRow[] | undefined): PublicMembershipApiRow[] {
  if (rows == null) {
    return [];
  }
  return rows
    .filter((row) => row.status !== 0 && (row.isDeleted ?? 0) === 0)
    .sort((a, b) => {
      const rankA = a.tierRank > 0 ? a.tierRank : a.id;
      const rankB = b.tierRank > 0 ? b.tierRank : b.id;
      return rankA - rankB;
    });
}

function planThemeIndexForRow(
  row: PublicMembershipApiRow,
  sortedPlans: PublicMembershipApiRow[],
): number {
  const index = sortedPlans.findIndex((plan) => plan.id === row.id);
  return index >= 0 ? index : 0;
}

function isCatalogScopeActive(scope: PublicMembershipScopeApiRow): boolean {
  return scope.status !== 0 && (scope.isDeleted ?? 0) === 0;
}

function findCatalogScopeForFeature(
  feature: MyMembershipFeatureDto,
  membershipId: number,
  plans: PublicMembershipApiRow[] | undefined,
): PublicMembershipScopeApiRow | null {
  const plan = plans?.find((row) => row.id === membershipId);
  if (plan?.scopes == null) {
    return null;
  }
  const normalizedTitle = feature.title.trim().toLowerCase();
  return (
    plan.scopes.find(
      (scope) =>
        scope.id === feature.id ||
        scope.title.trim().toLowerCase() === normalizedTitle,
    ) ?? null
  );
}

function isMembershipDashboardFeatureVisible(
  feature: MyMembershipFeatureDto,
  membershipId: number | null,
  plans: PublicMembershipApiRow[] | undefined,
): boolean {
  if (!isMembershipFeatureScopeActive(feature)) {
    return false;
  }
  if (membershipId == null) {
    return true;
  }
  const catalogScope = findCatalogScopeForFeature(feature, membershipId, plans);
  if (catalogScope == null) {
    return true;
  }
  return isCatalogScopeActive(catalogScope);
}

function benefitsFromCatalog(
  membershipId: number,
  plans: PublicMembershipApiRow[] | undefined,
): UserProfileMembershipBenefit[] {
  const plan = plans?.find((row) => row.id === membershipId);
  if (plan == null) {
    return [];
  }
  const activeScopes =
    plan.scopes?.filter(isCatalogScopeActive).filter((scope) => scope.title.trim().length > 0) ??
    [];
  if (activeScopes.length > 0) {
    return activeScopes.map((scope) => ({
      id: String(scope.id),
      title: scope.title.trim(),
      statusLabel: null,
      userStatus: null,
    }));
  }
  const features =
    plan.feature?.map((item) => item.trim()).filter((item) => item.length > 0) ?? [];
  return features.map((title, index) => ({
    id: `feature-${plan.id}-${index}`,
    title,
    statusLabel: null,
    userStatus: null,
  }));
}

export type ProfileMembershipLine = 'users' | 'experts';

export interface UseUserProfileMembershipSectionOptions {
  enabled: boolean;
  membershipLine: ProfileMembershipLine;
  maxBenefits?: number;
}

export function useUserProfileMembershipSection(
  options: UseUserProfileMembershipSectionOptions,
): UserProfileMembershipSectionModel {
  const { enabled, membershipLine, maxBenefits = MAX_BENEFITS } = options;
  const navigation = useNavigation<AccountNav>();

  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isError: dashboardError,
    refetch: refetchDashboard,
  } = useGetMyMembershipDashboardQuery(undefined, { skip: !enabled });

  const { data: publicPlans } = useGetPublicMembershipsQuery(
    { type: membershipLine },
    { skip: !enabled },
  );

  const onMembershipPress = useCallback((): void => {
    navigation.navigate(ROUTES.Account.Membership);
  }, [navigation]);

  return useMemo((): UserProfileMembershipSectionModel => {
    const refetch = (): void => {
      void refetchDashboard();
    };

    const purchaseLine = (dashboard?.membershipType ?? '').trim().toLowerCase();
    const current =
      dashboard?.current != null && purchaseLine === membershipLine ? dashboard.current : null;
    const hasPlan = current != null;
    const isActive = current?.status === 'active';

    const statusLabel = !hasPlan
      ? 'No plan'
      : current?.status === 'expired'
        ? 'Expired'
        : current?.upgradedFromLower
          ? 'Active · upgraded'
          : 'Active';

    const start = formatMembershipDateLabel(current?.startDate ?? null);
    const end = formatMembershipDateLabel(current?.endDate ?? null);
    let validityText: string | null = null;
    if (start != null && end != null) {
      validityText = `${start} – ${end}`;
    } else if (end != null) {
      validityText = `Valid until ${end}`;
    } else if (start != null) {
      validityText = `Started ${start}`;
    }

    const dashboardBenefits: UserProfileMembershipBenefit[] =
      dashboard?.features
        .filter((feature) =>
          isMembershipDashboardFeatureVisible(
            feature,
            current?.membershipId ?? null,
            publicPlans,
          ),
        )
        .map((feature) => ({
          id: String(feature.id),
          title: feature.title,
          statusLabel: membershipFeatureStatusLabel(feature.userStatus),
          userStatus: feature.userStatus,
        })) ?? [];

    const catalogBenefits =
      current != null ? benefitsFromCatalog(current.membershipId, publicPlans) : [];

    const benefits = (dashboardBenefits.length > 0 ? dashboardBenefits : catalogBenefits).slice(
      0,
      maxBenefits,
    );

    const currentTier = current?.tierRank ?? 0;
    const hasHigherTierPlan =
      publicPlans?.some((plan) => {
        const rank = plan.tierRank > 0 ? plan.tierRank : plan.id;
        return rank > currentTier && plan.status !== 0 && (plan.isDeleted ?? 0) === 0;
      }) ?? false;

    const upgradeHint =
      isActive && dashboard?.upgradeHint != null && dashboard.upgradeHint.length > 0
        ? dashboard.upgradeHint
        : null;

    const sortedPlans = activePublicPlans(publicPlans);
    const matchedPlan =
      current != null ? sortedPlans.find((plan) => plan.id === current.membershipId) : undefined;
    const planThemeIndex =
      matchedPlan != null ? planThemeIndexForRow(matchedPlan, sortedPlans) : 0;
    const priceLabel = matchedPlan != null ? formatPlanPrice(matchedPlan) : null;
    const durationLabel =
      matchedPlan != null ? formatPlanDuration(matchedPlan.days) : null;

    const planTeasers: ProfilePlanTeaser[] = sortedPlans.slice(0, MAX_PLAN_TEASERS).map(
      (row, index) => ({
        id: row.id,
        name: row.name.trim(),
        priceLabel: formatPlanPrice(row),
        durationLabel: formatPlanDuration(row.days),
        perkCount: planPerkCount(row),
        themeIndex: index,
        isPopular: row.isMostPopular === 1,
      }),
    );

    let showUpgradeCta = false;
    let upgradeCtaLabel = 'View membership plans';

    if (!hasPlan) {
      showUpgradeCta = true;
      upgradeCtaLabel = 'View membership plans';
    } else if (!isActive) {
      showUpgradeCta = true;
      upgradeCtaLabel = 'Renew membership';
    } else if (hasHigherTierPlan || upgradeHint != null) {
      showUpgradeCta = true;
      upgradeCtaLabel = 'Upgrade membership';
    }

    return {
      isLoading: dashboardLoading,
      isError: dashboardError,
      refetch,
      hasPlan,
      planName: current?.membershipName?.trim() ?? 'Membership',
      statusLabel,
      isActive,
      validityText,
      daysRemaining: dashboard?.daysRemaining ?? null,
      progressPercent: dashboard?.progressPercent ?? 0,
      benefits,
      upgradeHint,
      showUpgradeCta,
      upgradeCtaLabel,
      onMembershipPress,
      priceLabel,
      durationLabel,
      planThemeIndex,
      planTeasers,
    };
  }, [
    dashboard,
    dashboardError,
    dashboardLoading,
    publicPlans,
    refetchDashboard,
    membershipLine,
    maxBenefits,
    onMembershipPress,
  ]);
}
