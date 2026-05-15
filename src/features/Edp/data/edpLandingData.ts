import { COLORS } from '@/constants/colors';
import type { EdpMetricCardItem } from '@/shared/components/cards/EdpMetricCard/EdpMetricCard';
import type { EdpModuleCardItem } from '@/shared/components/cards/EdpModuleCard/EdpModuleCard';
import type { EdpProgressMetaItem } from '@/shared/components/cards/EdpProgressCard/EdpProgressCard';
import type { EdpJourneyStep } from '@/shared/components/cards/EdpLearningJourneyCard/EdpLearningJourneyCard';
import type { EdpStatsStripItem } from '@/shared/components/cards/EdpStatsStrip/EdpStatsStrip';

export const EDP_HERO_BG = COLORS.primary;
export const EDP_ACCENT_GREEN = COLORS.accentGreen;
export const EDP_ACCENT_AMBER = COLORS.accentAmber;
export const EDP_ACCENT_BLUE = COLORS.accentBlue;
export const EDP_ACCENT_PURPLE = COLORS.accentPurple;

export const EDP_STRIP_STATS: EdpStatsStripItem[] = [
  { label: 'Hours', value: '100+' },
  { label: 'Modules', value: '8' },
  { label: 'Resources', value: '23' },
  { label: 'Assessments', value: '5' },
];

export const EDP_METRIC_ITEMS: EdpMetricCardItem[] = [
  { label: 'Video lectures', value: '48', icon: '▶', accent: EDP_ACCENT_GREEN },
  { label: 'PDF resources', value: '23', icon: '⊞', accent: EDP_ACCENT_AMBER },
  { label: 'Modules', value: '8', icon: '◈', accent: EDP_ACCENT_BLUE },
  { label: 'Assessments', value: '5', icon: '✦', accent: EDP_ACCENT_PURPLE },
];

export const EDP_MODULE_ITEMS: EdpModuleCardItem[] = [
  {
    id: 'm1',
    name: 'Module I — Programme intro',
    icon: '✓',
    lessons: 5,
    duration: '45 min',
    progress: 100,
    status: 'done',
    accent: EDP_ACCENT_GREEN,
  },
  {
    id: 'm2',
    name: 'Module II — Business basics',
    icon: '▶',
    lessons: 8,
    duration: '1.2 hrs',
    progress: 60,
    status: 'active',
    accent: EDP_ACCENT_BLUE,
  },
  {
    id: 'm3',
    name: 'Module III — Compliance & GST',
    icon: '⊠',
    lessons: 8,
    duration: '1.5 hrs',
    progress: 0,
    status: 'locked',
    accent: '#4B5563',
  },
  {
    id: 'm4',
    name: 'Module IV — Financial planning',
    icon: '⊠',
    lessons: 9,
    duration: '1.8 hrs',
    progress: 0,
    status: 'locked',
    accent: '#4B5563',
  },
];

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

export const EDP_FAQ_ITEMS: { id: string; question: string; answer: string }[] = [
  {
    id: 'f1',
    question: 'What is the EDP programme duration?',
    answer:
      'The programme is self-paced. Most learners complete it in 3–6 months depending on their schedule and prior knowledge.',
  },
  {
    id: 'f2',
    question: 'Is certification government recognised?',
    answer:
      'Yes. Completion leads to a government-recognised certificate issued by IID under the national entrepreneurship framework.',
  },
  {
    id: 'f3',
    question: 'Can I access content offline?',
    answer:
      'PDF resources are available for download. Video lectures require an internet connection for streaming.',
  },
  {
    id: 'f4',
    question: 'How are assessments graded?',
    answer:
      'Assessments are auto-graded. A minimum score of 60% is required to unlock the next module.',
  },
];

export const EDP_PROGRESS_META: EdpProgressMetaItem[] = [
  { value: '28 min', label: 'Time spent' },
  { value: '2 / 8', label: 'Modules done' },
  { value: '3 / 5', label: 'Assessments' },
];
