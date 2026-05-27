import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const CONSULTANT_BOOKINGS_CANVAS = '#F4F7FB';
const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';

export const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  topChrome: {
    width: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: CONSULTANT_BOOKINGS_CANVAS,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[28],
    gap: THEME.spacing[12],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
    backgroundColor: CONSULTANT_BOOKINGS_CANVAS,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    paddingHorizontal: THEME.spacing[14],
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
  },
  listBlock: {
    backgroundColor: THEME.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    overflow: 'hidden',
  },
  skeletonCard: {
    padding: THEME.spacing[14],
    gap: THEME.spacing[10],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  skeletonLineWide: {
    width: '55%',
  },
  skeletonLineFull: {
    width: '80%',
  },
  skeletonLineShort: {
    width: '40%',
  },
  emptyBlock: {
    padding: THEME.spacing[32],
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(5,150,105,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  emptyBody: {
    fontSize: THEME.typography.size[14],
    color: SLATE_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: THEME.spacing[12],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.25)',
    backgroundColor: 'rgba(254,226,226,0.6)',
  },
  errorText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: THEME.colors.danger,
    lineHeight: 17,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: THEME.colors.danger,
  },
  retryText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[12],
  },
  pageBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnDisabled: {
    opacity: 0.45,
  },
  pageLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: '600',
    color: SLATE_MUTED,
    minWidth: 72,
    textAlign: 'center',
  },
});
