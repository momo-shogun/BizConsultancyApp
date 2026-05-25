import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const CALL_HISTORY_CANVAS = '#F8FAFC';
const SLATE_LINE = '#E2E8F0';

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  android: { elevation: 2 },
  default: {},
});

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CALL_HISTORY_CANVAS,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[10],
    backgroundColor: CALL_HISTORY_CANVAS,
  },
  filterChip: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
  },
  filterChipActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(15,81,50,0.08)',
  },
  filterChipText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
  },
  filterChipTextActive: {
    color: THEME.colors.primary,
  },
  resultMeta: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[8],
    fontSize: 11,
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#64748B',
  },
  listContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[8],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    paddingVertical: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[12],
    ...CARD_SHADOW,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius[12],
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[4],
  },
  title: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  meta: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  consultant: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#475569',
  },
  trailing: {
    alignItems: 'flex-end',
    gap: THEME.spacing[4],
  },
  statusPill: {
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.bold as '700',
    textTransform: 'capitalize',
  },
  sessionId: {
    fontSize: 10,
    color: '#94A3B8',
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: THEME.spacing[4],
    alignSelf: 'flex-start',
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
  },
  rateText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#B45309',
  },
  reviewedText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.primary,
    marginTop: 2,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[24],
    paddingVertical: THEME.spacing[32],
  },
  stateText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
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
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15,81,50,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
