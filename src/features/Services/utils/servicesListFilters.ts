import type {
  FilterOption,
  FilterSection,
  FilterSheetValue,
} from '@/shared/components';
import type { RecommendedServiceItem } from '@/shared/components';

import type {
  PublicServiceListItem,
  PublicServicesQuery,
} from '../types/publicServiceApi.types';

export const SERVICE_SEARCH_DEBOUNCE_MS = 400;
export const SERVICE_SEARCH_MIN_API_LENGTH = 2;

export type ServiceSortMode =
  | 'position_desc'
  | 'title_asc'
  | 'price_asc'
  | 'price_desc'
  | 'created_desc';

export type ServicePriceFilterId = 'under-2k' | '2k-7k' | '7k-plus';

export const SERVICE_LIST_FILTER_KEYS = {
  category: 'category',
  subCategory: 'subCategory',
  price: 'price',
} as const;

export const EMPTY_SERVICE_LIST_FILTERS: FilterSheetValue = {
  selected: {
    [SERVICE_LIST_FILTER_KEYS.category]: null,
    [SERVICE_LIST_FILTER_KEYS.subCategory]: null,
    [SERVICE_LIST_FILTER_KEYS.price]: null,
  },
};

const PRICE_OPTIONS: FilterOption[] = [
  { id: 'under-2k', label: 'Under ₹2,000' },
  { id: '2k-7k', label: '₹2,000–₹7,000' },
  { id: '7k-plus', label: '₹7,000+' },
];

export function getSortLabel(mode: ServiceSortMode): string {
  switch (mode) {
    case 'title_asc':
      return 'Name A–Z';
    case 'price_asc':
      return 'Price · Low to high';
    case 'price_desc':
      return 'Price · High to low';
    case 'created_desc':
      return 'Newest first';
    default:
      return 'Recommended';
  }
}

export function cycleSortMode(mode: ServiceSortMode): ServiceSortMode {
  switch (mode) {
    case 'position_desc':
      return 'title_asc';
    case 'title_asc':
      return 'price_asc';
    case 'price_asc':
      return 'price_desc';
    case 'price_desc':
      return 'created_desc';
    default:
      return 'position_desc';
  }
}

function sortModeToQuery(mode: ServiceSortMode): Pick<PublicServicesQuery, 'sortBy' | 'sortOrder'> {
  switch (mode) {
    case 'title_asc':
      return { sortBy: 'title', sortOrder: 'asc' };
    case 'price_asc':
      return { sortBy: 'price', sortOrder: 'asc' };
    case 'price_desc':
      return { sortBy: 'price', sortOrder: 'desc' };
    case 'created_desc':
      return { sortBy: 'createdAt', sortOrder: 'desc' };
    default:
      return { sortBy: 'position', sortOrder: 'desc' };
  }
}

function priceFilterToQuery(
  priceId: string | null,
): Pick<PublicServicesQuery, 'minPrice' | 'maxPrice'> {
  if (priceId === 'under-2k') {
    return { maxPrice: 1999 };
  }
  if (priceId === '2k-7k') {
    return { minPrice: 2000, maxPrice: 7000 };
  }
  if (priceId === '7k-plus') {
    return { minPrice: 7001 };
  }
  return {};
}

function parsePositiveInt(value: string | null): number | undefined {
  if (value == null || value.length === 0) {
    return undefined;
  }
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function buildPublicServicesListQuery(
  filters: FilterSheetValue,
  search?: string,
): PublicServicesQuery {
  const { category, subCategory, price } = filters.selected;
  const query: PublicServicesQuery = {
    page: 1,
    limit: 50,
    ...sortModeToQuery('position_desc'),
    ...priceFilterToQuery(price),
  };

  const categoryId = parsePositiveInt(category);
  if (categoryId != null) {
    query.categoryId = categoryId;
  }

  const subCategoryId = parsePositiveInt(subCategory);
  if (subCategoryId != null) {
    query.subCategoryId = subCategoryId;
  }

  const trimmedSearch = search?.trim();
  if (trimmedSearch != null && trimmedSearch.length >= SERVICE_SEARCH_MIN_API_LENGTH) {
    query.search = trimmedSearch;
  }

  return query;
}

export function matchesServiceSearch(
  item: RecommendedServiceItem,
  query: string,
): boolean {
  const term = query.trim().toLowerCase();
  if (term.length === 0) {
    return true;
  }
  return (
    item.title.toLowerCase().includes(term) ||
    item.summary.toLowerCase().includes(term) ||
    item.categoryLabel.toLowerCase().includes(term) ||
    item.headerRight.toLowerCase().includes(term) ||
    item.slug.toLowerCase().includes(term)
  );
}

export function extractCategoryOptions(items: PublicServiceListItem[]): FilterOption[] {
  const byId = new Map<number, FilterOption>();
  for (const item of items) {
    if (!byId.has(item.category.id)) {
      byId.set(item.category.id, {
        id: String(item.category.id),
        label: item.category.name,
      });
    }
  }
  return [...byId.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function extractSubCategoryOptions(
  items: PublicServiceListItem[],
  categoryId: string | null,
): FilterOption[] {
  if (categoryId == null) {
    return [];
  }
  const byId = new Map<number, FilterOption>();
  for (const item of items) {
    if (String(item.category.id) !== categoryId || item.subCategory == null) {
      continue;
    }
    if (!byId.has(item.subCategory.id)) {
      byId.set(item.subCategory.id, {
        id: String(item.subCategory.id),
        label: item.subCategory.name,
      });
    }
  }
  return [...byId.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function buildServiceFilterSections(
  categoryOptions: FilterOption[],
  subCategoryOptions: FilterOption[],
): FilterSection[] {
  const sections: FilterSection[] = [
    {
      id: SERVICE_LIST_FILTER_KEYS.category,
      title: 'Category',
      options: categoryOptions,
    },
  ];
  if (subCategoryOptions.length > 0) {
    sections.push({
      id: SERVICE_LIST_FILTER_KEYS.subCategory,
      title: 'Subcategory',
      options: subCategoryOptions,
    });
  }
  sections.push({
    id: SERVICE_LIST_FILTER_KEYS.price,
    title: 'Price',
    options: PRICE_OPTIONS,
  });
  return sections;
}

export function countActiveServiceFilters(filters: FilterSheetValue): number {
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
