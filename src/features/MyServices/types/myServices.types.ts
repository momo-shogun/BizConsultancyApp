export type OnboardingSubmissionStatus =
  | 'enrolled'
  | 'in_progress'
  | 'completed'
  | 'applied';

export interface MyOnboardingSubmission {
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
  status: OnboardingSubmissionStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface MyOnboardingSubmissionDetail extends MyOnboardingSubmission {
  answers: Record<string, unknown>;
}

export interface OnboardingDetailRow {
  questionId: number;
  question: string;
  type: string;
  step: number;
  order: number;
  answer: unknown;
}

export interface ServiceDetailAnswerRow {
  questionId: number;
  questionLabel: string;
  answerType: string;
  value: unknown;
}

export interface SubmissionDocumentRow {
  selectionId: number;
  requirementDocumentType: string;
  isRequired: number | null;
  userFileDocumentType: string;
  documentUrl: string | null;
  originalFilename: string | null;
  mimeType: string | null;
  fileSize: string | null;
}

export interface MyOnboardingSubmissionFullDetail {
  submission: MyOnboardingSubmission;
  resolvedServiceSlug: string | null;
  servicePage: { id: number; slug: string; title: string } | null;
  onboarding: {
    form: { id: number; name: string } | null;
    rows: OnboardingDetailRow[];
  };
  serviceDetails: {
    submission: {
      id: number;
      status: string;
      userId: number;
      userType: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    formName: string | null;
    answers: ServiceDetailAnswerRow[];
  } | null;
  documents: SubmissionDocumentRow[];
}

export type MyServicesFilterTab = 'all' | 'action' | 'active' | 'completed' | 'other';

export type ServiceDetailAnswerType =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'radio'
  | 'multiinput'
  | 'upload';

export type ServiceDetailFormStepKind = 'fields' | 'declaration';

export interface ServiceDetailFormQuestion {
  id: number;
  serviceDetailFormId: number;
  questionLabel: string;
  answerType: ServiceDetailAnswerType;
  configJson: Record<string, unknown> | null;
  placeholder: string | null;
  helpText: string | null;
  columnSpan: number;
  isRequired: number;
  sortOrder: number;
}

export interface ServiceDetailFormSection {
  id: number;
  title: string;
  description: string | null;
  sortOrder: number;
  letter: string;
  questions: ServiceDetailFormQuestion[];
}

export interface ServiceDetailFormDeclarationItem {
  id: number;
  label: string;
  sortOrder: number;
  isRequired: number;
}

export interface ServiceDetailFormStep {
  id: number;
  kind: ServiceDetailFormStepKind;
  title: string;
  description: string | null;
  sortOrder: number;
  isRepeatable: number;
  minInstances: number;
  maxInstances: number;
  instanceLabel: string | null;
  addAnotherLabel: string | null;
  sections: ServiceDetailFormSection[];
  declarationItems: ServiceDetailFormDeclarationItem[];
}

export interface ServiceDetailAnswerItem {
  questionId: number;
  answerText: string | null;
  answerJson: unknown;
}

export interface ServiceDetailAnswerInstance {
  id: number;
  stepId: number;
  instanceIndex: number;
  label: string | null;
  answers: ServiceDetailAnswerItem[];
}

export interface ServiceDetailInstancePayload {
  stepId: number;
  instanceIndex: number;
  label?: string | null;
  answers: Array<{
    questionId: number;
    answerText?: string | null;
    answerJson?: unknown;
  }>;
}

export interface ServiceDetailFormContext {
  onboardingSubmissionId: number;
  servicePage: { id: number; title: string; slug: string } | null;
  form: {
    id: number;
    name: string;
    status: number;
    steps: ServiceDetailFormStep[];
    sections: ServiceDetailFormSection[];
    questions: ServiceDetailFormQuestion[];
  } | null;
  submission: {
    id: number;
    status: string;
    submitterName: string | null;
    declarationDate: string | null;
    declarationAcceptedJson: Record<string, boolean> | null;
    instances: ServiceDetailAnswerInstance[];
    answers: ServiceDetailAnswerItem[];
  } | null;
}

export interface ServiceDetailDeclarationPayload {
  submitterName: string;
  declarationDate: string;
  acceptedItemIds: number[];
}

export interface VaultDocumentOption {
  id: number;
  documentUrl: string;
  originalFilename: string | null;
  mimeType: string | null;
  createdAt: string;
}

export interface DocumentRequirementSelectionGroup {
  answerInstanceId: number | null;
  userDocumentIds: number[];
}

export interface SubmissionDocumentRequirementItem {
  serviceDocumentId: number;
  documentTypeId: number;
  documentTypeName: string | null;
  isRequired: number;
  status: number;
  sortOrder: number | null;
  availableDocuments: VaultDocumentOption[];
  selectedUserDocumentIds: number[];
  selections: DocumentRequirementSelectionGroup[];
}

export interface SubmissionDocumentRequirements {
  onboardingSubmissionId: number;
  serviceId: number | null;
  items: SubmissionDocumentRequirementItem[];
}

export interface SubmissionDocumentSelectionItem {
  serviceDocumentId: number;
  userDocumentIds: number[];
  answerInstanceId?: number | null;
}

export interface MyServiceCardModel {
  item: MyOnboardingSubmission;
  showContinue: boolean;
  showApply: boolean;
  isContinueLoading: boolean;
}

export interface ApplyInstanceDraft {
  /** Stable local key until server assigns `id` (used for draft selection keys). */
  clientKey: string;
  id: number | null;
  stepId: number;
  instanceIndex: number;
  label: string | null;
  detailAnswers: Record<number, { answerText?: string; answerJson?: unknown }>;
  multiInputs: Record<number, string[]>;
}
