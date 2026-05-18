import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  // ── Screen ────────────────────────────────────────────────
  screen: {
    padding: THEME.spacing[0],
    backgroundColor: THEME.colors.background,
  },
  listContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
  },

  // ── Add button ────────────────────────────────────────────
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.accentAmber,
    borderRadius: 999,
    paddingVertical: THEME.spacing[14],
    marginBottom: THEME.spacing[20],
    shadowColor: THEME.colors.accentAmber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  addBtnPlus: {
    fontSize: THEME.typography.size[18],
    color: THEME.colors.white,
    fontWeight: THEME.typography.weight.bold,
    lineHeight: 22,
  },
  addBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.white,
    letterSpacing: 0.3,
  },

  // ── Section header ────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    marginBottom: THEME.spacing[14],
  },
  sectionAccentBar: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: THEME.colors.accentAmber,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: THEME.colors.textPrimary,
  },
  sectionCountBadge: {
    backgroundColor: `${THEME.colors.accentAmber}2E`,
    borderRadius: 999,
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
  },
  sectionCountText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.accentAmber,
  },

  // ── Stats row ─────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    marginBottom: THEME.spacing[14],
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME.colors.white,
    borderRadius: 14,
    paddingVertical: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[8],
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.07)',
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing[4],
    fontWeight: THEME.typography.weight.medium,
    letterSpacing: 0.3,
  },

  // ── Filter chips ──────────────────────────────────────────
  filterRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    paddingBottom: THEME.spacing[14],
  },
  filterChip: {
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
  },
  filterChipActive: {
    backgroundColor: THEME.colors.accentAmber,
    borderColor: THEME.colors.accentAmber,
  },
  filterChipText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.textSecondary,
  },
  filterChipTextActive: {
    color: THEME.colors.white,
    fontWeight: THEME.typography.weight.bold,
  },

  // ── Grid layout ───────────────────────────────────────────
  gridRow: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    marginBottom: THEME.spacing[10],
  },
  gridCell: {
    flex: 1,
  },

  // ── Video card (light theme) ──────────────────────────────
  videoCard: {
    borderRadius: 18,
    padding: THEME.spacing[14],
    gap: THEME.spacing[10],
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.07)',
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  // top accent line
  cardShimmerEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  // ── Thumbnail area ────────────────────────────────────────
  thumbArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
 iconContainer: {
  width: 52,
  height: 52,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#E2E8F0',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
},
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIcon: {
    fontSize: THEME.typography.size[16],
  },
  thumbMeta: {
    alignItems: 'flex-end',
    gap: THEME.spacing[4],
  },
  typePill: {
    borderRadius: 999,
    borderWidth: 0.5,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 3,
  },
  typePillText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: 0.4,
  },
  durationChip: {
    borderRadius: 999,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 3,
  },
  durationText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.semibold,
  },

  // ── Card body ─────────────────────────────────────────────
  cardTitle: {
    fontSize: 13,
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,   // dark text on light bg
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  cardSubject: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
    letterSpacing: 0.1,
  },

  // ── Stats ─────────────────────────────────────────────────
  cardStatsRow: {
    flexDirection: 'row',
    gap: THEME.spacing[12],
  },
  cardStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[4],
  },
  cardStatIcon: {
    fontSize: 10,
  },
  cardStatText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.medium,
  },

  // ── Divider ───────────────────────────────────────────────
  cardDivider: {
    height: 0.5,
    borderRadius: 1,
  },

  // ── Footer ───────────────────────────────────────────────
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[4],
    borderRadius: 999,
    borderWidth: 0.5,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: THEME.spacing[4],
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: 0.3,
  },
  cardActionRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnIcon: {
    fontSize: THEME.typography.size[12],
  },
  actionBtnDanger: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 0.5,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDangerIcon: {
    fontSize: THEME.typography.size[12],
  },

  // ── Empty state ───────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing[24] * 2,
    gap: THEME.spacing[8],
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
  },
  emptySubText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
});