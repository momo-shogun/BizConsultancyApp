import { Platform, StyleSheet } from 'react-native';

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
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[8],
  },
  listContentEmpty: {
    justifyContent: 'center',
  },
  listHeader: {
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: CALLS_TAB_THEME.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: CALLS_TAB_THEME.textSecondary,
    letterSpacing: -0.1,
    marginBottom: THEME.spacing[8],
    marginTop: THEME.spacing[16],
    paddingHorizontal: THEME.spacing[16],
  },
  sectionTitleFirst: {
    marginTop: THEME.spacing[4],
  },
  sectionCard: {
    marginHorizontal: THEME.spacing[16],
    backgroundColor: CALLS_TAB_THEME.bg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CALLS_TAB_THEME.separator,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionGap: {
    height: THEME.spacing[12],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[24],
    backgroundColor: CALLS_TAB_THEME.bg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: CALLS_TAB_THEME.onAccent,
    fontSize: 15,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[28],
    paddingVertical: THEME.spacing[32],
    gap: THEME.spacing[10],
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CALLS_TAB_THEME.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CALLS_TAB_THEME.separator,
  },
  emptyTitle: {
    color: CALLS_TAB_THEME.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emptyBody: {
    color: CALLS_TAB_THEME.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});
