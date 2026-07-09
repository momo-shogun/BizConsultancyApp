import type {
  OnboardingForm,
  OnboardingFormConfigResponse,
  OnboardingFormQuestion,
  OnboardingQuestionOption,
  OnboardingQuestionType,
} from '../types/serviceOnboarding.types';
import type {
  PublicServiceListItem,
  PublicServiceListMeta,
  PublicServiceListResult,
} from '../types/publicServiceApi.types';

const ONBOARDING_QUESTION_TYPES: readonly OnboardingQuestionType[] = [
  'text',
  'textarea',
  'number',
  'email',
  'phone',
  'radio',
  'select',
  'checkbox',
  'file',
];

function parseQuestionType(raw: unknown): OnboardingQuestionType {
  const value = typeof raw === 'string' ? raw.trim().toLowerCase() : 'text';
  if (ONBOARDING_QUESTION_TYPES.includes(value as OnboardingQuestionType)) {
    return value as OnboardingQuestionType;
  }
  return 'text';
}

function parseOnboardingOption(raw: unknown): OnboardingQuestionOption | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  if (!Number.isFinite(id)) {
    return null;
  }
  const label = typeof raw.label === 'string' ? raw.label.trim() : '';
  const value = typeof raw.value === 'string' ? raw.value : String(raw.value ?? label);
  return {
    id,
    label: label.length > 0 ? label : value,
    value,
    order: typeof raw.order === 'number' ? raw.order : 0,
  };
}

export function parseOnboardingQuestion(raw: unknown): OnboardingFormQuestion | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const formId = Number(raw.formId);
  if (!Number.isFinite(id) || !Number.isFinite(formId)) {
    return null;
  }
  const question = typeof raw.question === 'string' ? raw.question.trim() : '';
  if (question.length === 0) {
    return null;
  }
  const optionsRaw = Array.isArray(raw.options) ? raw.options : [];
  const options: OnboardingQuestionOption[] = [];
  for (const row of optionsRaw) {
    const opt = parseOnboardingOption(row);
    if (opt != null) {
      options.push(opt);
    }
  }
  options.sort((a, b) => a.order - b.order || a.id - b.id);

  return {
    id,
    formId,
    question,
    type: parseQuestionType(raw.type),
    placeholder:
      typeof raw.placeholder === 'string' ? raw.placeholder.trim() || null : null,
    required: raw.required === true || raw.required === 1,
    order: typeof raw.order === 'number' ? raw.order : 0,
    step: typeof raw.step === 'number' && raw.step > 0 ? raw.step : 1,
    options,
  };
}

function parseOnboardingForm(raw: unknown): OnboardingForm | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const serviceId = Number(raw.serviceId);
  if (!Number.isFinite(id)) {
    return null;
  }
  const questionsRaw = Array.isArray(raw.questions) ? raw.questions : [];
  const questions: OnboardingFormQuestion[] = [];
  for (const row of questionsRaw) {
    const q = parseOnboardingQuestion(row);
    if (q != null) {
      questions.push(q);
    }
  }
  questions.sort((a, b) => a.order - b.order || a.id - b.id);

  return {
    id,
    serviceId: Number.isFinite(serviceId) ? serviceId : 0,
    serviceSlug: typeof raw.serviceSlug === 'string' ? raw.serviceSlug.trim() : null,
    name: typeof raw.name === 'string' ? raw.name.trim() : 'Onboarding',
    isDefault: raw.isDefault === true || raw.isDefault === 1,
    status: typeof raw.status === 'string' ? raw.status : 'active',
    questions,
  };
}

export function parseOnboardingFormConfigResponse(
  raw: unknown,
): OnboardingFormConfigResponse | null {
  if (!isRecord(raw)) {
    return null;
  }
  const nested = raw.form ?? raw.data;
  const form = parseOnboardingForm(isRecord(nested) ? nested : raw);
  if (form == null) {
    return null;
  }
  const formsRaw = Array.isArray(raw.forms) ? raw.forms : [form];
  const forms: OnboardingForm[] = [];
  for (const row of formsRaw) {
    const parsed = parseOnboardingForm(row);
    if (parsed != null) {
      forms.push(parsed);
    }
  }
  if (forms.length === 0) {
    forms.push(form);
  }
  return { form, forms };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function isPublicServiceRecordActive(raw: unknown): boolean {
  if (!isRecord(raw)) {
    return false;
  }
  const isDeleted = readNumber(raw.isDeleted) ?? 0;
  if (isDeleted !== 0) {
    return false;
  }
  const status = readNumber(raw.status);
  if (status == null) {
    return true;
  }
  return status === 1;
}

function readServiceStatusFields(raw: Record<string, unknown>): Pick<PublicServiceListItem, 'status' | 'isDeleted'> {
  const status = readNumber(raw.status);
  const isDeleted = readNumber(raw.isDeleted);
  return {
    ...(status != null ? { status } : {}),
    ...(isDeleted != null ? { isDeleted } : {}),
  };
}

function isPublicServiceListItem(value: unknown): value is PublicServiceListItem {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.id === 'number' &&
    typeof value.slug === 'string' &&
    typeof value.title === 'string' &&
    isRecord(value.category) &&
    typeof value.category.id === 'number' &&
    typeof value.category.name === 'string'
  );
}

function parseMeta(raw: unknown): PublicServiceListMeta {
  if (!isRecord(raw)) {
    return { total: 0, page: 1, limit: 0, totalPages: 0 };
  }
  return {
    total: typeof raw.total === 'number' ? raw.total : 0,
    page: typeof raw.page === 'number' ? raw.page : 1,
    limit: typeof raw.limit === 'number' ? raw.limit : 0,
    totalPages: typeof raw.totalPages === 'number' ? raw.totalPages : 0,
  };
}

function tryList(items: unknown[]): PublicServiceListItem[] {
  const result: PublicServiceListItem[] = [];
  for (const item of items) {
    if (!isPublicServiceRecordActive(item)) {
      continue;
    }
    if (isPublicServiceListItem(item)) {
      result.push({
        ...item,
        ...readServiceStatusFields(item),
      });
    }
  }
  return result;
}

export function parsePublicServicesResponse(raw: unknown): PublicServiceListResult {
  if (isRecord(raw) && Array.isArray(raw.data)) {
    return {
      items: tryList(raw.data),
      meta: parseMeta(raw.meta),
    };
  }
  if (Array.isArray(raw)) {
    return {
      items: tryList(raw),
      meta: { total: raw.length, page: 1, limit: raw.length, totalPages: 1 },
    };
  }
  if (isRecord(raw)) {
    for (const key of ['data', 'services', 'items', 'results'] as const) {
      const nested = raw[key];
      if (Array.isArray(nested)) {
        const items = tryList(nested);
        return {
          items,
          meta: parseMeta(raw.meta ?? raw.pagination),
        };
      }
    }
  }
  return {
    items: [],
    meta: { total: 0, page: 1, limit: 0, totalPages: 0 },
  };
}

function normalizeListItemFromPage(raw: Record<string, unknown>): PublicServiceListItem | null {
  const categoryRaw = raw.category ?? raw.serviceCategory;
  const subCategoryRaw = raw.subCategory ?? raw.serviceSubCategory;

  if (typeof raw.id !== 'number' || typeof raw.slug !== 'string' || typeof raw.title !== 'string') {
    return null;
  }

  const category = isRecord(categoryRaw) &&
  typeof categoryRaw.id === 'number' &&
  typeof categoryRaw.name === 'string'
    ? {
        id: categoryRaw.id,
        name: categoryRaw.name,
        slug: typeof categoryRaw.slug === 'string' ? categoryRaw.slug : null,
      }
    : { id: 0, name: 'Services' };

  const subCategory =
    isRecord(subCategoryRaw) && typeof subCategoryRaw.name === 'string'
      ? {
          id: typeof subCategoryRaw.id === 'number' ? subCategoryRaw.id : 0,
          name: subCategoryRaw.name,
          slug: typeof subCategoryRaw.slug === 'string' ? subCategoryRaw.slug : null,
        }
      : null;

  const price =
    typeof raw.price === 'string' || typeof raw.price === 'number'
      ? String(raw.price)
      : null;

  if (!isPublicServiceRecordActive(raw)) {
    return null;
  }

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    serviceIcon: typeof raw.serviceIcon === 'string' ? raw.serviceIcon : null,
    price,
    isGstIncluded: typeof raw.isGstIncluded === 'string' ? raw.isGstIncluded : undefined,
    gstPercent:
      raw.gstPercent != null ? String(raw.gstPercent) : null,
    metadata: isRecord(raw.metadata)
      ? {
          title: typeof raw.metadata.title === 'string' ? raw.metadata.title : undefined,
          description:
            typeof raw.metadata.description === 'string' ? raw.metadata.description : undefined,
        }
      : null,
    hero: raw.hero,
    about: raw.about,
    featurepoint: Array.isArray(raw.featurepoint)
      ? raw.featurepoint.filter((p): p is string => typeof p === 'string')
      : null,
    position: typeof raw.position === 'number' ? raw.position : undefined,
    ...readServiceStatusFields(raw),
    category,
    subCategory,
  };
}

/** Unwraps GET public/service-pages/{slug} body (page object at root or under data). */
export function unwrapPublicServicePageRecord(raw: unknown): Record<string, unknown> | null {
  if (!isRecord(raw)) {
    return null;
  }
  const nested = raw.data ?? raw.service ?? raw.servicePage;
  if (isRecord(nested)) {
    return nested;
  }
  if (typeof raw.id === 'number' && typeof raw.slug === 'string') {
    return raw;
  }
  return null;
}

export function parsePublicServicePageResponse(raw: unknown): PublicServiceListItem | null {
  const page = unwrapPublicServicePageRecord(raw);
  if (page != null) {
    return normalizeListItemFromPage(page);
  }
  if (!isPublicServiceRecordActive(raw)) {
    return null;
  }
  return isPublicServiceListItem(raw) ? raw : null;
}

export function parsePublicServiceFormResponse(
  raw: unknown,
): OnboardingFormConfigResponse | null {
  return parseOnboardingFormConfigResponse(raw);
}
