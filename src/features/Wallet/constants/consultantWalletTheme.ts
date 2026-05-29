import {
  ACCOUNT_HUB_GREEN_HEADER_GRADIENT,
  ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR,
  ACCOUNT_HUB_LIST_CANVAS,
} from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';

export const CONSULTANT_WALLET_CANVAS = ACCOUNT_HUB_LIST_CANVAS;
export const CONSULTANT_WALLET_HEADER_GRADIENT = ACCOUNT_HUB_GREEN_HEADER_GRADIENT;
export const CONSULTANT_WALLET_HEADER_STATUS_BAR = ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR;
/** Gradient card on withdrawals / transaction sub-screens */
export const CONSULTANT_WALLET_GRADIENT = ACCOUNT_HUB_GREEN_HEADER_GRADIENT;

export const CONSULTANT_WALLET_LAYOUT = {
  screenPaddingH: THEME.spacing[16],
  screenPaddingTop: THEME.spacing[12],
  screenPaddingBottom: THEME.spacing[32],
  sectionGap: THEME.spacing[20],
  cardRadius: 20,
  cardPadding: THEME.spacing[20],
} as const;
