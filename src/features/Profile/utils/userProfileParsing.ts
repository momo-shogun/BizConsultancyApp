import type { UserGenderValue, UserMeDto } from '../types/userProfile.types';

export function normalizeUserGender(value: unknown): UserGenderValue {
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
  return '';
}

export function parseUserMeDto(data: unknown): UserMeDto {
  if (data == null || typeof data !== 'object') {
    throw new Error('Invalid profile response');
  }

  const row = data as Record<string, unknown>;
  const id = Number(row.id);

  if (!Number.isFinite(id)) {
    throw new Error('Invalid profile response');
  }

  return {
    id,
    name: typeof row.name === 'string' ? row.name : null,
    email: typeof row.email === 'string' ? row.email : null,
    mobile: typeof row.mobile === 'string' ? row.mobile : null,
    city: typeof row.city === 'string' ? row.city : null,
    state: typeof row.state === 'string' ? row.state : null,
    pincode: row.pincode != null ? String(row.pincode) : null,
    gender: normalizeUserGender(row.gender),
    thumbnail: typeof row.thumbnail === 'string' ? row.thumbnail : null,
  };
}

export function readApiErrorMessage(data: unknown, fallback: string): string {
  if (data != null && typeof data === 'object' && 'message' in data) {
    const message = (data as { message: unknown }).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
    if (Array.isArray(message)) {
      return message.map((part) => String(part)).join(', ');
    }
  }
  return fallback;
}
