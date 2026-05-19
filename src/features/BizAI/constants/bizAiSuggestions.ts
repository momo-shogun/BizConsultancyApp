export type BizAiSuggestion = {
  id: string;
  label: string;
  prompt: string;
  icon: 'business-outline' | 'document-text-outline' | 'shield-checkmark-outline' | 'trending-up-outline' | 'school-outline' | 'cash-outline' | 'ribbon-outline' | 'bulb-outline';
};

export const BIZ_AI_GREETINGS = [
  'What can I help you with today?',
  'Ask anything about your business setup.',
  'Your consultancy copilot is ready.',
] as const;

export const BIZ_AI_SUGGESTIONS: BizAiSuggestion[] = [
  {
    id: 'company-type',
    label: 'Best company type',
    prompt: 'Suggest the best company registration type for my business',
    icon: 'business-outline',
  },
  {
    id: 'gst',
    label: 'GST requirements',
    prompt: 'What GST requirements apply to my business?',
    icon: 'document-text-outline',
  },
  {
    id: 'licenses',
    label: 'Licenses needed',
    prompt: 'What licenses do I need to start operating?',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'tax-saving',
    label: 'Tax-saving options',
    prompt: 'Recommend tax-saving options for a small business',
    icon: 'cash-outline',
  },
  {
    id: 'compliance',
    label: 'Compliance checklist',
    prompt: 'Give me a business compliance checklist',
    icon: 'ribbon-outline',
  },
  {
    id: 'funding',
    label: 'Startup funding',
    prompt: 'Guide me on startup funding options in India',
    icon: 'trending-up-outline',
  },
  {
    id: 'trademark',
    label: 'Trademark help',
    prompt: 'How do I register a trademark for my brand?',
    icon: 'bulb-outline',
  },
  {
    id: 'msme',
    label: 'MSME benefits',
    prompt: 'What MSME benefits can my business claim?',
    icon: 'business-outline',
  },
  {
    id: 'edp',
    label: 'EDP programs',
    prompt: 'Which EDP program fits my business stage?',
    icon: 'school-outline',
  },
];

export const BIZ_AI_SHORTCUTS = [
  { id: 'services', label: 'Browse services', icon: 'grid-outline' as const },
  { id: 'experts', label: 'Talk to experts', icon: 'people-outline' as const },
  { id: 'compliance', label: 'Compliance scan', icon: 'scan-outline' as const },
] as const;
