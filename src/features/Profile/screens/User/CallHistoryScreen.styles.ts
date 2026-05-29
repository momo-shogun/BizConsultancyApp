import { StyleSheet } from 'react-native';

import { ACCOUNT_HUB_LIST_CANVAS } from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';

export const CALL_HISTORY_CANVAS = ACCOUNT_HUB_LIST_CANVAS;
const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CALL_HISTORY_CANVAS,
  },
  listContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[20],
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[20],
    paddingVertical: THEME.spacing[28],
  },
  listBlock: {
    backgroundColor: THEME.colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    overflow: 'hidden',
  },
  listHeader: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
    backgroundColor: '#FAFBFC',
  },
  listHeaderMeta: {
    fontSize: 11,
    color: SLATE_MUTED,
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
  },
  callRowLast: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  meta: {
    fontSize: 11,
    color: SLATE_MUTED,
    lineHeight: 15,
  },
  consultant: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#475569',
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusPill: {
    paddingHorizontal: 8,
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
    gap: 3,
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
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
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[20],
    paddingVertical: THEME.spacing[28],
  },
  stateText: {
    fontSize: THEME.typography.size[14],
    color: SLATE_MUTED,
    textAlign: 'center',
  },
  errorText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.danger,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: 8,
    borderRadius: 10,
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
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.2)',
    backgroundColor: 'rgba(15,81,50,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
