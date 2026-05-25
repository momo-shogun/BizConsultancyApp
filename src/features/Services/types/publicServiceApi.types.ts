/** Public services API (OpenAPI-aligned). */

import type { OnboardingForm, OnboardingFormConfigResponse } from './serviceOnboarding.types';

export interface PublicServicesQuery {
  page?: number;
  limit?: number;
  categoryId?: number;
  categorySlug?: string;
  subCategoryId?: number;
  subCategorySlug?: string;
  search?: string;
  sortBy?: 'price' | 'position' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

export interface PublicServiceCategoryRef {
  id: number;
  name: string;
  slug?: string | null;
}

export interface PublicServiceMetadata {
  title?: string;
  description?: string;
}

export interface PublicServiceListItem {
  id: number;
  slug: string;
  title: string;
  serviceIcon?: string | null;
  price?: string | number | null;
  isGstIncluded?: string;
  gstPercent?: string | number | null;
  metadata?: PublicServiceMetadata | null;
  hero?: unknown;
  about?: unknown;
  featurepoint?: string[] | null;
  position?: number;
  category: PublicServiceCategoryRef;
  subCategory?: PublicServiceCategoryRef | null;
}

export interface PublicServiceListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicServiceListResult {
  items: PublicServiceListItem[];
  meta: PublicServiceListMeta;
}

/** @deprecated Use OnboardingFormConfigResponse */
export type PublicServiceFormConfig = OnboardingFormConfigResponse | OnboardingForm | null;
