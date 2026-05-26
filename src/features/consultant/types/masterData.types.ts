/** Master taxonomy items from public/master-* endpoints. */

export interface MasterCategoryRef {
  id: number;
  name: string;
  slug: string | null;
}

export interface MasterDataItem {
  id: number;
  name: string;
  slug?: string | null;
  categoryId?: number;
  segmentId?: number;
  thumbnail?: string | null;
  description?: string | null;
  category?: MasterCategoryRef | null;
}

export interface MasterSegmentsQuery {
  categoryId?: string;
}

export interface MasterIndustriesQuery {
  categoryId?: string;
  segmentId?: string;
}
