import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const BOOKINGS_CANVAS = '#F4F7FB';
const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BOOKINGS_CANVAS,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[20],
    gap: THEME.spacing[10],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[20],
    backgroundColor: BOOKINGS_CANVAS,
  },
  heroGradient: {
    borderRadius: 16,
    padding: THEME.spacing[14],
    gap: THEME.spacing[10],
  },
  heroTitle: {
    fontSize: THEME.typography.size[17],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    letterSpacing: -0.2,
  },
  heroMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.88)',
  },
  tabRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
  },
  tab: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  tabText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.85)',
  },
  tabTextActive: {
    color: THEME.colors.white,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    paddingHorizontal: THEME.spacing[12],
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
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
  listHeaderTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  listHeaderMeta: {
    fontSize: 11,
    color: SLATE_MUTED,
    marginTop: 2,
  },
  bookingRow: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
    gap: 6,
  },
  bookingRowLast: {
    borderBottomWidth: 0,
  },
  bookingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
  },
  bookingLeft: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  consultantName: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  meta: {
    fontSize: 11,
    color: SLATE_MUTED,
    lineHeight: 15,
  },
  amount: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.bold as '700',
    textTransform: 'capitalize',
  },
  statusPending: { backgroundColor: 'rgba(245,158,11,0.15)' },
  statusPendingText: { color: '#B45309' },
  statusConfirmed: { backgroundColor: 'rgba(5,150,105,0.12)' },
  statusConfirmedText: { color: '#047857' },
  statusCompleted: { backgroundColor: '#F1F5F9' },
  statusCompletedText: { color: '#475569' },
  statusCancelled: { backgroundColor: 'rgba(220,38,38,0.10)' },
  statusCancelledText: { color: '#B91C1C' },
  statusDefault: { backgroundColor: '#F1F5F9' },
  statusDefaultText: { color: '#64748B' },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: BOOKINGS_CANVAS,
  },
  callBtnText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: SLATE_MUTED,
  },
  emptyBlock: {
    padding: THEME.spacing[24],
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  emptyTitle: {
    fontSize: THEME.typography.size[13],
    color: SLATE_MUTED,
    textAlign: 'center',
  },
  linkBtn: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: THEME.colors.primary,
  },
  linkBtnText: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[10],
  },
  pageBtn: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
  },
  pageBtnDisabled: { opacity: 0.45 },
  pageBtnText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  pageLabel: {
    fontSize: 11,
    color: SLATE_MUTED,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
  },
  footerLinkTitle: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  footerLinkAction: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
  },
  errorText: {
    fontSize: THEME.typography.size[13],
    color: THEME.colors.danger,
    textAlign: 'center',
  },
});
