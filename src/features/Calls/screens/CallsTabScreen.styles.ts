import { StyleSheet } from 'react-native';

import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CALLS_TAB_THEME.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  listContentEmpty: {
    justifyContent: 'center',
  },
  filterChipRow: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[8],
  },
  filterChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(10,132,255,0.16)',
  },
  filterChipText: {
    color: CALLS_TAB_THEME.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[24],
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
    backgroundColor: CALLS_TAB_THEME.accent,
  },
  retryText: {
    color: CALLS_TAB_THEME.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[28],
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
