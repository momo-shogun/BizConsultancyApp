/** IID / `GET /frontend/edp/faqs` item shape (matches web `EdpFaqItem`). */
export interface EdpFaqItem {
  id: number;
  title: string;
  description: string;
  video_url?: string | null;
  faq_type?: string | null;
  faq_service_id?: number | null;
}

export interface EdpFaqsResponse {
  faqs: EdpFaqItem[];
}
