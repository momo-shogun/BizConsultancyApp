import type {
  PublicWorkshopApiRow,
  PublicWorkshopsListMeta,
  PublicWorkshopsListResult,
} from '../types/publicWorkshopApi.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function parseWorkshopRow(raw: unknown): PublicWorkshopApiRow | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = readNumber(raw.id);
  const name = readString(raw.name);
  const slug = readString(raw.slug);
  const type = readString(raw.type);
  if (id == null || name == null || slug == null || type == null) {
    return null;
  }

  return {
    id,
    createdAt: readString(raw.createdAt) ?? '',
    updatedAt: readString(raw.updatedAt) ?? '',
    name,
    slug,
    type,
    thumbnail: readString(raw.thumbnail),
    description: readString(raw.description),
    highlightPoints: readString(raw.highlightPoints),
    keywords: readString(raw.keywords),
    startDate: readString(raw.startDate),
    endDate: readString(raw.endDate),
    startTime: readString(raw.startTime),
    endTime: readString(raw.endTime),
    place: readString(raw.place),
    mapLocation: readString(raw.mapLocation),
    contactNumber: readString(raw.contactNumber),
    segmentId: readNumber(raw.segmentId),
    industryId: readNumber(raw.industryId),
    onlineFee: raw.onlineFee as string | number | null,
    offlineFee: raw.offlineFee as string | number | null,
    isOnlineAvailable: readNumber(raw.isOnlineAvailable),
    isLiveWorkshop: readNumber(raw.isLiveWorkshop),
    externalUrlOnline: readString(raw.externalUrlOnline),
    externalUrlOffline: readString(raw.externalUrlOffline),
    workshopUrl: readString(raw.workshopUrl),
    status: readNumber(raw.status),
    createdBy: raw.createdBy ?? null,
    updatedBy: raw.updatedBy ?? null,
    deletedBy: raw.deletedBy ?? null,
    isDeleted: readNumber(raw.isDeleted),
  };
}

function parseMeta(raw: unknown): PublicWorkshopsListMeta {
  if (!isRecord(raw)) {
    return { total: 0, page: 1, limit: 0, totalPages: 0 };
  }
  return {
    total: readNumber(raw.total) ?? 0,
    page: readNumber(raw.page) ?? 1,
    limit: readNumber(raw.limit) ?? 0,
    totalPages: readNumber(raw.totalPages) ?? 0,
  };
}

function tryList(items: unknown[]): PublicWorkshopApiRow[] {
  const result: PublicWorkshopApiRow[] = [];
  for (const item of items) {
    const row = parseWorkshopRow(item);
    if (row != null) {
      result.push(row);
    }
  }
  return result;
}

export function parsePublicWorkshopDetailResponse(raw: unknown): PublicWorkshopApiRow | null {
  if (isRecord(raw) && raw.data != null) {
    return parseWorkshopRow(raw.data);
  }
  return parseWorkshopRow(raw);
}

export function parsePublicWorkshopsResponse(raw: unknown): PublicWorkshopsListResult {
  if (isRecord(raw) && Array.isArray(raw.data)) {
    return {
      items: tryList(raw.data),
      meta: parseMeta(raw.meta),
    };
  }
  if (Array.isArray(raw)) {
    const items = tryList(raw);
    return {
      items,
      meta: { total: items.length, page: 1, limit: items.length, totalPages: 1 },
    };
  }
  return {
    items: [],
    meta: { total: 0, page: 1, limit: 0, totalPages: 0 },
  };
}
