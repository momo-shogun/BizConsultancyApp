import type { TestimonialItem } from '@/shared/components/cards/TestimonialCard/TestimonialCard';
import { mediaUrl } from '@/utils/awsImageUrl';

import type { PublicTestimonialApiRow } from '../types/publicTestimonialApi.types';

function resolveTestimonialAvatar(path: string | null | undefined): string | undefined {
  const trimmed = path?.trim();
  if (trimmed == null || trimmed.length === 0) {
    return undefined;
  }
  const lower = trimmed.toLowerCase();
  if (lower === 'placeholder.svg' || lower.endsWith('/placeholder.svg')) {
    return undefined;
  }
  return mediaUrl(trimmed) ?? undefined;
}

export function mapPublicTestimonialToCardItem(
  row: PublicTestimonialApiRow,
  index: number,
): TestimonialItem {
  const avatarUri = resolveTestimonialAvatar(row.avatar);
  return {
    id: String(row.id),
    quote: row.testimonial.trim(),
    name: row.name.trim(),
    role: row.title?.trim() ?? 'Member',
    avatarUri,
    accentStyleIndex: (index % 2) as 0 | 1,
  };
}

export function mapPublicTestimonialsToCardItems(
  rows: PublicTestimonialApiRow[],
): TestimonialItem[] {
  return rows.map(mapPublicTestimonialToCardItem);
}
