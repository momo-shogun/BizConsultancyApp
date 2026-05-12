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
    key: 'IdealFor',
    label: 'Ideal For',
  },
  {
    key: 'compliance',
    label: 'Compliance',
  },
  {
    key: 'faqs',
    label: 'FAQs',
  },
  {
    key: '123',
    label: '123',
  },
] as const;

export type DetailTabKey = (typeof SERVICE_TABS)[number]['key'];