import type {
  DocumentRequirementSelectionGroup,
  MyOnboardingSubmission,
  MyOnboardingSubmissionDetail,
  MyOnboardingSubmissionFullDetail,
  OnboardingDetailRow,
  OnboardingSubmissionStatus,
  ServiceDetailAnswerInstance,
  ServiceDetailAnswerItem,
  ServiceDetailAnswerRow,
  ServiceDetailAnswerType,
  ServiceDetailFormContext,
  ServiceDetailFormDeclarationItem,
  ServiceDetailFormQuestion,
  ServiceDetailFormSection,
  ServiceDetailFormSectionKind,
  ServiceDetailFormStep,
  ServiceDetailFormStepKind,
  SubmissionDocumentRequirementItem,
  SubmissionDocumentRequirements,
  SubmissionDocumentRow,
  SummaryAggregateConfig,
  SummaryColumnConfig,
  SummarySectionConfig,
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

const VALID_ANSWER_TYPES: readonly ServiceDetailAnswerType[] = [
  'text',
  'number',
  'checkbox',
  'radio',
  'multiinput',
  'upload',
  'location',
];

const VALID_STEP_KINDS: readonly ServiceDetailFormStepKind[] = ['fields', 'declaration'];

function parseStatus(raw: unknown): OnboardingSubmissionStatus | null {
  if (typeof raw !== 'string') {
    return null;
  }
  const normalized = raw.trim().toLowerCase() as OnboardingSubmissionStatus;
  return VALID_STATUSES.includes(normalized) ? normalized : null;
}

function parseAnswerType(raw: unknown): ServiceDetailAnswerType {
  if (typeof raw === 'string' && VALID_ANSWER_TYPES.includes(raw as ServiceDetailAnswerType)) {
    return raw as ServiceDetailAnswerType;
  }
  return 'text';
}

function parseStepKind(raw: unknown): ServiceDetailFormStepKind | null {
  if (typeof raw !== 'string') {
    return null;
  }
  const kind = raw.trim().toLowerCase() as ServiceDetailFormStepKind;
  return VALID_STEP_KINDS.includes(kind) ? kind : null;
}

function parseAcceptedJson(raw: unknown): Record<string, boolean> | null {
  if (!isRecord(raw)) {
    return null;
  }
  const out: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value === true) {
      out[key] = true;
    }
  }
  return out;
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
  return {
    id,
    serviceDetailFormId: Number(raw.serviceDetailFormId) || 0,
    questionLabel:
      typeof raw.questionLabel === 'string' ? raw.questionLabel : `Question #${id}`,
    answerType: parseAnswerType(raw.answerType),
    configJson: isRecord(raw.configJson) ? raw.configJson : null,
    placeholder: typeof raw.placeholder === 'string' ? raw.placeholder : null,
    helpText: typeof raw.helpText === 'string' ? raw.helpText : null,
    columnSpan: Number(raw.columnSpan) === 4 || Number(raw.columnSpan) === 6 ? Number(raw.columnSpan) : 12,
    isRequired: Number(raw.isRequired) || 0,
    sortOrder: Number(raw.sortOrder) || 0,
  };
}

function parseSummaryConfig(raw: unknown): SummarySectionConfig | null {
  if (!isRecord(raw)) {
    return null;
  }
  const sourceStepId = Number(raw.sourceStepId);
  if (!Number.isFinite(sourceStepId) || sourceStepId <= 0) {
    return null;
  }
  const columnsRaw = Array.isArray(raw.columns) ? raw.columns : [];
  const columns: SummaryColumnConfig[] = [];
  for (const colRaw of columnsRaw) {
    if (!isRecord(colRaw)) {
      continue;
    }
    const questionId = Number(colRaw.questionId);
    const headerLabel =
      typeof colRaw.headerLabel === 'string' ? colRaw.headerLabel.trim() : '';
    if (!Number.isFinite(questionId) || questionId <= 0 || headerLabel.length === 0) {
      continue;
    }
    columns.push({
      questionKey:
        typeof colRaw.questionKey === 'string' && colRaw.questionKey.trim().length > 0
          ? colRaw.questionKey.trim()
          : `id:${questionId}`,
      questionId,
      headerLabel,
    });
  }
  if (columns.length === 0) {
    return null;
  }

  const actionLabel =
    typeof raw.actionLabel === 'string' && raw.actionLabel.trim().length > 0
      ? raw.actionLabel.trim()
      : null;

  let aggregate: SummaryAggregateConfig | null = null;
  if (isRecord(raw.aggregate)) {
    const questionId = Number(raw.aggregate.questionId);
    const equals = Number(raw.aggregate.equals);
    if (Number.isFinite(questionId) && questionId > 0 && Number.isFinite(equals)) {
      aggregate = {
        questionKey:
          typeof raw.aggregate.questionKey === 'string' &&
          raw.aggregate.questionKey.trim().length > 0
            ? raw.aggregate.questionKey.trim()
            : `id:${questionId}`,
        questionId,
        operator: 'sum',
        equals,
      };
    }
  }

  return {
    sourceStepKey:
      typeof raw.sourceStepKey === 'string' && raw.sourceStepKey.trim().length > 0
        ? raw.sourceStepKey.trim()
        : `id:${sourceStepId}`,
    sourceStepId,
    columns,
    actionLabel,
    aggregate,
  };
}

function parseSectionKind(raw: unknown): ServiceDetailFormSectionKind {
  return raw === 'summary' ? 'summary' : 'fields';
}

function parseServiceDetailSection(raw: unknown): ServiceDetailFormSection | null {
  if (!isRecord(raw)) {
    return null;
  }
  const kind = parseSectionKind(raw.kind);
  const questionsRaw = Array.isArray(raw.questions) ? raw.questions : [];
  const questions: ServiceDetailFormQuestion[] = [];
  for (const q of questionsRaw) {
    const parsed = parseServiceDetailQuestion(q);
    if (parsed != null) {
      questions.push(parsed);
    }
  }
  questions.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

  const configJson =
    kind === 'summary' ? parseSummaryConfig(raw.configJson) : null;

  // Summary sections intentionally have no questions; fields sections need at least one.
  if (kind === 'fields' && questions.length === 0) {
    return null;
  }
  if (kind === 'summary' && configJson == null) {
    return null;
  }

  return {
    id: Number(raw.id) || 0,
    kind,
    title: typeof raw.title === 'string' ? raw.title : 'Details',
    description: typeof raw.description === 'string' ? raw.description : null,
    sortOrder: Number(raw.sortOrder) || 0,
    letter: typeof raw.letter === 'string' ? raw.letter : 'A',
    questions: kind === 'summary' ? [] : questions,
    configJson,
  };
}

function parseDeclarationItem(raw: unknown): ServiceDetailFormDeclarationItem | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  if (!Number.isFinite(id)) {
    return null;
  }
  return {
    id,
    label: typeof raw.label === 'string' ? raw.label : `Item #${id}`,
    sortOrder: Number(raw.sortOrder) || 0,
    isRequired: Number(raw.isRequired) || 0,
  };
}

function parseServiceDetailStep(raw: unknown): ServiceDetailFormStep | null {
  if (!isRecord(raw)) {
    return null;
  }
  const kind = parseStepKind(raw.kind);
  if (kind == null) {
    return null;
  }
  const id = Number(raw.id);
  if (!Number.isFinite(id)) {
    return null;
  }

  const sectionsRaw = Array.isArray(raw.sections) ? raw.sections : [];
  const sections: ServiceDetailFormSection[] = [];
  for (const sectionRaw of sectionsRaw) {
    const parsed = parseServiceDetailSection(sectionRaw);
    if (parsed != null) {
      sections.push(parsed);
    }
  }
  sections.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

  const itemsRaw = Array.isArray(raw.declarationItems) ? raw.declarationItems : [];
  const declarationItems: ServiceDetailFormDeclarationItem[] = [];
  for (const itemRaw of itemsRaw) {
    const parsed = parseDeclarationItem(itemRaw);
    if (parsed != null) {
      declarationItems.push(parsed);
    }
  }
  declarationItems.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

  const isRepeatable =
    kind === 'fields' && Number(raw.isRepeatable) === 1 ? 1 : 0;
  const minRaw = Math.floor(Number(raw.minInstances));
  const maxRaw = Math.floor(Number(raw.maxInstances));
  const minInstances =
    isRepeatable === 1 ? Math.max(1, Number.isFinite(minRaw) ? minRaw : 1) : 1;
  const maxInstances =
    isRepeatable === 1
      ? Math.max(minInstances, Math.min(20, Number.isFinite(maxRaw) ? maxRaw : minInstances))
      : 1;

  return {
    id,
    kind,
    title: typeof raw.title === 'string' ? raw.title : kind === 'declaration' ? 'Review & declaration' : 'Details',
    description: typeof raw.description === 'string' ? raw.description : null,
    sortOrder: Number(raw.sortOrder) || 0,
    isRepeatable,
    minInstances,
    maxInstances,
    instanceLabel:
      isRepeatable === 1 && typeof raw.instanceLabel === 'string' && raw.instanceLabel.trim()
        ? raw.instanceLabel.trim()
        : null,
    addAnotherLabel:
      isRepeatable === 1 && typeof raw.addAnotherLabel === 'string' && raw.addAnotherLabel.trim()
        ? raw.addAnotherLabel.trim()
        : null,
    sections,
    declarationItems,
  };
}

function buildSyntheticSteps(
  sections: ServiceDetailFormSection[],
  questions: ServiceDetailFormQuestion[],
): ServiceDetailFormStep[] {
  const fieldSections =
    sections.length > 0
      ? sections
      : questions.length > 0
        ? [
            {
              id: 0,
              kind: 'fields' as const,
              title: 'Details',
              description: null,
              sortOrder: 0,
              letter: 'A',
              questions,
              configJson: null,
            },
          ]
        : [];

  return [
    {
      id: -1,
      kind: 'fields',
      title: 'Details',
      description: null,
      sortOrder: 0,
      isRepeatable: 0,
      minInstances: 1,
      maxInstances: 1,
      instanceLabel: null,
      addAnotherLabel: null,
      sections: fieldSections,
      declarationItems: [],
    },
    {
      id: -2,
      kind: 'declaration',
      title: 'Review & declaration',
      description: null,
      sortOrder: 1,
      isRepeatable: 0,
      minInstances: 1,
      maxInstances: 1,
      instanceLabel: null,
      addAnotherLabel: null,
      sections: [],
      declarationItems: [],
    },
  ];
}

function parseAnswerItem(raw: unknown): ServiceDetailAnswerItem | null {
  if (!isRecord(raw)) {
    return null;
  }
  const questionId = Number(raw.questionId);
  if (!Number.isFinite(questionId)) {
    return null;
  }
  return {
    questionId,
    answerText: typeof raw.answerText === 'string' ? raw.answerText : null,
    answerJson: raw.answerJson ?? null,
  };
}

function parseAnswerInstance(raw: unknown): ServiceDetailAnswerInstance | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const stepId = Number(raw.stepId);
  if (!Number.isFinite(id) || !Number.isFinite(stepId)) {
    return null;
  }
  const answersRaw = Array.isArray(raw.answers) ? raw.answers : [];
  const answers: ServiceDetailAnswerItem[] = [];
  for (const a of answersRaw) {
    const parsed = parseAnswerItem(a);
    if (parsed != null) {
      answers.push(parsed);
    }
  }
  return {
    id,
    stepId,
    instanceIndex: Number.isFinite(Number(raw.instanceIndex))
      ? Math.max(0, Math.floor(Number(raw.instanceIndex)))
      : 0,
    label: typeof raw.label === 'string' ? raw.label : null,
    answers,
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

    const sectionsRaw = Array.isArray(formRaw.sections) ? formRaw.sections : [];
    const sections: ServiceDetailFormSection[] = [];
    for (const sectionRaw of sectionsRaw) {
      const parsed = parseServiceDetailSection(sectionRaw);
      if (parsed != null) {
        sections.push(parsed);
      }
    }
    sections.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
    if (sections.length === 0 && questions.length > 0) {
      sections.push({
        id: 0,
        kind: 'fields',
        title: 'Details',
        description: null,
        sortOrder: 0,
        letter: 'A',
        questions,
        configJson: null,
      });
    }

    const stepsRaw = Array.isArray(formRaw.steps) ? formRaw.steps : [];
    const steps: ServiceDetailFormStep[] = [];
    for (const stepRaw of stepsRaw) {
      const parsed = parseServiceDetailStep(stepRaw);
      if (parsed != null) {
        steps.push(parsed);
      }
    }
    steps.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

    form = {
      id: Number(formRaw.id),
      name: typeof formRaw.name === 'string' ? formRaw.name : 'Service details',
      status: Number(formRaw.status) || 0,
      steps: steps.length > 0 ? steps : buildSyntheticSteps(sections, questions),
      sections,
      questions,
    };
  }

  const submissionRaw = isRecord(raw.submission) ? raw.submission : null;
  let submission: ServiceDetailFormContext['submission'] = null;
  if (submissionRaw != null && Number.isFinite(Number(submissionRaw.id))) {
    const answersRaw = Array.isArray(submissionRaw.answers) ? submissionRaw.answers : [];
    const answers: ServiceDetailAnswerItem[] = [];
    for (const a of answersRaw) {
      const parsed = parseAnswerItem(a);
      if (parsed != null) {
        answers.push(parsed);
      }
    }

    const instancesRaw = Array.isArray(submissionRaw.instances)
      ? submissionRaw.instances
      : [];
    const instances: ServiceDetailAnswerInstance[] = [];
    for (const inst of instancesRaw) {
      const parsed = parseAnswerInstance(inst);
      if (parsed != null) {
        instances.push(parsed);
      }
    }
    instances.sort(
      (a, b) => a.stepId - b.stepId || a.instanceIndex - b.instanceIndex || a.id - b.id,
    );

    submission = {
      id: Number(submissionRaw.id),
      status: typeof submissionRaw.status === 'string' ? submissionRaw.status : '',
      submitterName:
        typeof submissionRaw.submitterName === 'string' ? submissionRaw.submitterName : null,
      declarationDate:
        typeof submissionRaw.declarationDate === 'string'
          ? submissionRaw.declarationDate
          : null,
      declarationAcceptedJson: parseAcceptedJson(submissionRaw.declarationAcceptedJson),
      instances,
      answers,
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
    const selectionsRaw = Array.isArray(item.selections) ? item.selections : [];
    const selections: DocumentRequirementSelectionGroup[] = [];
    for (const sel of selectionsRaw) {
      if (!isRecord(sel)) {
        continue;
      }
      const answerInstanceId =
        sel.answerInstanceId != null && Number.isFinite(Number(sel.answerInstanceId))
          ? Number(sel.answerInstanceId)
          : null;
      const userDocumentIds = Array.isArray(sel.userDocumentIds)
        ? sel.userDocumentIds.map(Number).filter(Number.isFinite)
        : [];
      selections.push({ answerInstanceId, userDocumentIds });
    }
    const selectedUserDocumentIds = Array.isArray(item.selectedUserDocumentIds)
      ? item.selectedUserDocumentIds.map(Number).filter(Number.isFinite)
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
      selectedUserDocumentIds,
      selections:
        selections.length > 0
          ? selections
          : selectedUserDocumentIds.length > 0
            ? [{ answerInstanceId: null, userDocumentIds: selectedUserDocumentIds }]
            : [],
    });
  }
  return {
    onboardingSubmissionId,
    serviceId: raw.serviceId != null ? Number(raw.serviceId) : null,
    items,
  };
}
