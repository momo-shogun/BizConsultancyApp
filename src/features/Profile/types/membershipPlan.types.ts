export type PlanNameStyle = 'white' | 'blue' | 'amber';
export type FeatureIconVariant = 'pill' | 'tag' | 'glyph';

export interface FeatureIcon {
  variant: FeatureIconVariant;
  content: string;
}

export interface FeatureChip {
  icon: FeatureIcon;
  label: string;
}

export interface PriceOption {
  id: string;
  duration: string;
  totalPrice: number;
  perMonth: number;
}

export interface MembershipPlan {
  id: string;
  tierBadge: string;
  name: string;
  nameStyle: PlanNameStyle;
  cardBgColor: string;
  adsLabel?: string;
  features: FeatureChip[];
  priceOptions: PriceOption[];
  defaultCollapsed?: boolean;
  icon: string;
  gstNote: string;
  featureList: string[];
  ctaLabel: string;
}

export interface MembershipPlansScreenConfig {
  membershipApiType: 'users' | 'experts';
  headerTitle: string;
  pageTitle: string;
  pageTitleAccent: string;
  pageSubtitle: string;
}
