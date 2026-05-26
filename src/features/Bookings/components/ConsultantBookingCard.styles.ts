import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';

export const styles = StyleSheet.create({
  card: {
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[14],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
    gap: THEME.spacing[12],
  },
  cardLast: {
    borderBottomWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(5,150,105,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: '#059669',
  },
  main: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  customerName: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    flexShrink: 1,
    letterSpacing: -0.2,
  },
  amount: {
    fontSize: THEME.typography.size[14],
    fontWeight: '600',
    color: SLATE_MUTED,
  },
  metaBlock: {
    gap: 6,
    paddingLeft: 60,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: THEME.typography.size[12],
    color: SLATE_MUTED,
    flex: 1,
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingLeft: 60,
  },
  profileBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  profileBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    color: '#059669',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#0F172A',
    minWidth: 88,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  callBtnDisabled: {
    backgroundColor: '#F1F5F9',
    elevation: 0,
    shadowOpacity: 0,
  },
  callBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    color: '#FFFFFF',
  },
  callBtnTextDisabled: {
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
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
});
