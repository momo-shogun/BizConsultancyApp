export const SERVICE_TABS = [
  {
    key: 'about',
    label: 'Overview',
  },
  {
    key: 'ourPackage',
    label: 'Our Packages',
  },
  {
    key: 'process',
    label: 'How it works',
  },
  {
    key: 'documents',
    label: 'Documents',
  },
  {
    key: 'benefits',
    label: 'Benefits',
  },
  {
    key: 'eligibility',
    label: 'Eligibility',
  },
  {
    key: 'compliance',
    label: 'Compliance',
  },
  {
    key: 'faqs',
    label: 'FAQs',
  },
] as const;

export type DetailTabKey = (typeof SERVICE_TABS)[number]['key'];