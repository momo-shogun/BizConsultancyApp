export interface DiagnosticsMembership {
  id: number;
  packName: string;
  slab: string | null;
  servicesIncluded: string[];
  diagnosisFeatures: string[];
  idealFor: string | null;
  priceExclGst: number;
  isPopular: boolean;
  tierRank: number;
}

export type DiagnosisPlanCtaMode =
  | 'purchase'
  | 'active'
  | 'upgrade'
  | 'disabled_lower';

export interface DiagnosisPlanViewModel {
  id: number;
  title: string;
  priceLabel: string;
  idealFor: string | null;
  features: string[];
  isPopular: boolean;
  ctaMode: DiagnosisPlanCtaMode;
  ctaLabel: string;
}

export interface DiagnosisPurchaseState {
  registrationId: number;
  diagnosticsMembershipId: number;
  packName: string | null;
  tierRank: number;
  packDeliveryStatus: 'active' | 'completed' | 'expired' | 'upgraded';
}

export interface CreateDiagnosisRegistrationResult {
  paymentStatus: string;
  razorpayOrderId: string | null;
  razorpayKeyId: string | null;
  amountPaise: number | null;
}
