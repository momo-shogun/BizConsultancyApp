import type { MasterDataItem } from '../types/masterData.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseMasterDataItem(raw: unknown): MasterDataItem | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = raw.id;
  const name = raw.name;
  if (typeof id !== 'number' || !Number.isFinite(id)) {
    return null;
  }
  if (typeof name !== 'string' || name.trim().length === 0) {
    return null;
  }
  const categoryId = raw.categoryId;
  const segmentId = raw.segmentId;
  return {
    id,
    name: name.trim(),
    slug: typeof raw.slug === 'string' ? raw.slug : null,
    categoryId:
      typeof categoryId === 'number' && Number.isFinite(categoryId) ? categoryId : undefined,
    segmentId:
      typeof segmentId === 'number' && Number.isFinite(segmentId) ? segmentId : undefined,
  };
}

export function parseMasterDataList(raw: unknown): MasterDataItem[] {
  const tryList = (items: unknown[]): MasterDataItem[] => {
    const result: MasterDataItem[] = [];
    for (const item of items) {
      const parsed = parseMasterDataItem(item);
      if (parsed != null) {
        result.push(parsed);
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
  const nested = raw.data ?? raw.items ?? raw.results;
  if (Array.isArray(nested)) {
    return tryList(nested);
  }
  return [];
}
