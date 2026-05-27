import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

/** WhatsApp-inspired palette for booking list cards */
export const WA = {
  green: '#25D366',
  greenDark: '#1DA851',
  teal: '#075E54',
  text: '#111B21',
  muted: '#667781',
  divider: '#E9EDEF',
  card: '#FFFFFF',
  avatarBg: '#DFE5E7',
  avatarText: '#54656F',
  disabledBg: '#F0F2F5',
  disabledText: '#8696A0',
} as const;

export const styles = StyleSheet.create({
  card: {
    backgroundColor: WA.card,
    borderRadius: 12,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[14],
    gap: THEME.spacing[12],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WA.divider,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
      default: {},
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[12],
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: WA.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultationBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: WA.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultationBadgePhone: {
    backgroundColor: WA.green,
  },
  consultationBadgeVideo: {
    backgroundColor: '#128C7E',
  },
  avatarText: {
    fontSize: THEME.typography.size[20],
    fontWeight: '600',
    color: WA.avatarText,
  },
  main: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consultantName: {
    flex: 1,
    fontSize: THEME.typography.size[17],
    fontWeight: '600',
    color: WA.text,
    letterSpacing: -0.2,
  },
  amount: {
    fontSize: THEME.typography.size[13],
    fontWeight: '600',
    color: WA.muted,
  },
  subtitle: {
    fontSize: THEME.typography.size[14],
    color: WA.muted,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    flex: 1,
    fontSize: THEME.typography.size[13],
    color: WA.muted,
    lineHeight: 18,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quickCallBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WA.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    ...Platform.select({
      ios: {
        shadowColor: WA.green,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  quickCallBtnDisabled: {
    backgroundColor: WA.disabledBg,
    elevation: 0,
    shadowOpacity: 0,
  },
  callCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: WA.green,
  },
  callCtaPressed: {
    backgroundColor: WA.greenDark,
  },
  callCtaDisabled: {
    backgroundColor: WA.disabledBg,
  },
  callCtaText: {
    fontSize: THEME.typography.size[15],
    fontWeight: '600',
    color: '#FFFFFF',
  },
  callCtaTextDisabled: {
    color: WA.disabledText,
  },
  callHint: {
    fontSize: THEME.typography.size[12],
    color: WA.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusPending: { backgroundColor: 'rgba(245,158,11,0.14)' },
  statusPendingText: { color: '#B45309' },
  statusConfirmed: { backgroundColor: 'rgba(37,211,102,0.14)' },
  statusConfirmedText: { color: '#128C7E' },
  statusCompleted: { backgroundColor: WA.disabledBg },
  statusCompletedText: { color: WA.muted },
  statusCancelled: { backgroundColor: 'rgba(220,38,38,0.10)' },
  statusCancelledText: { color: '#B91C1C' },
  statusDefault: { backgroundColor: WA.disabledBg },
  statusDefaultText: { color: WA.muted },
});
