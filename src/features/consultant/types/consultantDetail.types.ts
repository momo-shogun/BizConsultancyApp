/** API-aligned shapes for consultant detail (subset used in UI). */

export interface ConsultantExpertTalk {
  id: number;
  title: string;
  url: string;
  duration: number;
  thumbnail: string | null;
  type: string;
  amount: string;
  category?: { id: number; name: string; slug: string };
  industry?: { id: number; name: string; slug: string };
}

export interface ConsultantProfile {
  type?: string;
  experience?: string;
  skill?: string;
  designation?: string;
  whatsappNumber?: string | null;
  websiteUrl?: string | null;
  region?: string | null;
  address?: string;
  speakIn?: string;
  highestQualification?: string;
  profileSummary?: string;
  educationDetails?: string;
}

export interface ConsultantDetail {
  id: string;
  slug: string;
  name: string;
  title: string;
  expertise: string;
  category: string;
  type: string;
  image: string | null;
  experience: string;
  rate: number;
  audioRate: number;
  videoRate: number;
  skills: string[];
  verified: boolean;
  industries: string[];
  expertVideoUrl: string;
  expertTalks: ConsultantExpertTalk[];
  segments: string[];
  state: string;
  city: string;
  pincode: string;
  gender: string;
  profile: ConsultantProfile;
}
