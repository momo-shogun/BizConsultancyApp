import type { ConsultantDetail } from '../types/consultantDetail.types';
import type {
  AvailableSlot,
  AvailableSlotsResponse,
  PublicConsultantsPageResult,
} from '../types/consultantApi.types';
import { normalizePublicConsultant } from './consultantMappers';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function parseSingleConsultantResponse(raw: unknown): ConsultantDetail | null {
  if (!isRecord(raw)) {
    return normalizePublicConsultant(raw);
  }
  const nested = raw.data ?? raw.consultant;
  return normalizePublicConsultant(nested ?? raw);
}

export function parsePublicConsultantsResponse(raw: unknown): ConsultantDetail[] {
  const tryList = (items: unknown[]): ConsultantDetail[] => {
    const result: ConsultantDetail[] = [];
    for (const item of items) {
      const detail = normalizePublicConsultant(item);
      if (detail != null) {
        result.push(detail);
      }
    }
    return result;
  };

  if (Array.isArray(raw)) {
    return tryList(raw);
  }
  if (!isRecord(raw)) {
    return [];
  }
  const keys = ['data', 'consultants', 'items', 'results'] as const;
  for (const key of keys) {
    const nested = raw[key];
    if (Array.isArray(nested)) {
      return tryList(nested);
    }
  }
  return [];
}

export interface ParsePublicConsultantsPageMeta {
  page: number;
  limit: number;
}

function readNestedTotal(raw: Record<string, unknown>): number | undefined {
  const meta = raw.meta;
  const candidates = [raw.total, raw.totalCount, raw.count];
  if (isRecord(meta)) {
    candidates.push(meta.total, meta.totalCount);
  }
  for (const value of candidates) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}

function readHasMoreFromMeta(
  raw: Record<string, unknown>,
  page: number,
  limit: number,
  itemCount: number,
): boolean | undefined {
  if (typeof raw.hasNextPage === 'boolean') {
    return raw.hasNextPage;
  }
  if (typeof raw.hasMore === 'boolean') {
    return raw.hasMore;
  }
  const nextPage = raw.nextPage;
  if (typeof nextPage === 'boolean') {
    return nextPage;
  }
  if (typeof nextPage === 'number') {
    return nextPage > page;
  }
  const totalPages = raw.totalPages ?? raw.lastPage;
  if (typeof totalPages === 'number') {
    return page < totalPages;
  }
  const total = readNestedTotal(raw);
  if (total != null) {
    return page * limit < total;
  }
  if (itemCount >= limit) {
    return true;
  }
  return false;
}

export function parsePublicConsultantsPageResponse(
  raw: unknown,
  meta: ParsePublicConsultantsPageMeta,
): PublicConsultantsPageResult {
  const page = meta.page;
  const limit = meta.limit;
  const items = parsePublicConsultantsResponse(raw);
  const total = isRecord(raw) ? readNestedTotal(raw) : undefined;
  const hasMore = isRecord(raw)
    ? (readHasMoreFromMeta(raw, page, limit, items.length) ?? items.length >= limit)
    : items.length >= limit;

  return {
    items,
    page,
    limit,
    hasMore,
    total,
  };
}

function isAvailableSlot(value: unknown): value is AvailableSlot {
  if (!isRecord(value)) {
    return false;
  }
  return typeof value.startTime === 'string';
}

export function parseAvailableSlotsResponse(raw: unknown): AvailableSlotsResponse {
  if (Array.isArray(raw)) {
    return { slots: raw.filter(isAvailableSlot) };
  }
  if (!isRecord(raw)) {
    return { slots: [] };
  }
  const nested = raw.slots ?? raw.data ?? raw.availableSlots;
  if (Array.isArray(nested)) {
    return { slots: nested.filter(isAvailableSlot) };
  }
  return { slots: [] };
}
