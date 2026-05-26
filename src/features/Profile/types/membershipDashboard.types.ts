export type MembershipPurchaseStatus = 'active' | 'expired';

export interface MyMembershipCurrentDto {
  registrationId: number;
  membershipId: number;
  membershipName?: string;
  tierRank: number;
  startDate: string | null;
  endDate: string | null;
  status: MembershipPurchaseStatus;
  upgradedFromLower?: boolean;
}

export interface MyMembershipFeatureDto {
  id: number;
  title: string;
  adminStatus: string;
  userStatus: string;
  remarks: string | null;
  updatedAt: string;
  scopeStatus?: number | null;
  membershipScopeStatus?: number | null;
  membershipScope?: { status?: number | null } | null;
}

export interface MyMembershipPurchaseStateDto {
  userType: string;
  membershipType: 'users' | 'experts' | string;
  current: MyMembershipCurrentDto | null;
  daysRemaining: number | null;
  progressPercent: number;
}

export interface MyMembershipDashboardDto {
  userType: string;
  membershipType: 'users' | 'experts' | string;
  current: MyMembershipCurrentDto | null;
  daysRemaining: number | null;
  progressPercent: number;
  features: MyMembershipFeatureDto[];
  mostUsedFeatureTitle: string | null;
  mostUsedFeatureLabel: string | null;
  upgradeHint: string | null;
}

export interface UserProfileMembershipBenefit {
  id: string;
  title: string;
  statusLabel: string | null;
}
