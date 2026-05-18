/**
 * Fixed service detail tabs (order and labels match product design).
 * API sections map by `key` — see ServiceDetailScreen tab content.
 */
export const SERVICE_DETAIL_TABS = [
  { key: 'about', label: 'About Us', apiSection: 'about' },
  /** UI: Prerequisites — content from API `eligibility` */
  { key: 'eligibility', label: 'Prerequisites', apiSection: 'eligibility' },
  { key: 'benefits', label: 'Key Benefits', apiSection: 'benefits' },
  { key: 'idealFor', label: 'Ideal For', apiSection: 'idealFor' },
  { key: 'documents', label: 'Documents', apiSection: 'documents' },
  { key: 'process', label: 'Key Steps', apiSection: 'process' },
  { key: 'compliance', label: 'Compliance', apiSection: 'compliance' },
  { key: 'faqs', label: 'FAQ', apiSection: 'faqs' },
] as const;

export type DetailTabKey = (typeof SERVICE_DETAIL_TABS)[number]['key'];

/** @deprecated Use SERVICE_DETAIL_TABS — kept for any legacy imports */
export const SERVICE_TABS = SERVICE_DETAIL_TABS;
