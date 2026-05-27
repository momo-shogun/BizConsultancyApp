import type {
  EdpCourseDetailContentItem,
  EdpCourseDetailRelated,
  EdpCourseDetailSubSubCategory,
  EdpCourseDetailsResponse,
  EdpModuleLang,
  EdpModuleLessonRow,
} from '../types/edpCourseDetails.types';

import { resolveIidAssetUrl } from './edpMedia';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Trim slug from route or catalogue (`module-i-edp-programme-orientations`). */
export function normalizeEdpModuleSlug(slug: string): string {
  try {
    return decodeURIComponent(slug).trim();
  } catch {
    return slug.trim();
  }
}

/** Some gateways wrap IID JSON as `{ data: { edpCourseDetail, … } }`. */
export function unwrapEdpCourseDetailsPayload(response: unknown): unknown {
  if (!isRecord(response)) {
    return response;
  }
  if ('edpCourseDetail' in response) {
    return response;
  }
  const data = response.data;
  if (isRecord(data) && 'edpCourseDetail' in data) {
    return data;
  }
  return response;
}

function readString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed === 'null') {
    return undefined;
  }
  return trimmed;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function parseContentItem(value: unknown): EdpCourseDetailContentItem | null {
  if (!isRecord(value)) {
    return null;
  }
  const id = readNumber(value.id);
  const title = readString(value.title);
  if (id == null || title == null) {
    return null;
  }
  return {
    id,
    title,
    hindi_title: readString(value.hindi_title),
    url: readString(value.url) ?? null,
    hindi_url: readString(value.hindi_url) ?? null,
    external_url: readString(value.external_url) ?? null,
    document_url: readString(value.document_url) ?? null,
    file: readString(value.file) ?? null,
    file_hindi: readString(value.file_hindi) ?? null,
    duration: readString(value.duration) ?? null,
    duration_hindi: readString(value.duration_hindi) ?? null,
    total_pages: readString(value.total_pages) ?? null,
    type: readString(value.type) ?? null,
    status: readString(value.status) ?? null,
  };
}

function parseSubSubCategory(value: unknown): EdpCourseDetailSubSubCategory | null {
  if (!isRecord(value)) {
    return null;
  }
  const id = readNumber(value.id);
  const categoryId = readNumber(value.category_id);
  const subCategoryId = readNumber(value.sub_category_id);
  const name = readString(value.name);
  if (id == null || categoryId == null || subCategoryId == null || name == null) {
    return null;
  }
  const contentRaw = Array.isArray(value.edp_content) ? value.edp_content : [];
  const edp_content = contentRaw
    .map((item) => parseContentItem(item))
    .filter((item): item is EdpCourseDetailContentItem => item != null);
  return {
    id,
    category_id: categoryId,
    sub_category_id: subCategoryId,
    name,
    hindi_name: readString(value.hindi_name),
    slug: readString(value.slug),
    e_videos_count: readNumber(value.e_videos_count),
    e_documents_count: readNumber(value.e_documents_count),
    edp_content,
  };
}

function parseCourseHeader(value: unknown): EdpCourseDetailHeader | null {
  if (!isRecord(value)) {
    return null;
  }
  const id = readNumber(value.id);
  const name = readString(value.name);
  const slug = readString(value.slug);
  if (id == null || name == null || slug == null) {
    return null;
  }
  return {
    id,
    name,
    slug,
    hindi_name: readString(value.hindi_name),
    total_duration: readString(value.total_duration),
    url: readString(value.url) ?? null,
    mandatory_percentage: readNumber(value.mandatory_percentage),
    e_videos_count: readNumber(value.e_videos_count),
    e_documents_count: readNumber(value.e_documents_count),
    key_highlights: Array.isArray(value.key_highlights) ? value.key_highlights : [],
  };
}

function parseRelatedCourse(value: unknown): EdpCourseDetailRelated | null {
  if (!isRecord(value)) {
    return null;
  }
  const id = readNumber(value.id);
  const name = readString(value.name);
  const slug = readString(value.slug);
  if (id == null || name == null || slug == null) {
    return null;
  }
  return {
    id,
    name,
    hindi_name: readString(value.hindi_name),
    slug,
    thumbnail: readString(value.thumbnail) ?? null,
    url: readString(value.url) ?? null,
    total_duration: readString(value.total_duration),
    e_videos_count: readNumber(value.e_videos_count),
    e_documents_count: readNumber(value.e_documents_count),
  };
}

export function parseEdpCourseDetailsResponse(response: unknown): EdpCourseDetailsResponse | null {
  if (!isRecord(response)) {
    return null;
  }
  const course = parseCourseHeader(response.edpCourseDetail);
  if (course == null) {
    return null;
  }
  const subsRaw = Array.isArray(response.edpSubSubCategories) ? response.edpSubSubCategories : [];
  const relatedRaw = Array.isArray(response.edpRelatedCourses) ? response.edpRelatedCourses : [];
  const edpSubSubCategories = subsRaw
    .map((item) => parseSubSubCategory(item))
    .filter((item): item is EdpCourseDetailSubSubCategory => item != null);
  const edpRelatedCourses = relatedRaw
    .map((item) => parseRelatedCourse(item))
    .filter((item): item is EdpCourseDetailRelated => item != null);
  return {
    edpCourseDetail: course,
    edpSubSubCategories,
    edpRelatedCourses,
    total_watch_time: readNumber(response.total_watch_time) ?? readString(response.total_watch_time),
  };
}

export function pickEdpVideoUrl(
  content: EdpCourseDetailContentItem,
  lang: EdpModuleLang,
): string | null {
  const raw = lang === 'en' ? content.url : content.hindi_url ?? content.url;
  return raw?.trim() ?? null;
}

export function pickEdpPdfPath(
  content: EdpCourseDetailContentItem,
  lang: EdpModuleLang,
): string | null {
  const raw = lang === 'en' ? content.file : content.file_hindi ?? content.file;
  return raw?.trim() ?? null;
}

export function pickEdpDuration(
  content: EdpCourseDetailContentItem,
  lang: EdpModuleLang,
): string {
  const raw = lang === 'en' ? content.duration : content.duration_hindi ?? content.duration;
  return raw?.trim() ?? '';
}

function extractBadgeLabel(name: string): string {
  const match = name.trim().match(/^(\d+(?:\.\d+)?)/);
  return match?.[1] ?? '';
}

/** `HH:MM:SS` → total seconds for progress denominator. */
export function parseMysqlTimeToSeconds(value: string | undefined): number {
  if (value == null || value.trim().length === 0) {
    return 0;
  }
  const parts = value.split(':').map((part) => Number(part.trim()));
  if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export function formatMinutesLabel(totalSeconds: number): string {
  const minutes = Math.max(0, Math.floor(totalSeconds / 60));
  return `${minutes}m`;
}

export function mapEdpModuleLessons(
  subs: EdpCourseDetailSubSubCategory[],
  lang: EdpModuleLang,
  activeVideoUrl: string | null,
): EdpModuleLessonRow[] {
  return subs.flatMap((topic) => {
    const content = topic.edp_content?.[0];
    if (content == null) {
      return [];
    }
    const videoUrl = pickEdpVideoUrl(content, lang);
    const pdfPath = pickEdpPdfPath(content, lang);
    const title =
      lang === 'en'
        ? content.title
        : (content.hindi_title?.trim() ?? content.title);
    const topicTitle =
      lang === 'en' ? topic.name : (topic.hindi_name?.trim() ?? topic.name);
    const duration = pickEdpDuration(content, lang);
    const badgeLabel = extractBadgeLabel(topicTitle);
    const isActive =
      activeVideoUrl != null &&
      videoUrl != null &&
      activeVideoUrl.trim() === videoUrl.trim();
    return [
      {
        id: `${topic.id}-${content.id}`,
        topicId: topic.id,
        categoryId: topic.category_id,
        title,
        duration,
        badgeLabel,
        videoUrl,
        pdfUrl: pdfPath != null ? resolveIidAssetUrl(pdfPath) : null,
        status: isActive ? 'active' : 'available',
      },
    ];
  });
}

export function computeEdpModuleProgress(
  detail: EdpCourseDetailsResponse,
): {
  progressPercent: number;
  spentSeconds: number;
  totalDurationSeconds: number;
  spentLabel: string;
  remainingLabel: string;
} {
  const course = detail.edpCourseDetail;
  const subs = detail.edpSubSubCategories;
  const videoCount = course.e_videos_count ?? 0;
  const totalPieces = subs.reduce((acc, sub) => acc + (sub.edp_content?.length ?? 0), 0);
  const fromCourse = parseMysqlTimeToSeconds(course.total_duration);
  const estMinutes =
    fromCourse > 0
      ? Math.ceil(fromCourse / 60)
      : Math.max(20, videoCount * 12 + totalPieces * 8);
  const totalDurationSeconds =
    fromCourse > 0 ? fromCourse : Math.max(20 * 60, estMinutes * 60);
  const spentRaw = detail.total_watch_time;
  const spentSeconds =
    typeof spentRaw === 'number'
      ? Math.max(0, spentRaw)
      : typeof spentRaw === 'string'
        ? Math.max(0, Number(spentRaw) || 0)
        : 0;
  const progressPercent =
    totalDurationSeconds > 0
      ? Math.min(100, Math.round((spentSeconds / totalDurationSeconds) * 100))
      : 0;
  const spentMinutes = Math.floor(spentSeconds / 60);
  const plannedMinutes = Math.max(1, Math.ceil(totalDurationSeconds / 60));
  const leftMinutes = Math.max(0, plannedMinutes - spentMinutes);
  return {
    progressPercent,
    spentSeconds,
    totalDurationSeconds,
    spentLabel: formatMinutesLabel(spentSeconds),
    remainingLabel: `${leftMinutes}m`,
  };
}
