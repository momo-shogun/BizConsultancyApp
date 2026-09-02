import { API_BASE_URL } from '@/constants/api';

/**
 * Resolve stored media values (S3 key, legacy S3 URL, or /media path) to a loadable URL
 * via the API media proxy — keep in sync with portal `BizConsultancy/lib/s3.ts` + `lib/image.ts`.
 *
 * Production stores the S3 **key** in the DB; clients fetch `{API_BASE_URL}/media/<key>`.
 */

const S3_HOST_REGEX = /\.s3[.-][^/]*\.amazonaws\.com$/i;

function apiBase(): string {
  return API_BASE_URL.replace(/\/$/, '');
}

function decodeKey(raw: string): string | null {
  let key = raw.replace(/^\/+/, '');
  try {
    key = decodeURIComponent(key);
  } catch {
    // keep raw
  }
  key = key.replace(/^\/+/, '');
  if (!key || key.includes('..')) {
    return null;
  }
  return key;
}

/** Extract S3 object key from a stored value (key, /media path, or S3 URL). */
export function extractMediaKey(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const u = new URL(trimmed);
      if (S3_HOST_REGEX.test(u.hostname) || u.hostname.includes('amazonaws.com')) {
        return decodeKey(u.pathname.replace(/^\/+/, ''));
      }
      const marker = '/media/';
      const idx = u.pathname.indexOf(marker);
      if (idx >= 0) {
        return decodeKey(u.pathname.slice(idx + marker.length));
      }
    } catch {
      return null;
    }
    return null;
  }

  const mediaIdx = trimmed.indexOf('/media/');
  if (mediaIdx >= 0) {
    return decodeKey(trimmed.slice(mediaIdx + '/media/'.length));
  }

  return decodeKey(trimmed.replace(/^\/+/, ''));
}

/**
 * Browser / app URL for API-hosted media.
 * Returns external http(s) URLs unchanged when they are not S3 or /media paths.
 */
export function mediaUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const key = extractMediaKey(trimmed);
  if (!key) {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return null;
  }

  return `${apiBase()}/media/${encodeURI(key)}`;
}

/**
 * Resolves API media paths (`consultant/…`, `workshop/…`) to a loadable HTTPS URL.
 * Returns `null` when path is empty or cannot be resolved.
 */
export function resolveAwsImageUrl(path: string | null | undefined): string | null {
  return mediaUrl(path);
}
