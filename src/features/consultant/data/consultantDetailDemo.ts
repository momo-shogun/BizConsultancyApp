import type { ConsultantDetail } from '../types/consultantDetail.types';

const HERO_IMG =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=960&auto=format&fit=crop&q=80';
const TALK_THUMB_1 =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&auto=format&fit=crop&q=80';
const TALK_THUMB_2 =
  'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=640&auto=format&fit=crop&q=80';

/** Mirrors API payload for `r-k-saxena` (thumbnails use CDN-safe placeholders). */
export const CONSULTANT_DETAIL_RK_SAXENA: ConsultantDetail = {
  id: '3',
  slug: 'r-k-saxena',
  name: 'R K Saxena',
  title: 'Project Manager',
  expertise: 'Agriculture',
  category: 'Luggage Bag Manufacturing Business',
  type: 'professional',
  image: HERO_IMG,
  experience: '48 years',
  rate: 354,
  audioRate: 354,
  videoRate: 708,
  skills: ['Agriculture'],
  verified: true,
  industries: ['Luggage Bag Manufacturing Business', 'Business Mentorship & Coaching'],
  expertVideoUrl: 'https://www.youtube.com/embed/5_MTL7qoDDc',
  expertTalks: [
    {
      id: 1161,
      title: 'Brief About Luggage Bag Manufacturing Business',
      url: 'https://www.youtube.com/embed/5_MTL7qoDDc',
      duration: 5,
      thumbnail: TALK_THUMB_1,
      type: 'free',
      amount: '0.00',
      category: { id: 1, name: 'Industrial', slug: 'industrial' },
      industry: { id: 423, name: 'Artifical Dentures & Allied Items', slug: 'artifical-dentures-allied-items' },
    },
    {
      id: 1162,
      title: 'Brief About Pillow Manufacturing Business',
      url: 'https://www.youtube.com/embed/C4G43GfgG3w',
      duration: 6,
      thumbnail: TALK_THUMB_2,
      type: 'free',
      amount: '0.00',
      category: { id: 1, name: 'Industrial', slug: 'industrial' },
      industry: { id: 445, name: 'Hand Sanitizer', slug: 'hand-sanitizer' },
    },
  ],
  segments: ['Textile  & Apparel Industry', 'Business Mentorship & Coaching'],
  state: 'Uttar Pradesh',
  city: 'Lucknow',
  pincode: '226001',
  gender: 'Male',
  profile: {
    type: '1',
    experience: '48 years',
    skill: 'Agriculture',
    designation: 'Project Manager',
    whatsappNumber: 'None',
    websiteUrl: 'https://www.iid.org.in/',
    region: 'None',
    address: 'Lucknow',
    speakIn: 'English, Hindi',
    highestQualification: 'Diploma in Textile Technology',
    profileSummary:
      'Greetings for the day, I am R K Saxena. I stands as a titan in the textile and apparel industry, boasting an unparalleled 48-year journey marked by expertise, innovation, and unwavering dedication. With nearly five decades of experience, I am a revered figure, revered for my profound understanding of every facet of the textile and apparel value chain. As a visionary leader, I have played a pivotal role in shaping the trajectory of the industry. My keen foresight, coupled with a deep understanding of market dynamics and consumer trends, have propelled organizations to new heights of success under my guidance.',
    educationDetails: 'None',
  },
};

const BY_SLUG: Readonly<Record<string, ConsultantDetail>> = {
  'r-k-saxena': CONSULTANT_DETAIL_RK_SAXENA,
};

/**
 * Resolves consultant detail for a slug. Replace with API fetch when backend is wired.
 */
export function resolveConsultantDetail(slug: string): ConsultantDetail | null {
  const key = slug.trim().toLowerCase();
  return BY_SLUG[key] ?? null;
}

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter((s) => s.length > 0)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

const STUB_IMAGE =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=960&auto=format&fit=crop&q=80';

/**
 * Demo resolver: known slugs return full payload; others return a compact placeholder until the API is wired.
 */
export function getConsultantDetail(slug: string): ConsultantDetail {
  const known = resolveConsultantDetail(slug);
  if (known) return known;
  const key = slug.trim().toLowerCase();
  return {
    id: key,
    slug: key,
    name: titleFromSlug(key),
    title: 'Consultant',
    expertise: 'General advisory',
    category: 'Business consultation',
    type: 'professional',
    image: STUB_IMAGE,
    experience: '—',
    rate: 0,
    audioRate: 0,
    videoRate: 0,
    skills: [],
    verified: false,
    industries: [],
    expertVideoUrl: '',
    expertTalks: [],
    segments: [],
    state: '',
    city: '',
    pincode: '',
    gender: '',
    profile: {
      profileSummary:
        'This profile is a placeholder. Connect the consultant detail API to load full information for this expert.',
    },
  };
}
