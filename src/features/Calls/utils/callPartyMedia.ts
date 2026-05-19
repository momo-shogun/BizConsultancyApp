import { resolveConsultantImageUrl } from '@/features/consultant/utils/consultantMedia';

/** Resolve user/consultant thumbnail from API to a loadable image URL. */
export function resolveCallPartyImageUrl(path: string | null | undefined): string | null {
  return resolveConsultantImageUrl(path);
}
