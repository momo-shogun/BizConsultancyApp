import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const HELP_SETTINGS_CANVAS = '#F8FAFC';
const SLATE_LINE = '#E2E8F0';

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
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
    paddingBottom: THEME.spacing[24],
  },
  sectionBlock: {
    marginTop: THEME.spacing[20],
    paddingHorizontal: THEME.spacing[16],
  },
  sectionBlockFirst: {
    marginTop: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[16],
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#64748B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing[8],
    marginLeft: THEME.spacing[4],
  },
  menuCard: {
    overflow: 'hidden',
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    ...CARD_SHADOW,
  },
  menuCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[14],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
  },
  menuCardItemLast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[14],
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius[12],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing[12],
  },
  menuTextGroup: {
    flex: 1,
    minWidth: 0,
    gap: THEME.spacing[4],
  },
  menuTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.15,
  },
  menuSubtitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.regular as '400',
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: THEME.spacing[8],
  },
  logoutContainer: {
    marginTop: THEME.spacing[28],
    paddingHorizontal: THEME.spacing[16],
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[14],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: 'rgba(229,72,77,0.35)',
    backgroundColor: THEME.colors.white,
    ...CARD_SHADOW,
  },
  logoutText: {
    color: THEME.colors.danger,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    letterSpacing: 0.1,
  },
  footer: {
    alignItems: 'center',
    paddingTop: THEME.spacing[24],
    paddingBottom: THEME.spacing[20],
    gap: THEME.spacing[8],
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  footerLink: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
  },
  footerDot: {
    color: '#CBD5E1',
    fontSize: THEME.typography.size[12],
  },
  footerVersion: {
    color: '#94A3B8',
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
  },
});
