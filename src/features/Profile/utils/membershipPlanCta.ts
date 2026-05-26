import type { MyMembershipCurrentDto } from '../types/membershipDashboard.types';
import type { MembershipPlan, MembershipPlanCtaMode } from '../types/membershipPlan.types';

function planRank(plan: Pick<MembershipPlan, 'tierRank' | 'membershipId'>): number {
  return plan.tierRank > 0 ? plan.tierRank : plan.membershipId;
}

function featureTitles(plan: MembershipPlan): string[] {
  if (plan.scopes.length > 0) {
    return plan.scopes.map((scope) => scope.title);
  }
  return plan.features;
}

export function extraFeaturesComparedToCurrent(
  currentFeatures: string[],
  targetFeatures: string[],
): string[] {
  const current = new Set(currentFeatures.map((item) => item.trim().toLowerCase()));
  return targetFeatures.filter((item) => !current.has(item.trim().toLowerCase()));
}

export function resolveMembershipPlanCta(
  plan: MembershipPlan,
  lineCurrent: MyMembershipCurrentDto | null,
  allPlans: MembershipPlan[],
): { mode: MembershipPlanCtaMode; upgradeExtras: string[] } {
  if (!lineCurrent || lineCurrent.status === 'expired') {
    return { mode: 'choose', upgradeExtras: [] };
  }

  const planTier = planRank(plan);
  const currentPlan = allPlans.find((row) => row.membershipId === lineCurrent.membershipId);
  const currentFeatures = currentPlan != null ? featureTitles(currentPlan) : [];
  const activeTier = currentPlan != null ? planRank(currentPlan) : lineCurrent.tierRank;

  if (plan.membershipId === lineCurrent.membershipId) {
    return { mode: 'active', upgradeExtras: [] };
  }
  if (planTier < activeTier) {
    return { mode: 'disabled', upgradeExtras: [] };
  }
  if (planTier > activeTier) {
    return {
      mode: 'upgrade',
      upgradeExtras: extraFeaturesComparedToCurrent(currentFeatures, featureTitles(plan)),
    };
  }
  return { mode: 'choose', upgradeExtras: [] };
}

export function membershipPlanCtaLabel(
  plan: MembershipPlan,
  mode: MembershipPlanCtaMode,
): string {
  switch (mode) {
    case 'active':
      return 'Current plan';
    case 'disabled':
      return 'Higher plan active';
    case 'upgrade':
      return `Upgrade to ${plan.name}`;
    default:
      return plan.ctaLabel;
  }
}
