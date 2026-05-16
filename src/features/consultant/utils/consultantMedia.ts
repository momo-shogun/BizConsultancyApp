import { API_ORIGIN } from '@/constants/api';

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80';

export function resolveConsultantImageUrl(path: string | null | undefined): string {
  const trimmed = path?.trim();
  if (trimmed == null || trimmed.length === 0) {
    return FALLBACK_PHOTO;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `${API_ORIGIN}/${trimmed.replace(/^\//, '')}`;
}

export { FALLBACK_PHOTO };
