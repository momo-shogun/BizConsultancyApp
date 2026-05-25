import type {
  MyOnboardingSubmission,
  MyOnboardingSubmissionDetail,
  MyOnboardingSubmissionFullDetail,
  OnboardingDetailRow,
  OnboardingSubmissionStatus,
  ServiceDetailAnswerRow,
  ServiceDetailFormContext,
  ServiceDetailFormQuestion,
  SubmissionDocumentRequirementItem,
  SubmissionDocumentRequirements,
  SubmissionDocumentRow,
  VaultDocumentOption,
} from '../types/myServices.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

const VALID_STATUSES: readonly OnboardingSubmissionStatus[] = [
  'enrolled',
  'in_progress',
  'completed',
  'applied',
];

function parseStatus(raw: unknown): OnboardingSubmissionStatus | null {
  if (typeof raw !== 'string') {
    return null;
  }
  const normalized = raw.trim().toLowerCase() as OnboardingSubmissionStatus;
  return VALID_STATUSES.includes(normalized) ? normalized : null;
}

export function parseMyOnboardingSubmission(raw: unknown): MyOnboardingSubmission | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  if (!Number.isFinite(id)) {
    return null;
  }
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt;

  return {
    id,
    userId: raw.userId != null ? Number(raw.userId) : null,
    userType: typeof raw.userType === 'string' ? raw.userType : null,
    formId: raw.formId != null ? Number(raw.formId) : null,
    serviceSlug: typeof raw.serviceSlug === 'string' ? raw.serviceSlug : null,
    serviceName: typeof raw.serviceName === 'string' ? raw.serviceName : null,
    name: typeof raw.name === 'string' ? raw.name : null,
    email: typeof raw.email === 'string' ? raw.email : null,
    mobile: typeof raw.mobile === 'string' ? raw.mobile : null,
    city: typeof raw.city === 'string' ? raw.city : null,
    paymentMode: typeof raw.paymentMode === 'string' ? raw.paymentMode : null,
    orderId: typeof raw.orderId === 'string' ? raw.orderId : null,
    paymentId: typeof raw.paymentId === 'string' ? raw.paymentId : null,
    transactionDate:
      typeof raw.transactionDate === 'string' ? raw.transactionDate : null,
    amount: raw.amount != null ? String(raw.amount) : null,
    status: parseStatus(raw.status),
    createdAt,
    updatedAt,
  };
}

export function parseMyOnboardingSubmissionList(raw: unknown): MyOnboardingSubmission[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const result: MyOnboardingSubmission[] = [];
  for (const row of raw) {
    const parsed = parseMyOnboardingSubmission(row);
    if (parsed != null) {
      result.push(parsed);
    }
  }
  return result.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function parseMyOnboardingSubmissionDetail(raw: unknown): MyOnboardingSubmissionDetail | null {
  const base = parseMyOnboardingSubmission(raw);
  if (base == null || !isRecord(raw)) {
    return null;
  }
  const answers =
    raw.answers != null && typeof raw.answers === 'object' && !Array.isArray(raw.answers)
      ? (raw.answers as Record<string, unknown>)
      : {};
  return { ...base, answers };
}

function parseOnboardingRow(raw: unknown): OnboardingDetailRow | null {
  if (!isRecord(raw)) {
    return null;
  }
  const questionId = Number(raw.questionId);
  if (!Number.isFinite(questionId)) {
    return null;
  }
  return {
    questionId,
    question: typeof raw.question === 'string' ? raw.question : `Question #${questionId}`,
    type: typeof raw.type === 'string' ? raw.type : 'text',
    step: Number(raw.step) || 0,
    order: Number(raw.order) || 0,
    answer: raw.answer ?? null,
  };
}

function parseServiceDetailAnswer(raw: unknown): ServiceDetailAnswerRow | null {
  if (!isRecord(raw)) {
    return null;
  }
  const questionId = Number(raw.questionId);
  if (!Number.isFinite(questionId)) {
    return null;
  }
  return {
    questionId,
    questionLabel:
      typeof raw.questionLabel === 'string' ? raw.questionLabel : `Question #${questionId}`,
    answerType: typeof raw.answerType === 'string' ? raw.answerType : 'text',
    value: raw.value ?? raw.answerJson ?? raw.answerText ?? null,
  };
}

function parseDocumentRow(raw: unknown): SubmissionDocumentRow | null {
  if (!isRecord(raw)) {
    return null;
  }
  const selectionId = Number(raw.selectionId);
  if (!Number.isFinite(selectionId)) {
    return null;
  }
  return {
    selectionId,
    requirementDocumentType:
      typeof raw.requirementDocumentType === 'string'
        ? raw.requirementDocumentType
        : '—',
    isRequired: raw.isRequired != null ? Number(raw.isRequired) : null,
    userFileDocumentType:
      typeof raw.userFileDocumentType === 'string' ? raw.userFileDocumentType : '—',
    documentUrl: typeof raw.documentUrl === 'string' ? raw.documentUrl : null,
    originalFilename:
      typeof raw.originalFilename === 'string' ? raw.originalFilename : null,
    mimeType: typeof raw.mimeType === 'string' ? raw.mimeType : null,
    fileSize: raw.fileSize != null ? String(raw.fileSize) : null,
  };
}

export function parseMyOnboardingSubmissionFullDetail(
  raw: unknown,
): MyOnboardingSubmissionFullDetail | null {
  if (!isRecord(raw)) {
    return null;
  }
  const submission = parseMyOnboardingSubmission(raw.submission ?? raw);
  if (submission == null) {
    return null;
  }

  const onboardingRaw = isRecord(raw.onboarding) ? raw.onboarding : {};
  const rowsRaw = Array.isArray(onboardingRaw.rows) ? onboardingRaw.rows : [];
  const rows: OnboardingDetailRow[] = [];
  for (const row of rowsRaw) {
    const parsed = parseOnboardingRow(row);
    if (parsed != null) {
      rows.push(parsed);
    }
  }

  const serviceDetailsRaw = isRecord(raw.serviceDetails) ? raw.serviceDetails : null;
  let serviceDetails: MyOnboardingSubmissionFullDetail['serviceDetails'] = null;
  if (serviceDetailsRaw != null) {
    const answersRaw = Array.isArray(serviceDetailsRaw.answers)
      ? serviceDetailsRaw.answers
      : [];
    const answers: ServiceDetailAnswerRow[] = [];
    for (const a of answersRaw) {
      const parsed = parseServiceDetailAnswer(a);
      if (parsed != null) {
        answers.push(parsed);
      }
    }
    const subRaw = isRecord(serviceDetailsRaw.submission)
      ? serviceDetailsRaw.submission
      : null;
    serviceDetails = {
      submission:
        subRaw != null && Number.isFinite(Number(subRaw.id))
          ? {
              id: Number(subRaw.id),
              status: typeof subRaw.status === 'string' ? subRaw.status : '',
              userId: Number(subRaw.userId) || 0,
              userType: typeof subRaw.userType === 'string' ? subRaw.userType : 'user',
              createdAt:
                typeof subRaw.createdAt === 'string' ? subRaw.createdAt : submission.createdAt,
              updatedAt:
                typeof subRaw.updatedAt === 'string' ? subRaw.updatedAt : submission.updatedAt,
            }
          : null,
      formName:
        typeof serviceDetailsRaw.formName === 'string' ? serviceDetailsRaw.formName : null,
      answers,
    };
  }

  const documentsRaw = Array.isArray(raw.documents) ? raw.documents : [];
  const documents: SubmissionDocumentRow[] = [];
  for (const doc of documentsRaw) {
    const parsed = parseDocumentRow(doc);
    if (parsed != null) {
      documents.push(parsed);
    }
  }

  const servicePageRaw = isRecord(raw.servicePage) ? raw.servicePage : null;

  return {
    submission,
    resolvedServiceSlug:
      typeof raw.resolvedServiceSlug === 'string' ? raw.resolvedServiceSlug : submission.serviceSlug,
    servicePage:
      servicePageRaw != null &&
      Number.isFinite(Number(servicePageRaw.id)) &&
      typeof servicePageRaw.slug === 'string'
        ? {
            id: Number(servicePageRaw.id),
            slug: servicePageRaw.slug,
            title:
              typeof servicePageRaw.title === 'string'
                ? servicePageRaw.title
                : submission.serviceName ?? servicePageRaw.slug,
          }
        : null,
    onboarding: {
      form:
        isRecord(onboardingRaw.form) && Number.isFinite(Number(onboardingRaw.form.id))
          ? {
              id: Number(onboardingRaw.form.id),
              name:
                typeof onboardingRaw.form.name === 'string'
                  ? onboardingRaw.form.name
                  : 'Onboarding Form',
            }
          : null,
      rows,
    },
    serviceDetails,
    documents,
  };
}

function parseServiceDetailQuestion(raw: unknown): ServiceDetailFormQuestion | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  if (!Number.isFinite(id)) {
    return null;
  }
  const answerType = typeof raw.answerType === 'string' ? raw.answerType : 'text';
  return {
    id,
    serviceDetailFormId: Number(raw.serviceDetailFormId) || 0,
    questionLabel:
      typeof raw.questionLabel === 'string' ? raw.questionLabel : `Question #${id}`,
    answerType: answerType as ServiceDetailFormQuestion['answerType'],
    configJson: isRecord(raw.configJson) ? raw.configJson : null,
    placeholder: typeof raw.placeholder === 'string' ? raw.placeholder : null,
    isRequired: Number(raw.isRequired) || 0,
    sortOrder: Number(raw.sortOrder) || 0,
  };
}

export function parseServiceDetailFormContext(raw: unknown): ServiceDetailFormContext | null {
  if (!isRecord(raw)) {
    return null;
  }
  const onboardingSubmissionId = Number(raw.onboardingSubmissionId);
  if (!Number.isFinite(onboardingSubmissionId)) {
    return null;
  }

  const formRaw = isRecord(raw.form) ? raw.form : null;
  let form: ServiceDetailFormContext['form'] = null;
  if (formRaw != null && Number.isFinite(Number(formRaw.id))) {
    const questionsRaw = Array.isArray(formRaw.questions) ? formRaw.questions : [];
    const questions: ServiceDetailFormQuestion[] = [];
    for (const q of questionsRaw) {
      const parsed = parseServiceDetailQuestion(q);
      if (parsed != null) {
        questions.push(parsed);
      }
    }
    questions.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
    form = {
      id: Number(formRaw.id),
      name: typeof formRaw.name === 'string' ? formRaw.name : 'Service details',
      status: Number(formRaw.status) || 0,
      questions,
    };
  }

  const submissionRaw = isRecord(raw.submission) ? raw.submission : null;
  let submission: ServiceDetailFormContext['submission'] = null;
  if (submissionRaw != null && Number.isFinite(Number(submissionRaw.id))) {
    const answersRaw = Array.isArray(submissionRaw.answers) ? submissionRaw.answers : [];
    submission = {
      id: Number(submissionRaw.id),
      status: typeof submissionRaw.status === 'string' ? submissionRaw.status : '',
      answers: answersRaw
        .filter(isRecord)
        .map((a) => ({
          questionId: Number(a.questionId),
          answerText: typeof a.answerText === 'string' ? a.answerText : null,
          answerJson: a.answerJson ?? null,
        }))
        .filter((a) => Number.isFinite(a.questionId)),
    };
  }

  const pageRaw = isRecord(raw.servicePage) ? raw.servicePage : null;

  return {
    onboardingSubmissionId,
    servicePage:
      pageRaw != null &&
      typeof pageRaw.slug === 'string' &&
      Number.isFinite(Number(pageRaw.id))
        ? {
            id: Number(pageRaw.id),
            title: typeof pageRaw.title === 'string' ? pageRaw.title : pageRaw.slug,
            slug: pageRaw.slug,
          }
        : null,
    form,
    submission,
  };
}

export function parseVaultDocumentOption(raw: unknown): VaultDocumentOption | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const documentUrl = typeof raw.documentUrl === 'string' ? raw.documentUrl : '';
  if (!Number.isFinite(id) || documentUrl.length === 0) {
    return null;
  }
  return {
    id,
    documentUrl,
    originalFilename:
      typeof raw.originalFilename === 'string' ? raw.originalFilename : null,
    mimeType: typeof raw.mimeType === 'string' ? raw.mimeType : null,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : '',
  };
}

export function parseSubmissionDocumentRequirements(
  raw: unknown,
): SubmissionDocumentRequirements | null {
  if (!isRecord(raw)) {
    return null;
  }
  const onboardingSubmissionId = Number(raw.onboardingSubmissionId);
  if (!Number.isFinite(onboardingSubmissionId)) {
    return null;
  }
  const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
  const items: SubmissionDocumentRequirementItem[] = [];
  for (const item of itemsRaw) {
    if (!isRecord(item)) {
      continue;
    }
    const serviceDocumentId = Number(item.serviceDocumentId);
    if (!Number.isFinite(serviceDocumentId)) {
      continue;
    }
    const availableRaw = Array.isArray(item.availableDocuments)
      ? item.availableDocuments
      : [];
    items.push({
      serviceDocumentId,
      documentTypeId: Number(item.documentTypeId) || 0,
      documentTypeName:
        typeof item.documentTypeName === 'string' ? item.documentTypeName : null,
      isRequired: Number(item.isRequired) || 0,
      status: Number(item.status) || 0,
      sortOrder: item.sortOrder != null ? Number(item.sortOrder) : null,
      availableDocuments: availableRaw
        .filter(isRecord)
        .map((doc) => ({
          id: Number(doc.id),
          documentUrl: typeof doc.documentUrl === 'string' ? doc.documentUrl : '',
          originalFilename:
            typeof doc.originalFilename === 'string' ? doc.originalFilename : null,
          mimeType: typeof doc.mimeType === 'string' ? doc.mimeType : null,
          createdAt: typeof doc.createdAt === 'string' ? doc.createdAt : '',
        }))
        .filter((doc) => Number.isFinite(doc.id) && doc.documentUrl.length > 0),
      selectedUserDocumentIds: Array.isArray(item.selectedUserDocumentIds)
        ? item.selectedUserDocumentIds.map(Number).filter(Number.isFinite)
        : [],
    });
  }
  return {
    onboardingSubmissionId,
    serviceId: raw.serviceId != null ? Number(raw.serviceId) : null,
    items,
  };
}
