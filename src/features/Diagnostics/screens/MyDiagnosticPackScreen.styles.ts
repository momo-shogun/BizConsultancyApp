import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';
import { DIAGNOSIS_THEME } from '../constants/diagnosisTheme';

export const PACK_CANVAS = '#F8FAFC';
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
    backgroundColor: PACK_CANVAS,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[16],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
    backgroundColor: PACK_CANVAS,
  },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    padding: THEME.spacing[16],
    ...CARD_SHADOW,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[12],
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius[12],
    backgroundColor: 'rgba(13,148,136,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleBlock: {
    flex: 1,
    minWidth: 0,
    gap: THEME.spacing[4],
  },
  cardTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  cardTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.25,
  },
  statusBadge: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(13,148,136,0.12)',
  },
  statusBadgeCompleted: {
    backgroundColor: 'rgba(5,150,105,0.12)',
  },
  statusBadgeDefault: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.bold as '700',
  },
  statusBadgeTextActive: {
    color: '#0F766E',
  },
  statusBadgeTextCompleted: {
    color: '#047857',
  },
  statusBadgeTextDefault: {
    color: '#475569',
  },
  cardSubtitle: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  progressBlock: {
    marginTop: THEME.spacing[14],
    gap: THEME.spacing[8],
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressValue: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: DIAGNOSIS_THEME.brandPrimary,
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    marginTop: THEME.spacing[12],
    padding: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
  },
  calloutNext: {
    borderColor: 'rgba(217,119,6,0.35)',
    backgroundColor: 'rgba(255,251,235,0.95)',
  },
  calloutUpgrade: {
    borderColor: 'rgba(13,148,136,0.35)',
    backgroundColor: 'rgba(240,253,250,0.95)',
  },
  calloutTitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  calloutBody: {
    marginTop: 2,
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  upgradeBtn: {
    marginTop: THEME.spacing[10],
    alignSelf: 'flex-start',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: 'rgba(13,148,136,0.4)',
    backgroundColor: THEME.colors.white,
  },
  upgradeBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#0D9488',
  },
  servicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[4],
  },
  servicesTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  servicesDesc: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
    marginBottom: THEME.spacing[12],
  },
  applyBtn: {
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    backgroundColor: DIAGNOSIS_THEME.brandPrimary,
  },
  applyBtnDisabled: {
    opacity: 0.45,
  },
  applyBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    paddingVertical: THEME.spacing[12],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: SLATE_LINE,
  },
  serviceRowFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  serviceText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  serviceTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  serviceMeta: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  requestBtn: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
    minWidth: 88,
    alignItems: 'center',
  },
  requestBtnDisabled: {
    opacity: 0.55,
  },
  requestBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  emptyServices: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    paddingVertical: THEME.spacing[8],
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: THEME.spacing[8],
    gap: THEME.spacing[12],
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(13,148,136,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  primaryBtn: {
    marginTop: THEME.spacing[4],
    paddingHorizontal: THEME.spacing[20],
    paddingVertical: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    backgroundColor: '#0D9488',
  },
  primaryBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  retryBtn: {
    marginTop: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
  },
  retryBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  errorText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.danger,
    textAlign: 'center',
    lineHeight: 20,
  },
});
