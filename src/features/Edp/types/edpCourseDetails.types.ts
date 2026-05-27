export interface EdpCourseDetailHeader {
  id: number;
  name: string;
  slug: string;
  hindi_name?: string;
  total_duration?: string;
  url?: string | null;
  mandatory_percentage?: number;
  e_videos_count?: number;
  e_documents_count?: number;
  key_highlights?: unknown[];
}

export interface EdpCourseDetailContentItem {
  id: number;
  title: string;
  hindi_title?: string;
  url?: string | null;
  hindi_url?: string | null;
  external_url?: string | null;
  document_url?: string | null;
  file?: string | null;
  file_hindi?: string | null;
  duration?: string | null;
  duration_hindi?: string | null;
  total_pages?: string | null;
  type?: string | null;
  status?: string | null;
}

export interface EdpCourseDetailSubSubCategory {
  id: number;
  category_id: number;
  sub_category_id: number;
  name: string;
  hindi_name?: string;
  slug?: string;
  e_videos_count?: number;
  e_documents_count?: number;
  edp_content?: EdpCourseDetailContentItem[];
}

export interface EdpCourseDetailRelated {
  id: number;
  name: string;
  hindi_name?: string;
  slug: string;
  thumbnail?: string | null;
  url?: string | null;
  total_duration?: string;
  e_videos_count?: number;
  e_documents_count?: number;
}

export interface EdpCourseDetailsResponse {
  edpCourseDetail: EdpCourseDetailHeader;
  edpSubSubCategories: EdpCourseDetailSubSubCategory[];
  edpRelatedCourses: EdpCourseDetailRelated[];
  total_watch_time?: string | number;
}

export type EdpModuleLang = 'en' | 'hi';

export type EdpModuleLessonStatus = 'available' | 'active';

export interface EdpModuleLessonRow {
  id: string;
  topicId: number;
  categoryId: number;
  title: string;
  duration: string;
  badgeLabel: string;
  videoUrl: string | null;
  pdfUrl: string | null;
  status: EdpModuleLessonStatus;
}
