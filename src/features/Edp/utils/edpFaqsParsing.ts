import type { EdpFaqItem, EdpFaqsResponse } from '../types/edpFaqs.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseEdpFaqItem(raw: unknown): EdpFaqItem | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : Number(raw.id);
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const description = typeof raw.description === 'string' ? raw.description.trim() : '';
  if (!Number.isFinite(id) || title.length === 0) {
    return null;
  }
  return {
    id,
    title,
    description,
    video_url: typeof raw.video_url === 'string' ? raw.video_url : null,
    faq_type: typeof raw.faq_type === 'string' ? raw.faq_type : null,
    faq_service_id:
      typeof raw.faq_service_id === 'number'
        ? raw.faq_service_id
        : raw.faq_service_id != null
          ? Number(raw.faq_service_id)
          : null,
  };
}

export function parseEdpFaqsResponse(raw: unknown): EdpFaqsResponse {
  if (!isRecord(raw) || !Array.isArray(raw.faqs)) {
    return { faqs: [] };
  }
  const faqs: EdpFaqItem[] = [];
  for (const row of raw.faqs) {
    const item = parseEdpFaqItem(row);
    if (item != null) {
      faqs.push(item);
    }
  }
  return { faqs };
}
