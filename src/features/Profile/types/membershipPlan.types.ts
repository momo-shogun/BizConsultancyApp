import type { MembershipPlanTheme } from '../utils/membershipPlanTheme';

export type MembershipPlanCtaMode = 'choose' | 'active' | 'upgrade' | 'disabled';

export interface MembershipPlanScope {
  id: number;
  title: string;
  amountLabel: string | null;
}

export interface MembershipPlan {
  id: string;
  membershipId: number;
  tierRank: number;
  membershipType: string;
  name: string;
  slug: string;
  description: string | null;
  badge: string | null;
  icon: string | null;
  isMostPopular: boolean;
  amount: number;
  basePrice: number | null;
  days: number;
  walletTransferLabel: string | null;
  gstLabel: string;
  scopes: MembershipPlanScope[];
  features: string[];
  termConditions: string[];
  ctaLabel: string;
  ctaMode: MembershipPlanCtaMode;
  theme: MembershipPlanTheme;
}

export interface MembershipPlansScreenConfig {
  membershipApiType: 'users' | 'experts';
  headerTitle: string;
  pageTitle: string;
  pageSubtitle: string;
}
