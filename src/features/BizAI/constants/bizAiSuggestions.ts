export type BizAiSuggestion = {
  id: string;
  label: string;
  prompt: string;
  icon:
    | 'business-outline'
    | 'document-text-outline'
    | 'shield-checkmark-outline'
    | 'trending-up-outline'
    | 'school-outline'
    | 'cash-outline'
    | 'ribbon-outline'
    | 'bulb-outline'
    | 'people-outline';
};

export const BIZ_AI_GREETINGS = [
  'What can I help you with today?',
  'Ask anything about your business setup.',
  'Your consultancy copilot is ready.',
] as const;

/** Starter prompts aligned with portal `ChatWidget` DEFAULT_SUGGESTIONS. */
export const BIZ_AI_SUGGESTIONS: BizAiSuggestion[] = [
  {
    id: 'portal-services',
    label: 'Portal services',
    prompt:
      'What registrations, licences, and compliance services can I apply for on this portal?',
    icon: 'document-text-outline',
  },
  {
    id: 'portal-consultant',
    label: 'Book consultant',
    prompt: 'How can I find and book the right consultant for my industry?',
    icon: 'people-outline',
  },
  {
    id: 'portal-membership',
    label: 'Membership plans',
    prompt: 'What membership plans are available for users and consultants?',
    icon: 'ribbon-outline',
  },
  {
    id: 'portal-workshops',
    label: 'Workshops',
    prompt: 'What workshops/webinars are available, and how do I book one?',
    icon: 'school-outline',
  },
];

export const BIZ_AI_RELATED_FALLBACK = [
  'What can I do in My Services, My Locker, and the document vault?',
  'How do I book a consultant or a workshop?',
  'How does wallet and membership work on the portal?',
] as const;

export const BIZ_AI_SHORTCUTS = [
  { id: 'services', label: 'Browse services', icon: 'grid-outline' as const },
  { id: 'experts', label: 'Talk to experts', icon: 'people-outline' as const },
  { id: 'compliance', label: 'Compliance scan', icon: 'scan-outline' as const },
] as const;
