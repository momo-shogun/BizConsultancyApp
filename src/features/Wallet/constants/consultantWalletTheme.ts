import { PROFILE_CANVAS, PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';
import { THEME } from '@/constants/theme';

export const CONSULTANT_WALLET_CANVAS = PROFILE_CANVAS;
export const CONSULTANT_WALLET_GRADIENT = PROFILE_HEADER_GRADIENT;

export const CONSULTANT_WALLET_LAYOUT = {
  screenPaddingH: THEME.spacing[16],
  screenPaddingTop: THEME.spacing[12],
  screenPaddingBottom: THEME.spacing[32],
  sectionGap: THEME.spacing[20],
  cardRadius: 20,
  cardPadding: THEME.spacing[20],
} as const;
