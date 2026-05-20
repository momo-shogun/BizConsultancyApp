import { resolveAwsImageUrl } from '@/utils/awsImageUrl';

/**
 * Resolves consultant image paths from the API to a loadable URL.
 * Returns `null` when no image — use `ImagePlaceholder` in UI (no stock-photo fallback).
 */
export function resolveConsultantImageUrl(path: string | null | undefined): string | null {
  return resolveAwsImageUrl(path);
}
