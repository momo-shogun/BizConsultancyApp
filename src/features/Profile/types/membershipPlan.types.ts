import type { MembershipPlanTheme } from '../utils/membershipPlanTheme';

export interface MembershipPlanScope {
  id: number;
  title: string;
  amountLabel: string | null;
}

export interface MembershipPlan {
  id: string;
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
  theme: MembershipPlanTheme;
}

export interface MembershipPlansScreenConfig {
  membershipApiType: 'users' | 'experts';
  headerTitle: string;
  pageTitle: string;
  pageSubtitle: string;
}
