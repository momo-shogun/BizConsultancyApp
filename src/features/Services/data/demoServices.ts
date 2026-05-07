import type { RecommendedServiceItem } from '@/shared/components';

export const DEMO_SERVICES: RecommendedServiceItem[] = [
  {
    id: 'svc-plc',
    slug: 'private-limited-company-incorporation',
    headerRight: 'Expert-led',
    categoryLabel: 'Business incorporation',
    title: 'Private Limited Company Incorporation',
    summary:
      'Incorporate your Pvt Ltd with DSC, DIN, MOA/AOA and MCA filing—guided by verified experts.',
    badgeLabel: 'Popular',
    priceLabel: 'From ₹9,999',
    headerStyleIndex: 0,
  },
  {
    id: 'svc-gst',
    slug: 'gst-registration',
    headerRight: '2–4 weeks',
    categoryLabel: 'Tax & compliance',
    title: 'GST Registration',
    summary:
      'Get GSTIN for your business with document prep and compliance hand-holding from day one.',
    badgeLabel: 'Verified',
    priceLabel: 'From ₹1,499',
    headerStyleIndex: 1,
  },
  {
    id: 'svc-tm',
    slug: 'trademark-registration',
    headerRight: 'MCA ready',
    categoryLabel: 'IP & legal',
    title: 'Trademark Registration',
    summary: 'Protect your brand with search, filing, and expert follow-up through registration.',
    badgeLabel: 'Trending',
    priceLabel: 'From ₹5,999',
    headerStyleIndex: 2,
  },
];

export interface ServiceDetailExtras {
  overview: string;
  included: string[];
  howItWorks: string[];
}

const DEFAULT_EXTRAS: ServiceDetailExtras = {
  overview:
    'Our consultants guide you end-to-end with clear timelines, document checklists, and compliance-ready deliverables. You get a single point of contact and milestone-based updates.',
  included: [
    'Discovery call to confirm scope',
    'Document checklist and templates',
    'Expert review before submission',
    'Status updates at key milestones',
  ],
  howItWorks: [
    'Share your business details securely',
    'We prepare filings and coordinate signatures',
    'Track progress in-app until completion',
  ],
};

const EXTRAS_BY_SLUG: Partial<Record<string, ServiceDetailExtras>> = {
  'private-limited-company-incorporation': {
    overview:
      'Form a Private Limited Company with DSC, DIN, MOA/AOA drafting, and MCA filing. Ideal for founders who want limited liability and a scalable shareholding structure.',
    included: [
      'Name approval and incorporation filing support',
      'MOA/AOA drafting aligned to your objects',
      'PAN application guidance for the company',
      'Post-incorporation compliance checklist',
    ],
    howItWorks: [
      'Confirm directors, capital, and registered office',
      'Complete KYC and obtain DSC for directors',
      'File SPICe+ and track MCA approval',
      'Receive COI and next-step compliance roadmap',
    ],
  },
  'gst-registration': {
    overview:
      'Obtain GSTIN with correct HSN/SAC mapping and place-of-supply clarity. Suited for new registrations and businesses crossing the threshold.',
    included: [
      'Eligibility and turnover assessment',
      'Document preparation and portal filing',
      'Clarifications on state and place of supply',
      'Basic post-registration compliance pointers',
    ],
    howItWorks: [
      'Share business constitution and address proof',
      'We validate documents and file on the GST portal',
      'Respond to queries if raised by the department',
      'Hand over GSTIN and a short compliance calendar',
    ],
  },
  'trademark-registration': {
    overview:
      'Protect your brand identity with trademark search, class selection, and filing support. Reduce objection risk with structured drafting and expert review.',
    included: [
      'Knock-out search and class recommendation',
      'Application drafting and owner particulars',
      'Filing and acknowledgment tracking',
      'Basic guidance on objections and next steps',
    ],
    howItWorks: [
      'Share logo/word mark and business description',
      'We shortlist classes and run a preliminary search',
      'File the application and monitor status',
      'Advise on examination reports if they arise',
    ],
  },
};

export function getServiceDetailExtras(slug: string): ServiceDetailExtras {
  const specific = EXTRAS_BY_SLUG[slug];
  return specific != null ? specific : DEFAULT_EXTRAS;
}
