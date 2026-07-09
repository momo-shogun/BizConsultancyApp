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

export interface MyMembershipFeatureScopeDto {
  id?: number | null;
  status?: number | null;
  isDeleted?: number | null;
  isActive?: boolean | null;
}

export interface MyMembershipFeatureDto {
  id: number;
  title: string;
  adminStatus: string;
  userStatus: string;
  remarks: string | null;
  updatedAt: string;
  featureStatus?: number | null;
  isDeleted?: number | null;
  scopeStatus?: number | null;
  membershipScopeStatus?: number | null;
  membershipScope?: MyMembershipFeatureScopeDto | null;
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
  userStatus: string | null;
}

export interface MembershipFeatureRequestResult {
  id: number;
  status: string;
  title: string;
}
