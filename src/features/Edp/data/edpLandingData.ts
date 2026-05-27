import { COLORS } from '@/constants/colors';
import type { EdpProgressMetaItem } from '@/shared/components/cards/EdpProgressCard/EdpProgressCard';
import type { EdpJourneyStep } from '@/shared/components/cards/EdpLearningJourneyCard/EdpLearningJourneyCard';

export const EDP_HERO_BG = COLORS.primary;
export const EDP_ACCENT_GREEN = COLORS.accentGreen;
export const EDP_ACCENT_AMBER = COLORS.accentAmber;
export const EDP_ACCENT_BLUE = COLORS.accentBlue;
export const EDP_ACCENT_PURPLE = COLORS.accentPurple;

export const EDP_JOURNEY_STEPS: EdpJourneyStep[] = [
  {
    step: 1,
    title: 'Register & login',
    description: 'Create your account and access your personalised training dashboard.',
    accent: EDP_ACCENT_GREEN,
  },
  {
    step: 2,
    title: 'Start learning',
    description: 'Follow curated lectures and complete resources step by step.',
    accent: EDP_ACCENT_GREEN,
  },
  {
    step: 3,
    title: 'Get certified',
    description: 'Finish all module requirements and earn your government certification.',
    accent: EDP_ACCENT_AMBER,
  },
];

export const EDP_PROGRESS_META: EdpProgressMetaItem[] = [
  { value: '28 min', label: 'Time spent' },
  { value: '2 / 8', label: 'Modules done' },
  { value: '3 / 5', label: 'Assessments' },
];
