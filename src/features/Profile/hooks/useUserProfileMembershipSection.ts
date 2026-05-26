import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useGetPublicMembershipsQuery } from '@/features/Home/api/homePublicApi';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';

import { useGetMyMembershipDashboardQuery } from '../api/membershipRegistrationApi';
import type { UserProfileMembershipBenefit } from '../types/membershipDashboard.types';
import {
  formatMembershipDateLabel,
  isMembershipFeatureScopeActive,
  membershipFeatureStatusLabel,
} from '../utils/membershipDashboardParsing';

type AccountNav = NativeStackNavigationProp<AccountStackParamList>;

const MAX_BENEFITS = 8;

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
}

function benefitsFromCatalog(
  membershipId: number,
  plans: ReturnType<typeof useGetPublicMembershipsQuery>['data'],
): UserProfileMembershipBenefit[] {
  const plan = plans?.find((row) => row.id === membershipId);
  if (plan == null) {
    return [];
  }
  const scopeTitles =
    plan.scopes
      ?.filter((scope) => scope.status !== 0 && (scope.isDeleted ?? 0) === 0)
      .map((scope) => scope.title.trim())
      .filter((title) => title.length > 0) ?? [];
  if (scopeTitles.length > 0) {
    return scopeTitles.map((title, index) => ({
      id: `scope-${plan.id}-${index}`,
      title,
      statusLabel: null,
    }));
  }
  const features =
    plan.feature?.map((item) => item.trim()).filter((item) => item.length > 0) ?? [];
  return features.map((title, index) => ({
    id: `feature-${plan.id}-${index}`,
    title,
    statusLabel: null,
  }));
}

export type ProfileMembershipLine = 'users' | 'experts';

export interface UseUserProfileMembershipSectionOptions {
  enabled: boolean;
  membershipLine: ProfileMembershipLine;
}

export function useUserProfileMembershipSection(
  options: UseUserProfileMembershipSectionOptions,
): UserProfileMembershipSectionModel {
  const { enabled, membershipLine } = options;
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
        .filter(isMembershipFeatureScopeActive)
        .map((feature) => ({
          id: String(feature.id),
          title: feature.title,
          statusLabel: membershipFeatureStatusLabel(feature.userStatus),
        })) ?? [];

    const catalogBenefits =
      current != null ? benefitsFromCatalog(current.membershipId, publicPlans) : [];

    const benefits = (dashboardBenefits.length > 0 ? dashboardBenefits : catalogBenefits).slice(
      0,
      MAX_BENEFITS,
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
    };
  }, [
    dashboard,
    dashboardError,
    dashboardLoading,
    publicPlans,
    refetchDashboard,
    membershipLine,
    onMembershipPress,
  ]);
}
