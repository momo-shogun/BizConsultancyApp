import type { MasterCategoryRef, MasterDataItem } from '@/features/consultant/types/masterData.types';

export interface ExpertConsultationCategorySection {
  category: MasterCategoryRef;
  segments: MasterDataItem[];
}

export function buildExpertConsultationSections(
  categories: MasterCategoryRef[],
  segments: MasterDataItem[],
): ExpertConsultationCategorySection[] {
  if (categories.length === 0) {
    const byName = new Map<string, MasterDataItem[]>();
    for (const segment of segments) {
      const key = segment.category?.name ?? 'Other';
      const list = byName.get(key) ?? [];
      list.push(segment);
      byName.set(key, list);
    }
    return Array.from(byName.entries()).map(([name, sectionSegments]) => ({
      category: {
        id: sectionSegments[0]?.categoryId ?? 0,
        name,
        slug: sectionSegments[0]?.category?.slug ?? null,
      },
      segments: sectionSegments,
    }));
  }

  return categories
    .map((category) => ({
      category,
      segments: segments.filter(
        (segment) =>
          segment.categoryId === category.id || segment.category?.id === category.id,
      ),
    }))
    .filter((section) => section.segments.length > 0);
}

export function toMasterCategoryRefs(
  categories: MasterDataItem[],
): MasterCategoryRef[] {
  return categories.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug ?? null,
  }));
}
