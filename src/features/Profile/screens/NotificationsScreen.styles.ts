import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const NOTIFICATIONS_CANVAS = '#F3F4F6';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: NOTIFICATIONS_CANVAS,
  },
  scrollContent: {
    paddingBottom: THEME.spacing[24],
  },
  filterRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[14],
    paddingBottom: THEME.spacing[10],
  },
  filterChip: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[8],
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#0F172A',
  },
  filterChipText: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#334155',
  },
  filterChipTextActive: {
    color: THEME.colors.white,
  },
  section: {
    marginTop: THEME.spacing[4],
    paddingHorizontal: THEME.spacing[16],
  },
  sectionTitle: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#64748B',
    marginBottom: THEME.spacing[10],
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 14,
    padding: THEME.spacing[14],
    marginBottom: THEME.spacing[10],
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8ECF1',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      default: { elevation: 1 },
    }),
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    paddingLeft: THEME.spacing[4],
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardMain: {
    flex: 1,
    minWidth: 0,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
  },
  cardTitle: {
    flex: 1,
    fontSize: THEME.typography.size[15],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  timeText: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#94A3B8',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  liveText: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#EF4444',
    letterSpacing: 0.4,
  },
  cardDesc: {
    marginTop: 4,
    fontSize: THEME.typography.size[13],
    lineHeight: 19,
    color: '#64748B',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[12],
  },
  acceptBtn: {
    flex: 1,
    minHeight: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnOrange: {
    backgroundColor: '#C2410C',
  },
  acceptBtnTeal: {
    backgroundColor: '#0D9488',
  },
  acceptBtnText: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  declineBtn: {
    flex: 1,
    minHeight: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  declineBtnText: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#64748B',
  },
  markAllReadBtn: {
    paddingHorizontal: THEME.spacing[4],
    paddingVertical: THEME.spacing[6],
  },
  markAllReadText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#38BDF8',
  },
});
