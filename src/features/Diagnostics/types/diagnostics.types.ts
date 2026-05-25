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

export type DiagnosisPackDeliveryStatus = 'active' | 'completed' | 'expired' | 'upgraded';

export interface DiagnosisPurchaseState {
  registrationId: number;
  diagnosticsMembershipId: number;
  packName: string | null;
  tierRank: number;
  startDate: string | null;
  packDeliveryStatus: DiagnosisPackDeliveryStatus;
}

export interface DiagnosisDashboardFeature {
  id: number;
  title: string;
  adminStatus: string;
  userStatus: string;
  remarks: string | null;
  updatedAt: string;
}

export interface MyDiagnosisDashboard {
  current: DiagnosisPurchaseState | null;
  displayStatus: string | null;
  features: DiagnosisDashboardFeature[];
  serviceProgressPercent: number;
  nextServiceTitle: string | null;
  upgradeHint: string | null;
}

export interface DiagnosisVaultDocument {
  id: number;
  documentUrl: string;
  originalFilename: string | null;
  mimeType: string | null;
  createdAt: string;
}

export interface DiagnosisDocumentRequirementItem {
  diagnosisMembershipDocumentId: number;
  documentTypeId: number;
  documentTypeName: string | null;
  status: number;
  sortOrder: number | null;
  availableDocuments: DiagnosisVaultDocument[];
  selectedUserDocumentIds: number[];
}

export interface MyDiagnosisDocumentRequirements {
  registrationId: number | null;
  diagnosticsMembershipId: number | null;
  items: DiagnosisDocumentRequirementItem[];
}

export interface DiagnosisDocumentSelectionPayload {
  diagnosisMembershipDocumentId: number;
  userDocumentIds: number[];
}

export interface CreateDiagnosisRegistrationResult {
  paymentStatus: string;
  razorpayOrderId: string | null;
  razorpayKeyId: string | null;
  amountPaise: number | null;
}
