import { getMembershipPlanTheme } from '@/features/Profile/utils/membershipPlanTheme';
import type { MembershipPlanTheme } from '@/features/Profile/utils/membershipPlanTheme';

export type DiagnosisPlanTheme = MembershipPlanTheme;

export function getDiagnosisPlanTheme(planId: number, packTitle: string): DiagnosisPlanTheme {
  const title = packTitle.toLowerCase();
  if (title.includes('strategy')) {
    return getMembershipPlanTheme(2);
  }
  if (title.includes('growth')) {
    return getMembershipPlanTheme(4);
  }
  if (title.includes('starter')) {
    return getMembershipPlanTheme(1);
  }
  return getMembershipPlanTheme(planId);
}

export function diagnosisIconName(
  packTitle: string,
): 'leaf-outline' | 'trending-up-outline' | 'rocket-outline' | 'ribbon-outline' {
  const title = packTitle.toLowerCase();
  if (title.includes('strategy')) {
    return 'rocket-outline';
  }
  if (title.includes('growth')) {
    return 'trending-up-outline';
  }
  if (title.includes('starter')) {
    return 'leaf-outline';
  }
  return 'ribbon-outline';
}
