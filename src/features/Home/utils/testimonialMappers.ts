import type { TestimonialItem } from '@/shared/components/cards/TestimonialCard/TestimonialCard';
import { resolveAwsImageUrl } from '@/utils/awsImageUrl';

import type { PublicTestimonialApiRow } from '../types/publicTestimonialApi.types';

export function mapPublicTestimonialToCardItem(
  row: PublicTestimonialApiRow,
  index: number,
): TestimonialItem {
  const avatarUri = resolveAwsImageUrl(row.avatar) ?? undefined;
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
