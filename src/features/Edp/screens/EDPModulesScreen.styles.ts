import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const THEME = {
  colors: {
    textPrimary: '#E2E8F0',
    textSecondary: '#94A3B8',
    white: '#FFFFFF',
    black: '#000000',
    border: 'rgba(255,255,255,0.08)',
    accentAmber: '#F59E0B',
    accentBlue: '#38BDF8',
    accentGreen: '#34D399',
    accentPurple: '#A78BFA',
    accentRose: '#FB7185',
    accentTeal: '#2DD4BF',
    accentOrange: '#FB923C',
    background: '#070B14',
    surface: '#0D1220',
  },
  spacing: {
    0: 0,
    4: 4,
    8: 8,
    10: 10,
    12: 12,
    14: 14,
    16: 16,
    20: 20,
    24: 24,
  },
  typography: {
    size: {
      9: 9,
      10: 10,
      11: 11,
      12: 12,
      13: 13,
      14: 14,
      16: 16,
      18: 18,
      20: 20,
      24: 24,
    },
    weight: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 999,
  },
};

const CARD_WIDTH = (SCREEN_WIDTH - THEME.spacing[16] * 2 - THEME.spacing[10]) / 2;

export const styles = StyleSheet.create({
  // ─── Root ───────────────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: THEME.colors.black,
  },

  // ─── Top Bar ────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[14],
    paddingBottom: THEME.spacing[12],
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarMid: {
    flex: 1,
  },
  topBarTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  topBarSubtitle: {
    fontSize: THEME.typography.size[10],
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  langToggle: {
    flexDirection: 'row',
    borderRadius: THEME.radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  langBtn: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textSecondary,
    backgroundColor: 'transparent',
  },
  langBtnText: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textSecondary,
  },
  langBtnActive: {
    backgroundColor: THEME.colors.accentGreen,
  },
  langBtnActiveText: {
    color: '#0F172A',
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.bold,
  },

  // ─── Search ─────────────────────────────────────────────────────────────────
  searchWrapper: {
    marginHorizontal: THEME.spacing[16],
    marginTop: THEME.spacing[14],
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: "grey",
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[10],
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: THEME.typography.size[16],
    color: 'black',
  },
  searchBadge: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
    borderRadius: THEME.radius.full,
    backgroundColor: 'rgba(52,211,153,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.28)',
  },
  searchBadgeText: {
    fontSize: THEME.typography.size[10],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.accentGreen,
  },

  // ─── Section Header ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
    paddingBottom: THEME.spacing[12],
  },
  sectionAccentBar: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: THEME.colors.accentAmber,
  },
  sectionTitle: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.black,
    letterSpacing: -0.4,
    flex: 1,
  },
  sectionCountBadge: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
    borderRadius: THEME.radius.full,
    backgroundColor: 'rgba(245,158,11,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  sectionCountText: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.accentAmber,
  },

  // ─── Grid ───────────────────────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[10],
    paddingBottom: THEME.spacing[24],
  },

  // ─── Module Card ────────────────────────────────────────────────────────────
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#0F172A',
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  cardShimmerEdge: {
    height: 1,
    width: '100%',
    // accent color set inline per card
    opacity: 0.6,
  },
  cardTopSection: {
    paddingTop: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[14],
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
  },
  cardBadge: {
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
    // bg and border set inline
  },
  cardBadgeText: {
    fontSize: THEME.typography.size[9],
    fontWeight: THEME.typography.weight.extrabold,
    letterSpacing: 0.6,
  },
  cardIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // border color set inline
  },
  cardIconInner: {
    width: 44,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    // bg color set inline
  },
  cardBody: {
    paddingHorizontal: THEME.spacing[14],
    paddingTop: THEME.spacing[10],
    gap: THEME.spacing[4],
  },
  cardModLabel: {
    fontSize: THEME.typography.size[9],
    fontWeight: THEME.typography.weight.bold,
    color: 'grey',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.black,
    lineHeight: 17,
  },
  cardPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[4],
    marginTop: THEME.spacing[8],
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: THEME.radius.sm,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'grey',
  },
  pillText: {
    fontSize: THEME.typography.size[9],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.black,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[10],
    marginTop: THEME.spacing[8],
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  cardAssessText: {
    fontSize: THEME.typography.size[12],
    color: 'grey',
  },
  cardOpenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: THEME.radius.sm,
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
    // bg set inline
  },
  cardOpenBtnText: {
    fontSize: THEME.typography.size[10],
    fontWeight: THEME.typography.weight.bold,
    // color set inline
  },

  // ─── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: THEME.spacing[12],
    paddingBottom: THEME.spacing[20],
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  navItem: {
    alignItems: 'center',
    gap: THEME.spacing[4],
  },
  navLabel: {
    fontSize: THEME.typography.size[9],
    fontWeight: THEME.typography.weight.semibold,
    color: 'rgba(148,163,184,0.4)',
  },
  navLabelActive: {
    fontSize: THEME.typography.size[9],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.accentGreen,
  },

  // ─── Scroll Content ─────────────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: THEME.spacing[8],
  },
});