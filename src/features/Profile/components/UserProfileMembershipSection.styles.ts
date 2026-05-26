import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const SLATE_LINE = '#E2E8F0';
const EMERALD = '#059669';
const EMERALD_SOFT = 'rgba(5,150,105,0.1)';

const CARD_SHADOW_RESET = Platform.select({
  ios: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  android: { elevation: 0 },
  default: {},
});

export const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
    padding: THEME.spacing[14],
    ...CARD_SHADOW_RESET,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[10],
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 17,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: EMERALD_SOFT,
  },
  statusPillExpired: {
    backgroundColor: '#F1F5F9',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: EMERALD,
  },
  statusPillTextExpired: {
    color: '#475569',
  },
  progressBlock: {
    marginTop: THEME.spacing[12],
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
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: EMERALD,
  },
  hintBox: {
    marginTop: THEME.spacing[10],
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
  benefitsBlock: {
    marginTop: THEME.spacing[14],
    gap: 8,
  },
  benefitsTitle: {
    fontSize: THEME.typography.size[13],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  benefitTitle: {
    fontSize: THEME.typography.size[13],
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
  },
  benefitStatus: {
    fontSize: 11,
    color: '#64748B',
  },
  emptyBenefits: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  upgradeBtn: {
    marginTop: THEME.spacing[14],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: EMERALD,
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
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
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
});
