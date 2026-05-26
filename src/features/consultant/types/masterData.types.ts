/** Master taxonomy items from public/master-* endpoints. */

export interface MasterDataItem {
  id: number;
  name: string;
  slug?: string | null;
  categoryId?: number;
  segmentId?: number;
}

export interface MasterSegmentsQuery {
  categoryId?: string;
}

export interface MasterIndustriesQuery {
  categoryId?: string;
  segmentId?: string;
}
