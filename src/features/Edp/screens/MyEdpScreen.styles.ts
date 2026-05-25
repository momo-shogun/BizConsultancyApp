import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const MY_EDP_CANVAS = '#F8FAFC';
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

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: MY_EDP_CANVAS,
  },
  scrollContent: {
    padding: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[14],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
  },
  hero: {
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    backgroundColor: THEME.colors.primary,
    ...CARD_SHADOW,
  },
  heroTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    letterSpacing: -0.2,
  },
  heroSubtitle: {
    marginTop: THEME.spacing[4],
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 17,
  },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
    ...CARD_SHADOW,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius[12],
    backgroundColor: 'rgba(15,81,50,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleBlock: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  cardDesc: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  activeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(5,150,105,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.25)',
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#047857',
  },
  detailLine: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  amountLine: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
  },
  primaryBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
  },
  outlineBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    padding: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.22)',
  },
  infoText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: '#92400E',
    lineHeight: 17,
  },
  errorText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.danger,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
  },
  retryText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
});
