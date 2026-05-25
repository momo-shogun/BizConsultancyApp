import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const BOOKINGS_CANVAS = '#F8FAFC';
const SLATE_LINE = '#E2E8F0';

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
  default: {},
});

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BOOKINGS_CANVAS,
  },
  scrollContent: {
    padding: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[14],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
    backgroundColor: BOOKINGS_CANVAS,
  },
  hero: {
    borderRadius: THEME.radius[16],
    overflow: 'hidden',
    padding: THEME.spacing[16],
    backgroundColor: THEME.colors.primary,
    ...CARD_SHADOW,
  },
  heroTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    letterSpacing: -0.2,
  },
  tabRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[12],
  },
  tab: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  tabText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'capitalize',
  },
  tabTextActive: {
    color: THEME.colors.white,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    paddingHorizontal: THEME.spacing[12],
    ...CARD_SHADOW,
  },
  searchInput: {
    flex: 1,
    paddingVertical: THEME.spacing[12],
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
  },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    padding: THEME.spacing[14],
    ...CARD_SHADOW,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
  },
  cardLeft: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  consultantName: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  meta: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  amount: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    textAlign: 'right',
  },
  statusBadge: {
    marginTop: THEME.spacing[4],
    alignSelf: 'flex-start',
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.bold as '700',
    textTransform: 'capitalize',
  },
  statusPending: {
    backgroundColor: 'rgba(245,158,11,0.15)',
  },
  statusPendingText: {
    color: '#B45309',
  },
  statusConfirmed: {
    backgroundColor: 'rgba(5,150,105,0.12)',
  },
  statusConfirmedText: {
    color: '#047857',
  },
  statusCompleted: {
    backgroundColor: '#F1F5F9',
  },
  statusCompletedText: {
    color: '#475569',
  },
  statusCancelled: {
    backgroundColor: 'rgba(220,38,38,0.10)',
  },
  statusCancelledText: {
    color: '#B91C1C',
  },
  statusDefault: {
    backgroundColor: '#F1F5F9',
  },
  statusDefaultText: {
    color: '#64748B',
  },
  callRow: {
    marginTop: THEME.spacing[12],
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: '#F8FAFC',
  },
  callBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: THEME.spacing[32],
    gap: THEME.spacing[12],
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(15,81,50,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
  linkBtn: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
  },
  linkBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[12],
  },
  pageBtn: {
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
  },
  pageBtnDisabled: {
    opacity: 0.45,
  },
  pageBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  pageLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  sectionLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    padding: THEME.spacing[14],
    ...CARD_SHADOW,
  },
  sectionLinkTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  sectionLinkAction: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
  },
  errorText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.danger,
    textAlign: 'center',
  },
});
