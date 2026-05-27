import type {
  EdpContentItem,
  EdpCourseSummary,
  EdpCoursesWithDocumentsResponse,
  EdpFreeEdpModule,
  EdpFreeSubSubCategory,
} from '../types/edpCourses.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseEdpContentItem(raw: unknown): EdpContentItem | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : Number(raw.id);
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!Number.isFinite(id) || title.length === 0) {
    return null;
  }
  return {
    id,
    title,
    hindi_title: typeof raw.hindi_title === 'string' ? raw.hindi_title : undefined,
    file: typeof raw.file === 'string' ? raw.file : undefined,
  };
}

function parseSubSubCategory(raw: unknown): EdpFreeSubSubCategory | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : Number(raw.id);
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!Number.isFinite(id) || name.length === 0) {
    return null;
  }
  const edp_content: EdpContentItem[] = [];
  if (Array.isArray(raw.edp_content)) {
    for (const row of raw.edp_content) {
      const item = parseEdpContentItem(row);
      if (item != null) {
        edp_content.push(item);
      }
    }
  }
  return {
    id,
    name,
    hindi_name: typeof raw.hindi_name === 'string' ? raw.hindi_name : undefined,
    slug: typeof raw.slug === 'string' ? raw.slug : undefined,
    sub_category_id:
      typeof raw.sub_category_id === 'number' ? raw.sub_category_id : undefined,
    edp_content,
  };
}

function parseFreeEdpModule(raw: unknown): EdpFreeEdpModule | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : Number(raw.id);
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!Number.isFinite(id) || name.length === 0) {
    return null;
  }
  const sub_sub_category: EdpFreeSubSubCategory[] = [];
  if (Array.isArray(raw.sub_sub_category)) {
    for (const row of raw.sub_sub_category) {
      const sub = parseSubSubCategory(row);
      if (sub != null) {
        sub_sub_category.push(sub);
      }
    }
  }
  return {
    id,
    name,
    hindi_name: typeof raw.hindi_name === 'string' ? raw.hindi_name : undefined,
    slug: typeof raw.slug === 'string' ? raw.slug : undefined,
    url: typeof raw.url === 'string' ? raw.url : undefined,
    thumbnail: typeof raw.thumbnail === 'string' ? raw.thumbnail : undefined,
    total_duration: typeof raw.total_duration === 'string' ? raw.total_duration : undefined,
    mandatory_percentage:
      typeof raw.mandatory_percentage === 'number' ? raw.mandatory_percentage : undefined,
    progress: typeof raw.progress === 'string' ? raw.progress : undefined,
    e_documents_count:
      typeof raw.e_documents_count === 'number' ? raw.e_documents_count : undefined,
    e_videos_count: typeof raw.e_videos_count === 'number' ? raw.e_videos_count : undefined,
    sub_sub_category,
  };
}

function parseCourseSummary(raw: unknown): EdpCourseSummary | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : Number(raw.id);
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const slug = typeof raw.slug === 'string' ? raw.slug.trim() : '';
  if (!Number.isFinite(id) || name.length === 0 || slug.length === 0) {
    return null;
  }
  return {
    id,
    name,
    hindi_name: typeof raw.hindi_name === 'string' ? raw.hindi_name : undefined,
    slug,
    total_duration: typeof raw.total_duration === 'string' ? raw.total_duration : undefined,
    mandatory_percentage:
      typeof raw.mandatory_percentage === 'number' ? raw.mandatory_percentage : undefined,
    progress: typeof raw.progress === 'string' ? raw.progress : undefined,
    e_documents_count:
      typeof raw.e_documents_count === 'number' ? raw.e_documents_count : undefined,
    e_videos_count: typeof raw.e_videos_count === 'number' ? raw.e_videos_count : undefined,
  };
}

function parseOptionalCount(raw: unknown): number | undefined {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function parseEdpCoursesWithDocumentsResponse(
  raw: unknown,
): EdpCoursesWithDocumentsResponse {
  if (!isRecord(raw)) {
    return { edp_list: [], freeEdps: [] };
  }

  const edp_list: EdpCourseSummary[] = [];
  if (Array.isArray(raw.edp_list)) {
    for (const row of raw.edp_list) {
      const item = parseCourseSummary(row);
      if (item != null) {
        edp_list.push(item);
      }
    }
  }

  const freeEdps: EdpFreeEdpModule[] = [];
  if (Array.isArray(raw.freeEdps)) {
    for (const row of raw.freeEdps) {
      const item = parseFreeEdpModule(row);
      if (item != null) {
        freeEdps.push(item);
      }
    }
  }

  return {
    edp_list,
    freeEdps,
    totalmodule: parseOptionalCount(raw.totalmodule),
    totaldocument: parseOptionalCount(raw.totaldocument),
    totalVideos: parseOptionalCount(raw.totalVideos),
    amount: parseOptionalCount(raw.amount),
    edp_amount: parseOptionalCount(raw.edp_amount),
    price: parseOptionalCount(raw.price),
  };
}
