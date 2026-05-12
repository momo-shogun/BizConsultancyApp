import { StyleSheet } from 'react-native';
import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  // ── Section wrapper ─────────────────────────────────────────────────────────
  packageSection: {
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[12],
  },

  // ── Section header ──────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  headerAccentBar: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: THEME.colors.accentAmber,
  },
  sectionTitle: {
    fontSize: THEME.typography.size[20] ?? 20,
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  sectionCountBadge: {
    backgroundColor: `${THEME.colors.accentAmber}18`,
    borderWidth: 1,
    borderColor: `${THEME.colors.accentAmber}44`,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sectionCountText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.accentAmber,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    marginTop: -4,  
    marginBottom: 4,
  },

  // ── Card list ───────────────────────────────────────────────────────────────
  cardList: {
    gap: THEME.spacing[12],
  },

  // ── Card ────────────────────────────────────────────────────────────────────
  cardPressable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBg: {
    borderRadius: 20,
    padding: THEME.spacing[16],
    gap: THEME.spacing[10],
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    // Android
    elevation: 8,
  },
  cardShimmerEdge: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    opacity: 0.6,
    borderRadius: 999,
  },
  cardGlow: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
  },

  // ── Card Header ─────────────────────────────────────────────────────────────
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[12],
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIconInner: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 2,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: THEME.typography.size[12] ?? 10,
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  cardMeta: {
    fontSize: THEME.typography.size[12],
  },
  chevron: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 4,
    transform: [{ rotate: '180deg' }],
  },

  // ── Divider ─────────────────────────────────────────────────────────────────
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: -THEME.spacing[16],
  },

  // ── Detail rows ─────────────────────────────────────────────────────────────
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    paddingVertical: 2,
  },
  detailDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    flexShrink: 0,
  },
  detailText: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    color: 'rgba(255,255,255,0.80)',
    lineHeight: 20,
  },

  // ── Card footer ─────────────────────────────────────────────────────────────
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  footerPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  footerPillText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    letterSpacing: 0.3,
  },

  // ── Trust footer ─────────────────────────────────────────────────────────────
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingVertical: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[16],
    marginTop: 4,
  },
  trustItem2: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  trustEmoji: {
    fontSize: 18,
  },
  trustLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  trustSep: {
    width: 1,
    height: 28,
    backgroundColor: THEME.colors.border,
  },
});