import { StyleSheet } from 'react-native';

import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[8],
    paddingBottom: THEME.spacing[12],
  },
  editPill: {
    minWidth: 64,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: CALLS_TAB_THEME.surfaceElevated,
    alignItems: 'center',
  },
  editText: {
    color: CALLS_TAB_THEME.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    color: CALLS_TAB_THEME.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CALLS_TAB_THEME.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    width: 16,
    height: 12,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  filterLine: {
    height: 2,
    borderRadius: 1,
    backgroundColor: CALLS_TAB_THEME.textPrimary,
  },
  filterLineWide: {
    width: 16,
  },
  filterLineMid: {
    width: 11,
  },
  filterLineNarrow: {
    width: 7,
  },
  pressed: {
    opacity: 0.72,
  },
});
