/** Public consultant API shapes (OpenAPI-aligned). */

import type { ConsultantDetail } from './consultantDetail.types';

export interface PublicConsultantsQuery {
  page?: string;
  limit?: string;
  categoryId?: string;
  segmentId?: string;
  industryId?: string;
  search?: string;
}

export interface PublicConsultantsPageResult {
  items: ConsultantDetail[];
  page: number;
  limit: number;
  hasMore: boolean;
  total?: number;
}

export interface AvailableSlotsQuery {
  slug: string;
  date: string;
}

export interface ApiMasterIndustry {
  id: number;
  name: string;
  slug?: string;
}

export interface ApiMasterSegment {
  id: number;
  name: string;
  slug?: string;
}

export interface ApiConsultantIndustry {
  id?: number;
  industryId?: number;
  industry?: ApiMasterIndustry;
  segmentId?: number | null;
  segment?: ApiMasterSegment | null;
  consultantAudioFee?: number | null;
  consultantVideoFee?: number | null;
}

export interface ApiConsultantProfile {
  id?: number;
  type?: string | null;
  experience?: string | null;
  skill?: string | null;
  designation?: string | null;
  whatsappNumber?: string | null;
  websiteUrl?: string | null;
  region?: string | null;
  address?: string | null;
  speakIn?: string | null;
  audioFee?: number | null;
  videoFee?: number | null;
  profileSummary?: string | null;
  educationDetails?: string | null;
  highestQualification?: string | null;
  businessName?: string | null;
}

export interface ApiConsultant {
  id: number;
  name: string;
  slug: string;
  mobile?: string | null;
  email?: string | null;
  pincode?: string | null;
  city?: string | null;
  state?: string | null;
  thumbnail?: string | null;
  gender?: string | null;
  onlineStatus?: number;
  status?: number;
  isUserVerified?: number;
  industries?: ApiConsultantIndustry[];
  profile?: ApiConsultantProfile | null;
}

export interface AvailableSlot {
  id?: number;
  startTime: string;
  endTime?: string;
  label?: string;
}

export interface AvailableSlotsResponse {
  slots: AvailableSlot[];
}
