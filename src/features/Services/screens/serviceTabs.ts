import type { PremiumTabIconName } from '@/shared/components/navigation/PremiumHorizontalTabBar';

/**
 * Fixed service detail tabs (order and labels match product design).
 * API sections map by `key` — see ServiceDetailScreen tab content.
 */
export const SERVICE_DETAIL_TABS = [
  { key: 'about', label: 'About Us', apiSection: 'about', icon: 'information-circle-outline' },
  /** UI: Prerequisites — content from API `eligibility` */
  {
    key: 'eligibility',
    label: 'Prerequisites',
    apiSection: 'eligibility',
    icon: 'checkmark-done-outline',
  },
  { key: 'benefits', label: 'Key Benefits', apiSection: 'benefits', icon: 'ribbon-outline' },
  { key: 'idealFor', label: 'Ideal For', apiSection: 'idealFor', icon: 'people-outline' },
  { key: 'documents', label: 'Documents', apiSection: 'documents', icon: 'document-text-outline' },
  { key: 'process', label: 'Key Steps', apiSection: 'process', icon: 'git-network-outline' },
  { key: 'compliance', label: 'Compliance', apiSection: 'compliance', icon: 'shield-checkmark-outline' },
  { key: 'faqs', label: 'FAQ', apiSection: 'faqs', icon: 'help-circle-outline' },
] as const satisfies ReadonlyArray<{
  key: string;
  label: string;
  apiSection: string;
  icon: PremiumTabIconName;
}>;

export type DetailTabKey = (typeof SERVICE_DETAIL_TABS)[number]['key'];

/** @deprecated Use SERVICE_DETAIL_TABS — kept for any legacy imports */
export const SERVICE_TABS = SERVICE_DETAIL_TABS;
