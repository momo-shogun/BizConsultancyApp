export type OnboardingQuestionType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'radio'
  | 'select'
  | 'checkbox'
  | 'file';

export type OnboardingFieldValue = string | number | boolean | string[] | null;

export type OnboardingSubmissionStatus =
  | 'enrolled'
  | 'in_progress'
  | 'completed'
  | 'applied'
  | null;

export interface OnboardingQuestionOption {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface OnboardingFormQuestion {
  id: number;
  formId: number;
  question: string;
  type: OnboardingQuestionType;
  placeholder: string | null;
  required: boolean;
  order: number;
  step: number;
  options: OnboardingQuestionOption[];
}

export interface OnboardingForm {
  id: number;
  serviceId: number;
  serviceSlug: string | null;
  name: string;
  isDefault: boolean;
  status: string;
  questions: OnboardingFormQuestion[];
}

export interface OnboardingFormConfigResponse {
  form: OnboardingForm;
  forms: OnboardingForm[];
}

export interface ServicePageCostFee {
  label?: string;
  amountOrText?: string;
  subtext?: string;
}

export interface ServicePageCost {
  professionalFee?: ServicePageCostFee;
  governmentFee?: ServicePageCostFee;
}

export interface OnboardingSubmissionRow {
  id: number;
  userId: number | null;
  userType: string | null;
  formId: number | null;
  serviceSlug: string | null;
  serviceName: string | null;
  name: string | null;
  email: string | null;
  mobile: string | null;
  city: string | null;
  paymentMode: string | null;
  orderId: string | null;
  paymentId: string | null;
  transactionDate: string | null;
  amount: string | null;
  status: OnboardingSubmissionStatus;
  answers: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceRegistrationIntakePayload {
  serviceSlug: string;
  formId?: number | null;
  name: string;
  email: string;
  mobile: string;
  city?: string | null;
  serviceName?: string | null;
}

export interface OnboardingDraftPayload {
  existingSubmissionId?: number | null;
  formId?: number | null;
  serviceSlug?: string;
  answers?: Record<string, unknown>;
  name?: string;
  email?: string;
  mobile?: string;
  city?: string;
  serviceName?: string;
}

export interface OnboardingSubmitPayload {
  existingSubmissionId?: number | null;
  formId?: number | null;
  serviceSlug?: string;
  answers: Record<string, unknown>;
  name?: string;
  email?: string;
  mobile?: string;
  city?: string;
  serviceName?: string;
  paymentMode?: 'razorpay' | 'wallet';
  orderId?: string;
  paymentId?: string;
  transactionDate?: string;
  amount?: string | number;
}

export interface OnboardingCreateOrderPayload {
  serviceSlug: string;
  formId?: number;
  amountInPaise: number;
}

export interface OnboardingCreateOrderResponse {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
}

export interface OnboardingPricingSummary {
  serviceTitle: string;
  basePriceRupees: number;
  gstMode: 'included' | 'excluded';
  gstPercent: number;
  gstAmountRupees: number;
  totalPayableRupees: number;
  amountInPaise: number;
  professionalFeeLabel: string | null;
  professionalFeeAmount: string | null;
  governmentFeeLabel: string | null;
  governmentFeeAmount: string | null;
}
