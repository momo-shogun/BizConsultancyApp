import { API_ORIGIN, AWS_BUCKET_NAME, AWS_REGION } from '@/constants/api';

/**
 * S3 public URLs — keep in sync with portal `BizConsultancy/lib/image.ts` and api `.env`:
 * `AWS_BUCKET_NAME` / `NEXT_PUBLIC_AWS_BUCKET_NAME`, `AWS_REGION` / `NEXT_PUBLIC_AWS_REGION`.
 */

const S3_HOST_REGEX = /^(?:https?:\/\/)?([^.]+)\.s3\.([^.]+)\.amazonaws\.com\/?/i;

function buildAwsImageBase(): string {
  if (!AWS_BUCKET_NAME || !AWS_REGION) {
    return '';
  }
  return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;
}

const AWS_IMAGE_BASE = buildAwsImageBase();

function encodeObjectKey(key: string): string {
  const normalized = key.replace(/^\/+/, '');
  return encodeURI(normalized);
}

function buildS3PublicUrl(objectKey: string): string {
  if (!AWS_IMAGE_BASE) {
    return '';
  }
  return `${AWS_IMAGE_BASE}/${encodeObjectKey(objectKey)}`;
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
 * Resolves API media paths (`workshop/…`, `consultant/…`) to a loadable HTTPS URL.
 * Returns `null` when path is empty or bucket config is missing.
 */
export function resolveAwsImageUrl(path: string | null | undefined): string | null {
  const trimmed = path?.trim();
  if (trimmed == null || trimmed.length === 0) {
    return null;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      return encodeURI(trimmed);
    } catch {
      return trimmed;
    }
  }

  const s3Url = parseS3Uri(trimmed);
  if (s3Url != null) {
    return s3Url;
  }

  if (!trimmed.includes('://')) {
    const url = buildS3PublicUrl(trimmed);
    return url.length > 0 ? url : null;
  }

  return `${API_ORIGIN}/${trimmed.replace(/^\//, '')}`;
}
