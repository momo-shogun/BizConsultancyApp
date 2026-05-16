import { API_ORIGIN, AWS_BUCKET_NAME, AWS_S3_PUBLIC_BASE_URL } from '@/constants/api';

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

function parseS3Uri(uri: string): string | null {
  if (!uri.startsWith('s3://')) {
    return null;
  }
  const withoutScheme = uri.slice('s3://'.length);
  const slashIndex = withoutScheme.indexOf('/');
  if (slashIndex <= 0) {
    return null;
  }
  const bucket = withoutScheme.slice(0, slashIndex);
  const key = withoutScheme.slice(slashIndex + 1);
  if (bucket === AWS_BUCKET_NAME) {
    return buildS3PublicUrl(key);
  }
  return `https://${bucket}.s3.amazonaws.com/${encodeObjectKey(key)}`;
}

/**
 * Resolves consultant image paths from the API to a loadable URL.
 * Returns `null` when no image — use `ImagePlaceholder` in UI (no stock-photo fallback).
 */
export function resolveConsultantImageUrl(path: string | null | undefined): string | null {
  const trimmed = path?.trim();
  if (trimmed == null || trimmed.length === 0) {
    return null;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const s3Url = parseS3Uri(trimmed);
  if (s3Url != null) {
    return s3Url;
  }

  if (!trimmed.includes('://')) {
    return buildS3PublicUrl(trimmed);
  }

  return `${API_ORIGIN}/${trimmed.replace(/^\//, '')}`;
}
