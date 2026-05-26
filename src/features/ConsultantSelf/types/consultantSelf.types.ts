export interface ConsultantIndustryItem {
  id: number;
  industryId: number;
  segmentId: number | null;
  industry?: {
    id: number;
    name: string;
    thumbnail?: string | null;
  };
  segment?: {
    id: number;
    name: string;
  };
}

export interface ConsultantIndustryInput {
  industryId: number;
  segmentId?: number;
}

export interface ConsultantExpertVideo {
  id: number;
  categoryId: number;
  segmentId: number;
  industryId: number;
  title: string;
  url: string;
  duration: number;
  thumbnail: string | null;
  type: 'paid' | 'free';
  amount: number;
  position: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  category?: { id: number; name: string };
  segment?: { id: number; name: string };
  industry?: { id: number; name: string };
}

export interface ConsultantReview {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  userEmail: string | null;
  bookingName: string | null;
  bookingDate: string | null;
  slotTime: string | null;
}

export interface ConsultantReviewsPage {
  data: ConsultantReview[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ConsultantReviewsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export type ExpertVideoFilterTab = 'all' | 'free' | 'paid';

export type ExpertVideoFilterTab = 'all' | 'free' | 'paid';
