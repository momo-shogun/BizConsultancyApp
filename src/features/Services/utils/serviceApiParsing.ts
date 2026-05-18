import type {
  PublicServiceFormConfig,
  PublicServiceListItem,
  PublicServiceListMeta,
  PublicServiceListResult,
} from '../types/publicServiceApi.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
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
    if (isPublicServiceListItem(item)) {
      result.push(item);
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
  return isPublicServiceListItem(raw) ? raw : null;
}

export function parsePublicServiceFormResponse(raw: unknown): PublicServiceFormConfig | null {
  if (!isRecord(raw)) {
    return null;
  }
  const nested = raw.data ?? raw.form;
  if (isRecord(nested)) {
    return nested as PublicServiceFormConfig;
  }
  return raw as PublicServiceFormConfig;
}
