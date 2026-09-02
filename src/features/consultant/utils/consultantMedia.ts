import { mediaUrl } from '@/utils/awsImageUrl';

/**
 * Resolves consultant image paths from the API via `{API}/media/<key>` (portal `getImageUrl`).
 * Returns `null` when no image — use `ImagePlaceholder` in UI (no stock-photo fallback).
 */
export function resolveConsultantImageUrl(path: string | null | undefined): string | null {
  return mediaUrl(path);
}
