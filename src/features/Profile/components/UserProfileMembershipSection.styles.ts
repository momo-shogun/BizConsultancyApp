import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

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
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
    overflow: 'hidden',
    ...CARD_SHADOW,
    marginBottom: THEME.spacing[20],
  },
  planHero: {
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[14],
    gap: 10,
  },
  planHeroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  planHeroLeft: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  planEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.82)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  planName: {
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.35,
  },
  planMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  planMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  planMetaChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  statusPillExpired: {
    backgroundColor: 'rgba(15,23,42,0.25)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusPillTextExpired: {
    color: '#E2E8F0',
  },
  body: {
    padding: THEME.spacing[14],
    gap: THEME.spacing[12],
  },
  progressBlock: {
    gap: 6,
  },
  progressMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    borderRadius: 999,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#92400E',
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.1,
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitChip: {
    width: '48%',
    flexGrow: 1,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: '#F8FAFC',
  },
  benefitChipSuccess: {
    borderColor: 'rgba(5,150,105,0.25)',
    backgroundColor: '#F0FDF4',
  },
  benefitChipDanger: {
    borderColor: 'rgba(239,68,68,0.22)',
    backgroundColor: '#FEF2F2',
  },
  benefitChipPending: {
    borderColor: 'rgba(217,119,6,0.25)',
    backgroundColor: '#FFFBEB',
  },
  benefitIconWrap: {
    marginTop: 1,
  },
  benefitTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  benefitTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    lineHeight: 16,
  },
  benefitStatus: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  emptyBenefits: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#059669',
  },
  upgradeBtnPressed: {
    opacity: 0.9,
  },
  upgradeBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingCard: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[14],
  },
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
  retryBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: SLATE_LINE,
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  emptyHero: {
    padding: THEME.spacing[14],
    gap: 8,
  },
  emptyTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 17,
  },
  teaserScroll: {
    paddingHorizontal: THEME.spacing[14],
    paddingBottom: THEME.spacing[4],
    gap: 10,
  },
  teaserCard: {
    width: 168,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  teaserPopular: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  teaserPopularText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  teaserIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teaserName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.15,
    paddingRight: 48,
  },
  teaserPrice: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  teaserMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  teaserPerks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  teaserPerksText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  emptyFooter: {
    paddingHorizontal: THEME.spacing[14],
    paddingBottom: THEME.spacing[14],
    gap: THEME.spacing[10],
  },
});
