import { Platform, StyleSheet } from 'react-native';

import { ACCOUNT_SUBSCREEN_HEADER_COLOR } from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';

/** Status bar + ScreenHeader — matches account sub-screens (e.g. Biz AI credits) */
export const HELP_SETTINGS_HEADER_COLOR = ACCOUNT_SUBSCREEN_HEADER_COLOR;

export const HELP_SETTINGS_CANVAS = '#F1F5F9';

const SLATE_200 = '#E2E8F0';
const SLATE_500 = '#64748B';
const SLATE_700 = '#334155';
const SLATE_900 = '#0F172A';

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: SLATE_900,
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },
  android: { elevation: 3 },
  default: {},
});

export const helpSettingsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: HELP_SETTINGS_CANVAS,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  headerBand: {
    backgroundColor: HELP_SETTINGS_HEADER_COLOR,
  },
  heroStrip: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: HELP_SETTINGS_HEADER_COLOR,
    overflow: 'hidden',
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '500',
  },
  sectionBlock: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionBlockFirst: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: SLATE_900,
    letterSpacing: -0.25,
  },
  sectionCount: {
    minWidth: 26,
    height: 26,
    paddingHorizontal: 8,
    borderRadius: 13,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: SLATE_700,
  },
  menuCard: {
    overflow: 'hidden',
    backgroundColor: THEME.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: SLATE_200,
    ...CARD_SHADOW,
  },
  menuCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_200,
  },
  menuCardItemPressed: {
    backgroundColor: '#F8FAFC',
  },
  menuCardItemLast: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextGroup: {
    flex: 1,
    minWidth: 0,
    gap: 3,
    paddingRight: 8,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: SLATE_900,
    letterSpacing: -0.2,
  },
  menuSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: SLATE_500,
    lineHeight: 17,
  },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: SLATE_200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutContainer: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 72, 77, 0.28)',
    backgroundColor: '#FEF2F2',
    ...CARD_SHADOW,
  },
  logoutBtnPressed: {
    opacity: 0.9,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  footerCard: {
    marginHorizontal: 16,

    paddingHorizontal: 16,
    // backgroundColor: THEME.colors.white,
    // borderWidth: 1,
    // borderColor: SLATE_200,
    alignItems: 'center',
    gap: 10,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  footerLink: {
    color: SLATE_700,
    fontSize: 13,
    fontWeight: '600',
  },
  footerDot: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  footerVersion: {
    color: SLATE_500,
    fontSize: 12,
    fontWeight: '500',
  },
});
