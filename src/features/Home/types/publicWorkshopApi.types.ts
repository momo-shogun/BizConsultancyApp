/** GET /api/public/workshops — single row (matches API JSON). */
export interface PublicWorkshopApiRow {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  type: string;
  thumbnail: string | null;
  description: string | null;
  highlightPoints: string | null;
  keywords: string | null;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  place: string | null;
  mapLocation: string | null;
  contactNumber: string | null;
  segmentId: number | null;
  industryId: number | null;
  onlineFee: string | number | null;
  offlineFee: string | number | null;
  isOnlineAvailable: number | null;
  isLiveWorkshop: number | null;
  externalUrlOnline: string | null;
  externalUrlOffline: string | null;
  workshopUrl: string | null;
  status: number | null;
  createdBy: unknown | null;
  updatedBy: unknown | null;
  deletedBy: unknown | null;
  isDeleted: number | null;
}

export interface PublicWorkshopsListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicWorkshopsListResult {
  items: PublicWorkshopApiRow[];
  meta: PublicWorkshopsListMeta;
}

export interface PublicWorkshopsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: number;
  date?: string;
}
