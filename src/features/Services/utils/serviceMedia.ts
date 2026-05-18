import { API_ORIGIN, AWS_S3_PUBLIC_BASE_URL } from '@/constants/api';

function encodeObjectKey(key: string): string {
  return key
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function buildS3PublicUrl(objectKey: string): string {
  const normalized = objectKey.replace(/^\/+/, '');
  return `${AWS_S3_PUBLIC_BASE_URL}/${encodeObjectKey(normalized)}`;
}

/** Resolves service page asset paths (e.g. uploads/…) to a loadable URL. */
export function resolveServiceAssetUrl(path: string | null | undefined): string | null {
  const trimmed = path?.trim();
  if (trimmed == null || trimmed.length === 0) {
    return null;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (!trimmed.includes('://')) {
    return buildS3PublicUrl(trimmed);
  }

  return `${API_ORIGIN}/${trimmed.replace(/^\//, '')}`;
}
