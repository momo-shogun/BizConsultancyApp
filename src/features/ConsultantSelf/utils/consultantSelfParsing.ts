import type {
  ConsultantExpertVideo,
  ConsultantIndustryItem,
  ConsultantReview,
  ConsultantReviewsPage,
} from '../types/consultantSelf.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseConsultantIndustryItem(raw: unknown): ConsultantIndustryItem | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const industryId = Number(raw.industryId);
  if (!Number.isFinite(id) || !Number.isFinite(industryId)) {
    return null;
  }

  const industryRaw = raw.industry;
  const segmentRaw = raw.segment;

  return {
    id,
    industryId,
    segmentId: raw.segmentId != null ? Number(raw.segmentId) : null,
    industry:
      isRecord(industryRaw) && typeof industryRaw.name === 'string'
        ? {
            id: Number(industryRaw.id),
            name: industryRaw.name,
            thumbnail:
              typeof industryRaw.thumbnail === 'string' ? industryRaw.thumbnail : null,
          }
        : undefined,
    segment:
      isRecord(segmentRaw) && typeof segmentRaw.name === 'string'
        ? { id: Number(segmentRaw.id), name: segmentRaw.name }
        : undefined,
  };
}

export function parseConsultantIndustryList(raw: unknown): ConsultantIndustryItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(parseConsultantIndustryItem)
    .filter((item): item is ConsultantIndustryItem => item != null);
}

export function parseConsultantExpertVideo(raw: unknown): ConsultantExpertVideo | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const title = typeof raw.title === 'string' ? raw.title : '';
  const url = typeof raw.url === 'string' ? raw.url : '';
  if (!Number.isFinite(id) || title.length === 0) {
    return null;
  }

  const typeRaw = raw.type;
  const type: 'paid' | 'free' = typeRaw === 'paid' ? 'paid' : 'free';

  const parseNested = (nested: unknown): { id: number; name: string } | undefined => {
    if (!isRecord(nested) || typeof nested.name !== 'string') {
      return undefined;
    }
    return { id: Number(nested.id), name: nested.name };
  };

  return {
    id,
    categoryId: Number(raw.categoryId),
    segmentId: Number(raw.segmentId),
    industryId: Number(raw.industryId),
    title,
    url,
    duration: Number(raw.duration),
    thumbnail: typeof raw.thumbnail === 'string' ? raw.thumbnail : null,
    type,
    amount: Number(raw.amount),
    position: Number(raw.position),
    status: Number(raw.status),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : '',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
    category: parseNested(raw.category),
    segment: parseNested(raw.segment),
    industry: parseNested(raw.industry),
  };
}

export function parseConsultantExpertVideoList(raw: unknown): ConsultantExpertVideo[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(parseConsultantExpertVideo)
    .filter((item): item is ConsultantExpertVideo => item != null);
}

export function parseConsultantReview(raw: unknown): ConsultantReview | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const rating = Number(raw.rating);
  if (!Number.isFinite(id)) {
    return null;
  }
  return {
    id,
    rating: Number.isFinite(rating) ? rating : 0,
    comment: typeof raw.comment === 'string' ? raw.comment : null,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : '',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
    userName: typeof raw.userName === 'string' ? raw.userName : null,
    userEmail: typeof raw.userEmail === 'string' ? raw.userEmail : null,
    bookingName: typeof raw.bookingName === 'string' ? raw.bookingName : null,
    bookingDate: typeof raw.bookingDate === 'string' ? raw.bookingDate : null,
    slotTime: typeof raw.slotTime === 'string' ? raw.slotTime : null,
  };
}

export function parseConsultantReviewsPage(raw: unknown): ConsultantReviewsPage {
  if (!isRecord(raw)) {
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
  const dataRaw = raw.data;
  const metaRaw = raw.meta;
  const data = Array.isArray(dataRaw)
    ? dataRaw.map(parseConsultantReview).filter((r): r is ConsultantReview => r != null)
    : [];
  const meta = isRecord(metaRaw)
    ? {
        total: Number(metaRaw.total),
        page: Number(metaRaw.page),
        limit: Number(metaRaw.limit),
        totalPages: Number(metaRaw.totalPages),
      }
    : { total: data.length, page: 1, limit: 10, totalPages: 1 };
  return { data, meta };
}
