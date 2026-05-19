import type { FilterOption, FilterSection, FilterSheetValue } from '@/shared/components';
import type { TopConsultantItem } from '@/shared/components';

import type { MasterDataItem } from '../types/masterData.types';
import type { PublicConsultantsQuery } from '../types/consultantApi.types';

export const CONSULTANT_SEARCH_DEBOUNCE_MS = 400;
export const CONSULTANT_SEARCH_MIN_API_LENGTH = 2;

export const CONSULTANT_LIST_FILTER_KEYS = {
  category: 'categoryId',
  segment: 'segmentId',
  industry: 'industryId',
} as const;

export const EMPTY_CONSULTANT_LIST_FILTERS: FilterSheetValue = {
  selected: {
    [CONSULTANT_LIST_FILTER_KEYS.category]: null,
    [CONSULTANT_LIST_FILTER_KEYS.segment]: null,
    [CONSULTANT_LIST_FILTER_KEYS.industry]: null,
  },
};

function parsePositiveInt(value: string | null): number | undefined {
  if (value == null || value.length === 0) {
    return undefined;
  }
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function mapMasterToFilterOptions(items: MasterDataItem[]): FilterOption[] {
  return items
    .map((item) => ({
      id: String(item.id),
      label: item.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function buildPublicConsultantsListQuery(
  filters: FilterSheetValue,
  search?: string,
  page = 1,
  limit = 10,
): PublicConsultantsQuery {
  const query: PublicConsultantsQuery = {
    page: String(page),
    limit: String(limit),
  };

  const categoryId = parsePositiveInt(filters.selected[CONSULTANT_LIST_FILTER_KEYS.category]);
  if (categoryId != null) {
    query.categoryId = String(categoryId);
  }

  const segmentId = parsePositiveInt(filters.selected[CONSULTANT_LIST_FILTER_KEYS.segment]);
  if (segmentId != null) {
    query.segmentId = String(segmentId);
  }

  const industryId = parsePositiveInt(filters.selected[CONSULTANT_LIST_FILTER_KEYS.industry]);
  if (industryId != null) {
    query.industryId = String(industryId);
  }

  const trimmedSearch = search?.trim();
  if (trimmedSearch != null && trimmedSearch.length >= CONSULTANT_SEARCH_MIN_API_LENGTH) {
    query.search = trimmedSearch;
  }

  return query;
}

export function matchesConsultantSearch(item: TopConsultantItem, query: string): boolean {
  const term = query.trim().toLowerCase();
  if (term.length === 0) {
    return true;
  }
  return (
    item.name.toLowerCase().includes(term) ||
    item.role.toLowerCase().includes(term) ||
    item.specialty.toLowerCase().includes(term) ||
    item.bio.toLowerCase().includes(term)
  );
}

export function buildConsultantFilterSections(
  categoryOptions: FilterOption[],
  segmentOptions: FilterOption[],
  industryOptions: FilterOption[],
): FilterSection[] {
  const sections: FilterSection[] = [];

  if (categoryOptions.length > 0) {
    sections.push({
      id: CONSULTANT_LIST_FILTER_KEYS.category,
      title: 'Category',
      options: categoryOptions,
    });
  }

  if (segmentOptions.length > 0) {
    sections.push({
      id: CONSULTANT_LIST_FILTER_KEYS.segment,
      title: 'Segment',
      options: segmentOptions,
    });
  }

  if (industryOptions.length > 0) {
    sections.push({
      id: CONSULTANT_LIST_FILTER_KEYS.industry,
      title: 'Industry',
      options: industryOptions,
    });
  }

  return sections;
}

export function countActiveConsultantFilters(filters: FilterSheetValue): number {
  return Object.values(filters.selected).filter((v) => v != null && v.length > 0).length;
}

export function findFilterOptionLabel(
  options: FilterOption[],
  id: string | null,
): string | null {
  if (id == null) {
    return null;
  }
  return options.find((o) => o.id === id)?.label ?? null;
}
