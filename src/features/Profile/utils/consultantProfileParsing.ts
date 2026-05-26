import type {
  ConsultantGenderValue,
  ConsultantMyProfileDto,
} from '../types/consultantProfile.types';
import { experienceStoredToDigits } from './consultantExperience';

function readString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function normalizeConsultantGender(value: unknown): ConsultantGenderValue {
  const raw = String(value ?? '')
    .trim()
    .toLowerCase();
  if (raw === 'male' || raw === 'm') {
    return 'male';
  }
  if (raw === 'female' || raw === 'f') {
    return 'female';
  }
  if (raw === 'other' || raw === 'others') {
    return 'other';
  }
  if (raw === 'prefer_not' || raw === 'prefer not to say') {
    return 'prefer_not';
  }
  return '';
}

export function parseConsultantMyProfileDto(data: unknown): ConsultantMyProfileDto {
  if (data == null || typeof data !== 'object') {
    throw new Error('Invalid consultant profile response');
  }
  const row = data as Record<string, unknown>;

  return {
    name: readString(row.name),
    email: readString(row.email),
    mobile: readString(row.mobile),
    city: readString(row.city),
    state: readString(row.state),
    pincode: readString(row.pincode),
    gender: normalizeConsultantGender(row.gender),
    thumbnail: readString(row.thumbnail),
    experience: readString(row.experience),
    dob: readString(row.dob),
    address: readString(row.address),
    audioFee: readNumber(row.audioFee),
    videoFee: readNumber(row.videoFee),
    highestQualification: readString(row.highestQualification),
    profileSummary: readString(row.profileSummary),
    bankName: readString(row.bankName),
    branchName: readString(row.branchName),
    accountName: readString(row.accountName),
    accountNo: readString(row.accountNo),
    ifscCode: readString(row.ifscCode),
  };
}

export function formatDobForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDobFromApi(value: string | null): Date | null {
  if (value == null || value.trim().length === 0) {
    return null;
  }
  const date = new Date(`${value.trim()}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function profileToFormState(profile: ConsultantMyProfileDto): {
  email: string;
  gender: ConsultantGenderValue;
  pincode: string;
  city: string;
  state: string;
  address: string;
  experience: string;
  dob: string;
  qualification: string;
  summary: string;
  audioFee: string;
  videoFee: string;
} {
  return {
    email: profile.email ?? '',
    gender: profile.gender,
    pincode: profile.pincode ?? '',
    city: profile.city ?? '',
    state: profile.state ?? '',
    address: profile.address ?? '',
    experience: experienceStoredToDigits(profile.experience),
    dob: profile.dob ?? '',
    qualification: profile.highestQualification ?? '',
    summary: profile.profileSummary ?? '',
    audioFee: profile.audioFee != null ? String(profile.audioFee) : '',
    videoFee: profile.videoFee != null ? String(profile.videoFee) : '',
  };
}
