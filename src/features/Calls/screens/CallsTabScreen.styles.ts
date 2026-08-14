import { StyleSheet } from 'react-native';

import { ACCOUNT_HUB_LIST_CANVAS } from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';
import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ACCOUNT_HUB_LIST_CANVAS,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    backgroundColor: CALLS_TAB_THEME.bg,
  },
  listContentEmpty: {
    justifyContent: 'center',
  },
  listHeader: {
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[4],
    backgroundColor: CALLS_TAB_THEME.bg,
    gap: THEME.spacing[8],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
  },
  metaText: {
    fontSize: 12,
    color: CALLS_TAB_THEME.textSecondary,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[24],
    backgroundColor: CALLS_TAB_THEME.bg,
  },
  stateText: {
    color: CALLS_TAB_THEME.textSecondary,
    fontSize: 15,
  },
  errorText: {
    color: CALLS_TAB_THEME.missed,
    fontSize: 15,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
  },
  retryText: {
    color: CALLS_TAB_THEME.onAccent,
    fontSize: 15,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[28],
    paddingVertical: THEME.spacing[28],
    gap: THEME.spacing[10],
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CALLS_TAB_THEME.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    color: CALLS_TAB_THEME.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyBody: {
    color: CALLS_TAB_THEME.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
