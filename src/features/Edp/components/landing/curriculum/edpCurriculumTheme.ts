import { THEME } from '@/constants/theme';

/** Course-platform palette aligned with app primary green. */
export const EDP_CURRICULUM_THEME = {
  canvas: '#F4F6F8',
  card: THEME.colors.white,
  cardBorder: '#E8ECF1',
  headerExpanded: '#F0FDF6',
  primary: THEME.colors.primary,
  primarySoft: '#E8F5EE',
  primaryMuted: '#D1FAE5',
  text: THEME.colors.textPrimary,
  textMuted: THEME.colors.textSecondary,
  chipBg: '#F1F5F9',
  chipText: '#475569',
  lectureIcon: '#0F5132',
  divider: '#EEF2F6',
  shadow: 'rgba(15, 81, 50, 0.08)',
} as const;
