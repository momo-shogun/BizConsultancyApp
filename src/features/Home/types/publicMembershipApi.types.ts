export interface PublicMembershipScopeApiRow {
  id: number;
  membershipId: number;
  title: string;
  amount?: string | number | null;
  status?: number;
  isDeleted?: number;
}

export interface PublicMembershipApiRow {
  id: number;
  name: string;
  slug: string | null;
  membershipType: string;
  basePrice: string | number | null;
  sgst?: string | number | null;
  cgst?: string | number | null;
  igst?: string | number | null;
  discount?: string | number | null;
  discountType?: string | null;
  walletTransferAmounts?: string | number | null;
  amount: string | number | null;
  days: number | null;
  termCondition?: string[] | null;
  feature?: string[] | null;
  description: string | null;
  badge: string | null;
  icon: string | null;
  isMostPopular: number;
  status: number;
  tierRank: number;
  isDeleted?: number;
  scopes?: PublicMembershipScopeApiRow[];
}

export interface PublicMembershipsQuery {
  type?: 'users' | 'experts' | 'suppliers';
}
