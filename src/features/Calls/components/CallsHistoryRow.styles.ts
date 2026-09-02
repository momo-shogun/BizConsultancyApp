import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';
import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[14],
    minHeight: 76,
  },
  rowPressed: {
    backgroundColor: CALLS_TAB_THEME.surface,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CALLS_TAB_THEME.separator,
    marginLeft: 14 + 52 + 12,
    marginRight: THEME.spacing[14],
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 4,
    paddingRight: THEME.spacing[4],
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: CALLS_TAB_THEME.textPrimary,
  },
  nameMissed: {
    color: CALLS_TAB_THEME.missed,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    color: CALLS_TAB_THEME.textSecondary,
    fontWeight: '400',
  },
  subtitleMissed: {
    color: CALLS_TAB_THEME.missed,
    fontWeight: '500',
  },
  trailing: {
    alignItems: 'flex-end',
    gap: THEME.spacing[8],
    flexShrink: 0,
  },
  time: {
    fontSize: 13,
    color: CALLS_TAB_THEME.textSecondary,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CALLS_TAB_THEME.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: CALLS_TAB_THEME.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  actionBtnVideo: {
    backgroundColor: CALLS_TAB_THEME.videoSoft,
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
});
