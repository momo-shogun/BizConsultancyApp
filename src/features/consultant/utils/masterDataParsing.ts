import type { MasterCategoryRef, MasterDataItem } from '../types/masterData.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseMasterCategoryRef(raw: unknown): MasterCategoryRef | null {
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
  return {
    id,
    name: name.trim(),
    slug: typeof raw.slug === 'string' ? raw.slug.trim() : null,
  };
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
  const nestedCategory = parseMasterCategoryRef(raw.category);
  const categoryIdRaw = raw.categoryId;
  const categoryId =
    typeof categoryIdRaw === 'number' && Number.isFinite(categoryIdRaw)
      ? categoryIdRaw
      : nestedCategory?.id;
  const segmentId = raw.segmentId;
  const descriptionRaw = raw.description;
  const thumbnailRaw = raw.thumbnail;

  return {
    id,
    name: name.trim(),
    slug: typeof raw.slug === 'string' ? raw.slug.trim() : null,
    categoryId,
    segmentId:
      typeof segmentId === 'number' && Number.isFinite(segmentId) ? segmentId : undefined,
    thumbnail:
      typeof thumbnailRaw === 'string' && thumbnailRaw.trim().length > 0
        ? thumbnailRaw.trim()
        : null,
    description:
      typeof descriptionRaw === 'string' && descriptionRaw.trim().length > 0
        ? descriptionRaw.trim()
        : null,
    category: nestedCategory,
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
