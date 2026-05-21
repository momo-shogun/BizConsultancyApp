import { baseApi } from '@/services/api/baseApi';

import type {
  PublicMembershipApiRow,
  PublicMembershipScopeApiRow,
  PublicMembershipsQuery,
} from '../types/publicMembershipApi.types';
import type { PublicTestimonialApiRow } from '../types/publicTestimonialApi.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function readString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function readStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }
  const items = value.filter((item): item is string => typeof item === 'string');
  return items.length > 0 ? items : null;
}

function parseMembershipScope(raw: Record<string, unknown>): PublicMembershipScopeApiRow | null {
  const id = readNumber(raw.id);
  const title = readString(raw.title)?.trim();
  if (id == null || title == null || title.length === 0) {
    return null;
  }
  return {
    id,
    membershipId: readNumber(raw.membershipId) ?? 0,
    title,
    amount: raw.amount as string | number | null | undefined,
    status: readNumber(raw.status) ?? undefined,
    isDeleted: readNumber(raw.isDeleted) ?? undefined,
  };
}

function parseMembershipRow(raw: unknown): PublicMembershipApiRow | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = readNumber(raw.id);
  const name = readString(raw.name)?.trim();
  if (id == null || name == null || name.length === 0) {
    return null;
  }

  const scopesRaw = Array.isArray(raw.scopes) ? raw.scopes : [];
  const scopes = scopesRaw
    .filter(isRecord)
    .map(parseMembershipScope)
    .filter((scope): scope is PublicMembershipScopeApiRow => scope != null);

  return {
    id,
    name,
    slug: readString(raw.slug),
    membershipType: readString(raw.membershipType) ?? 'users',
    basePrice: raw.basePrice as string | number | null,
    sgst: raw.sgst as string | number | null | undefined,
    cgst: raw.cgst as string | number | null | undefined,
    igst: raw.igst as string | number | null | undefined,
    discount: raw.discount as string | number | null | undefined,
    discountType: readString(raw.discountType),
    walletTransferAmounts: raw.walletTransferAmounts as string | number | null | undefined,
    amount: raw.amount as string | number | null,
    days: readNumber(raw.days),
    termCondition: readStringArray(raw.termCondition),
    feature: readStringArray(raw.feature),
    description: readString(raw.description),
    badge: readString(raw.badge),
    icon: readString(raw.icon),
    isMostPopular: readNumber(raw.isMostPopular) ?? 0,
    status: readNumber(raw.status) ?? 1,
    tierRank: readNumber(raw.tierRank) ?? id,
    isDeleted: readNumber(raw.isDeleted) ?? 0,
    scopes,
  };
}

function parseMembershipList(raw: unknown): PublicMembershipApiRow[] {
  const rows = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.data)
      ? raw.data
      : [];
  const result: PublicMembershipApiRow[] = [];
  for (const item of rows) {
    const row = parseMembershipRow(item);
    if (row != null) {
      result.push(row);
    }
  }
  return result;
}

function parseTestimonialRow(raw: unknown): PublicTestimonialApiRow | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = readNumber(raw.id);
  const name = readString(raw.name)?.trim();
  const testimonial = readString(raw.testimonial)?.trim();
  if (id == null || name == null || name.length === 0 || testimonial == null || testimonial.length === 0) {
    return null;
  }

  return {
    id,
    name,
    testimonial,
    title: readString(raw.title),
    rating: raw.rating as number | string | null,
    avatar: readString(raw.avatar),
    status: readNumber(raw.status) ?? 1,
    showOnHomescreen: readNumber(raw.showOnHomescreen) ?? 0,
    displayOrder: readNumber(raw.displayOrder) ?? 0,
    createdAt: readString(raw.createdAt) ?? undefined,
    updatedAt: readString(raw.updatedAt) ?? undefined,
  };
}

function parseTestimonialList(raw: unknown): PublicTestimonialApiRow[] {
  const rows = Array.isArray(raw) ? raw : [];
  const result: PublicTestimonialApiRow[] = [];
  for (const item of rows) {
    const row = parseTestimonialRow(item);
    if (row != null && row.status === 1) {
      result.push(row);
    }
  }
  return result.sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id);
}

export const homePublicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPublicTestimonials: build.query<PublicTestimonialApiRow[], { showOnHomescreen?: boolean } | void>({
      query: (params) => ({
        url: 'public/testimonials',
        params:
          params?.showOnHomescreen === false
            ? {}
            : { showOnHomescreen: '1' },
      }),
      transformResponse: (response: unknown) => parseTestimonialList(response),
      providesTags: [{ type: 'Testimonial', id: 'LIST' }],
    }),
    getPublicMemberships: build.query<PublicMembershipApiRow[], PublicMembershipsQuery | void>({
      query: (params) => ({
        url: 'public/memberships',
        params: params?.type != null ? { type: params.type } : {},
      }),
      transformResponse: (response: unknown) => parseMembershipList(response),
      providesTags: [{ type: 'Membership', id: 'LIST' }],
    }),
  }),
});

export const { useGetPublicTestimonialsQuery, useGetPublicMembershipsQuery } = homePublicApi;
