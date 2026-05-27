/** IID catalogue row (`edp_list`). */
export interface EdpCourseSummary {
  id: number;
  name: string;
  hindi_name?: string;
  slug: string;
  total_duration?: string;
  mandatory_percentage?: number;
  progress?: string;
  e_documents_count?: number;
  e_videos_count?: number;
}

export interface EdpContentItem {
  id: number;
  title: string;
  hindi_title?: string;
  file?: string;
}

export interface EdpFreeSubSubCategory {
  id: number;
  name: string;
  hindi_name?: string;
  slug?: string;
  sub_category_id?: number;
  edp_content?: EdpContentItem[];
}

/** Free module tree for programme overview (`freeEdps`). */
export interface EdpFreeEdpModule {
  id: number;
  name: string;
  hindi_name?: string;
  slug?: string;
  url?: string;
  thumbnail?: string;
  total_duration?: string;
  mandatory_percentage?: number;
  progress?: string;
  e_documents_count?: number;
  e_videos_count?: number;
  sub_sub_category?: EdpFreeSubSubCategory[];
}

export interface EdpCoursesWithDocumentsResponse {
  edp_list: EdpCourseSummary[];
  freeEdps?: EdpFreeEdpModule[];
  totalmodule?: number;
  totaldocument?: number;
  totalVideos?: number;
  amount?: number;
  edp_amount?: number;
  price?: number;
}
