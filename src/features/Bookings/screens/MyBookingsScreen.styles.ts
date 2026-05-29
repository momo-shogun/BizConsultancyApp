import { StyleSheet } from 'react-native';

import {
  ACCOUNT_HUB_GREEN_HEADER_GRADIENT,
  ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR,
  ACCOUNT_HUB_LIST_CANVAS,
} from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';

/** WhatsApp-style chat list background */
export const BOOKINGS_CANVAS = ACCOUNT_HUB_LIST_CANVAS;

/** Matches "Your consultant sessions" hero card — status bar + header chrome */
export const BOOKINGS_HEADER_STATUS_BAR = ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR;
export const BOOKINGS_HEADER_GRADIENT = ACCOUNT_HUB_GREEN_HEADER_GRADIENT;
const WA_DIVIDER = '#E9EDEF';
const WA_MUTED = '#667781';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BOOKINGS_CANVAS,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[10],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[20],
    backgroundColor: BOOKINGS_CANVAS,
  },
  heroGradient: {
    borderRadius: 16,
    padding: THEME.spacing[14],
    gap: THEME.spacing[10],
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  heroIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextBlock: {
    flex: 1,
    gap: 3,
  },
  heroTitle: {
    fontSize: THEME.typography.size[17],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    letterSpacing: -0.2,
  },
  heroMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 16,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listBlock: {
    gap: THEME.spacing[8],
  },
  emptyBlock: {
    padding: THEME.spacing[28],
    alignItems: 'center',
    gap: THEME.spacing[10],
    backgroundColor: THEME.colors.white,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WA_DIVIDER,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(37,211,102,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: THEME.typography.size[15],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: THEME.typography.size[12],
    color: WA_MUTED,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: THEME.spacing[8],
  },
  linkBtn: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#25D366',
  },
  linkBtnText: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[10],
  },
  pageBtn: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WA_DIVIDER,
    backgroundColor: THEME.colors.white,
  },
  pageBtnDisabled: { opacity: 0.45 },
  pageBtnText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  pageLabel: {
    fontSize: 11,
    color: WA_MUTED,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: THEME.spacing[12],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.25)',
    backgroundColor: 'rgba(254,226,226,0.6)',
  },
  errorText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: THEME.colors.danger,
    lineHeight: 17,
  },
});
