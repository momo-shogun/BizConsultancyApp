import type { TopConsultantItem } from '@/shared/components/cards/TopConsultantCard/TopConsultantCard';

import type { ConsultantDetail, ConsultantExpertTalk, ConsultantProfile } from '../types/consultantDetail.types';
import type { ApiConsultant } from '../types/consultantApi.types';
import { resolveConsultantImageUrl } from './consultantMedia';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function formatRupee(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    return '—';
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function mapProfileFromRecord(row: Record<string, unknown>): ConsultantProfile {
  return {
    type: typeof row.type === 'string' ? row.type : undefined,
    experience: typeof row.experience === 'string' ? row.experience : undefined,
    skill: typeof row.skill === 'string' ? row.skill : undefined,
    designation: typeof row.designation === 'string' ? row.designation : undefined,
    whatsappNumber: typeof row.whatsappNumber === 'string' ? row.whatsappNumber : null,
    websiteUrl: typeof row.websiteUrl === 'string' ? row.websiteUrl : null,
    region: typeof row.region === 'string' ? row.region : null,
    address: typeof row.address === 'string' ? row.address : undefined,
    speakIn: typeof row.speakIn === 'string' ? row.speakIn : undefined,
    highestQualification:
      typeof row.highestQualification === 'string' ? row.highestQualification : undefined,
    profileSummary: typeof row.profileSummary === 'string' ? row.profileSummary : undefined,
    educationDetails: typeof row.educationDetails === 'string' ? row.educationDetails : undefined,
  };
}

function mapExpertTalks(raw: unknown): ConsultantExpertTalk[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const talks: ConsultantExpertTalk[] = [];
  for (const item of raw) {
    if (!isRecord(item)) {
      continue;
    }
    if (typeof item.id !== 'number' || typeof item.title !== 'string' || typeof item.url !== 'string') {
      continue;
    }
    talks.push({
      id: item.id,
      title: item.title,
      url: item.url,
      duration: typeof item.duration === 'number' ? item.duration : 0,
      thumbnail:
        typeof item.thumbnail === 'string'
          ? resolveConsultantImageUrl(item.thumbnail)
          : resolveConsultantImageUrl(undefined),
      type: typeof item.type === 'string' ? item.type : 'free',
      amount: typeof item.amount === 'string' ? item.amount : '0',
    });
  }
  return talks;
}

/** Flat public API payload (list + detail). */
function mapFlatPublicConsultant(row: Record<string, unknown>): ConsultantDetail {
  const profileRow = isRecord(row.profile) ? row.profile : {};
  const profile = mapProfileFromRecord(profileRow);
  const industries = stringArray(row.industries);
  const skills = stringArray(row.skills);
  const rate = typeof row.rate === 'number' ? row.rate : 0;
  const audioRate = typeof row.audioRate === 'number' ? row.audioRate : 0;
  const videoRate = typeof row.videoRate === 'number' ? row.videoRate : 0;
  const imagePath =
    typeof row.image === 'string'
      ? row.image
      : typeof row.thumbnail === 'string'
        ? row.thumbnail
        : undefined;

  return {
    id: String(row.id ?? ''),
    slug: String(row.slug ?? ''),
    name: String(row.name ?? ''),
    title: String(row.title ?? profile.designation ?? 'Consultant'),
    expertise: String(row.expertise ?? profile.skill ?? industries[0] ?? ''),
    category: String(row.category ?? ''),
    type: String(row.type ?? 'professional'),
    image: resolveConsultantImageUrl(imagePath),
    experience: String(row.experience ?? profile.experience ?? '—'),
    rate,
    audioRate,
    videoRate,
    skills: skills.length > 0 ? skills : industries.slice(0, 3),
    verified: row.verified === true || row.verified === 1,
    industries,
    expertVideoUrl: typeof row.expertVideoUrl === 'string' ? row.expertVideoUrl : '',
    expertTalks: mapExpertTalks(row.expertTalks ?? row.expertsVideos),
    segments: stringArray(row.segments),
    state: typeof row.state === 'string' ? row.state : '',
    city: typeof row.city === 'string' ? row.city : '',
    pincode: typeof row.pincode === 'string' ? row.pincode : '',
    gender: typeof row.gender === 'string' ? row.gender : '',
    profile,
  };
}

function industryNamesFromNested(consultant: ApiConsultant): string[] {
  const names: string[] = [];
  for (const row of consultant.industries ?? []) {
    const name = row.industry?.name?.trim();
    if (name && !names.includes(name)) {
      names.push(name);
    }
  }
  return names;
}

function segmentNamesFromNested(consultant: ApiConsultant): string[] {
  const names: string[] = [];
  for (const row of consultant.industries ?? []) {
    const name = row.segment?.name?.trim();
    if (name && !names.includes(name)) {
      names.push(name);
    }
  }
  return names;
}

function pickNestedFee(consultant: ApiConsultant): number {
  const profile = consultant.profile;
  const video = profile?.videoFee ?? 0;
  const audio = profile?.audioFee ?? 0;
  if (video > 0) {
    return video;
  }
  if (audio > 0) {
    return audio;
  }
  const industryFee = consultant.industries?.find(
    (row) => (row.consultantVideoFee ?? 0) > 0 || (row.consultantAudioFee ?? 0) > 0,
  );
  return industryFee?.consultantVideoFee ?? industryFee?.consultantAudioFee ?? 0;
}

/** Legacy nested OpenAPI consultant shape. */
function mapNestedPublicConsultant(consultant: ApiConsultant): ConsultantDetail {
  const profile = consultant.profile;
  const industries = industryNamesFromNested(consultant);
  const segments = segmentNamesFromNested(consultant);
  const skills = profile?.skill?.trim()
    ? profile.skill.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    id: String(consultant.id),
    slug: consultant.slug,
    name: consultant.name,
    title: profile?.designation?.trim() || 'Consultant',
    expertise: industries[0] ?? skills[0] ?? 'General advisory',
    category: segments[0] ?? industries[0] ?? 'Business consultation',
    type: profile?.type?.trim() || 'professional',
    image: resolveConsultantImageUrl(consultant.thumbnail),
    experience: profile?.experience?.trim() ?? '—',
    rate: pickNestedFee(consultant),
    audioRate: profile?.audioFee ?? 0,
    videoRate: profile?.videoFee ?? 0,
    skills: skills.length > 0 ? skills : industries.slice(0, 3),
    verified: consultant.isUserVerified === 1,
    industries,
    expertVideoUrl: '',
    expertTalks: [],
    segments,
    state: consultant.state?.trim() ?? '',
    city: consultant.city?.trim() ?? '',
    pincode: consultant.pincode?.trim() ?? '',
    gender: consultant.gender?.trim() ?? '',
    profile: {
      type: profile?.type ?? undefined,
      experience: profile?.experience ?? undefined,
      skill: profile?.skill ?? undefined,
      designation: profile?.designation ?? undefined,
      whatsappNumber: profile?.whatsappNumber,
      websiteUrl: profile?.websiteUrl,
      region: profile?.region,
      address: profile?.address ?? undefined,
      speakIn: profile?.speakIn ?? undefined,
      highestQualification: profile?.highestQualification ?? undefined,
      profileSummary: profile?.profileSummary ?? undefined,
      educationDetails: profile?.educationDetails ?? undefined,
    },
  };
}

function isFlatPublicConsultant(row: Record<string, unknown>): boolean {
  return (
    typeof row.slug === 'string' &&
    typeof row.name === 'string' &&
    (typeof row.title === 'string' ||
      typeof row.expertise === 'string' ||
      typeof row.image === 'string' ||
      typeof row.rate === 'number')
  );
}

function isNestedApiConsultant(row: Record<string, unknown>): boolean {
  return (
    typeof row.slug === 'string' &&
    typeof row.name === 'string' &&
    (typeof row.id === 'number' || typeof row.id === 'string') &&
    !isFlatPublicConsultant(row)
  );
}

export function normalizePublicConsultant(raw: unknown): ConsultantDetail | null {
  if (!isRecord(raw)) {
    return null;
  }
  if (isFlatPublicConsultant(raw)) {
    return mapFlatPublicConsultant(raw);
  }
  if (isNestedApiConsultant(raw)) {
    return mapNestedPublicConsultant(raw as unknown as ApiConsultant);
  }
  return null;
}

export function mapConsultantDetailToCardItem(detail: ConsultantDetail): TopConsultantItem {
  const primaryRate =
    detail.videoRate > 0 ? detail.videoRate : detail.audioRate > 0 ? detail.audioRate : detail.rate;

  return {
    id: detail.id,
    slug: detail.slug,
    name: detail.name,
    role: detail.title,
    bio: detail.profile.profileSummary?.trim() ?? '',
    specialty: detail.expertise || detail.industries[0] || 'Consultation',
    experienceLabel: detail.experience,
    rateLabel: formatRupee(primaryRate),
    photoUri: detail.image,
  };
}

/** @deprecated Use normalizePublicConsultant + mapConsultantDetailToCardItem */
export function mapApiConsultantToCardItem(raw: unknown): TopConsultantItem {
  const detail = normalizePublicConsultant(raw);
  if (detail == null) {
    throw new Error('Invalid consultant payload');
  }
  return mapConsultantDetailToCardItem(detail);
}

/** @deprecated Use normalizePublicConsultant */
export function mapApiConsultantToDetail(raw: unknown): ConsultantDetail {
  const detail = normalizePublicConsultant(raw);
  if (detail == null) {
    throw new Error('Invalid consultant payload');
  }
  return detail;
}
