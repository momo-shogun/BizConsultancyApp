import { StyleSheet } from 'react-native';

// ─── THEME tokens ─────────────────────────────────────────────────────────────

export const THEME = {
  colors: {
    white: '#FFFFFF',
    black: '#0B0F19',
    background: '#FFFFFF',
    surface: '#F6F7FB',
    textPrimary: '#0B0F19',
    textSecondary: '#5B6475',
    border: '#E5E7EF',
    primary: '#0F5132',
    accentAmber: '#F59E0B',
    danger: '#E5484D',
    success: '#2EBD85',
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
      10: 10,
      11: 11,
      12: 12,
      13: 13,
      14: 14,
      15: 15,
      16: 16,
      18: 18,
      20: 20,
      22: 22,
      24: 24,
      28: 28,
    },
    weight: {
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
    },
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 100,
  },
} as const;

// ─── Dark card backgrounds (allowed hardcoded values) ─────────────────────────

const CARD_BG_DARK = '#0F172A';
const CARD_BG_GREEN = '#0F2A1A';
const CARD_BG_PURPLE = '#1A0F2E';
const TOP_BAR_BG = '#0B1A10';
const HERO_BG = '#0F5132';
const STATS_STRIP_BG = '#0B3D2C';

// ─── Accent colors (exported for component use) ───────────────────────────────

export const ACCENT_BLUE = '#38BDF8';
export const ACCENT_GREEN = '#34D399';
export const ACCENT_PURPLE = '#A78BFA';
export const ACCENT_AMBER = THEME.colors.accentAmber;

// ─── Shared card shadow ───────────────────────────────────────────────────────

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.28,
  shadowRadius: 16,
  elevation: 8,
};

// ─── StyleSheet ───────────────────────────────────────────────────────────────

export const styles = StyleSheet.create({

  // Root
  root: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },

  // Top bar
  topBar: {
    backgroundColor: TOP_BAR_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[14],
    gap: THEME.spacing[12],
  },
  topBarCenter: {
    flex: 1,
  },
  topBarTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.white,
    letterSpacing: -0.3,
  },
  topBarSub: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.regular,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 1,
  },
  navIconBtn: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconText: {
    fontSize: THEME.typography.size[18],
    color: THEME.colors.white,
    lineHeight: 22,
  },

  // ScrollView
  scrollContent: {
    paddingBottom: THEME.spacing[24],
  },

  // Hero
  heroBlock: {
    backgroundColor: HERO_BG,
    paddingHorizontal: THEME.spacing[20],
    paddingTop: THEME.spacing[20],
    paddingBottom: THEME.spacing[24],
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245,158,11,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.42)',
    borderRadius: THEME.radius.full,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[4],
    marginBottom: THEME.spacing[12],
  },
  heroBadgeText: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.accentAmber,
    letterSpacing: 0.2,
  },
  heroTitle: {
    fontSize: THEME.typography.size[24],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.white,
    lineHeight: 32,
    letterSpacing: -0.5,
    marginBottom: THEME.spacing[10],
  },
  heroSubtitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.regular,
    color: 'rgba(255,255,255,0.62)',
    lineHeight: 19,
    marginBottom: THEME.spacing[20],
  },
  heroActions: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
  },
  heroBtnPrimary: {
    flex: 1,
    paddingVertical: THEME.spacing[12],
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    alignItems: 'center',
  },
  heroBtnPrimaryText: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semiBold,
    color: HERO_BG,
  },
  heroBtnSecondary: {
    flex: 1,
    paddingVertical: THEME.spacing[12],
    backgroundColor: 'transparent',
    borderRadius: THEME.radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.32)',
    alignItems: 'center',
  },
  heroBtnSecondaryText: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.white,
  },

  // Stats strip
  statsStrip: {
    backgroundColor: STATS_STRIP_BG,
    flexDirection: 'row',
  },
  stripItem: {
    flex: 1,
    paddingVertical: THEME.spacing[14],
    alignItems: 'center',
  },
  stripItemBorder: {
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  stripVal: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.white,
    letterSpacing: -0.3,
  },
  stripLbl: {
    fontSize: THEME.typography.size[10],
    fontWeight: THEME.typography.weight.regular,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },

  // Progress card
  progressCard: {
    backgroundColor: "white",
    borderRadius: THEME.radius.xl,
    marginHorizontal: THEME.spacing[16],
    marginTop: THEME.spacing[14],
    padding: THEME.spacing[16],
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  progressCardShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.6,
  },
  progressCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing[12],
    gap: THEME.spacing[10],
  },
  progressCardTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.black,
    letterSpacing: -0.2,
  },
  progressCardSub: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.regular,
    color: "grey",
    marginTop: 2,
  },
  progressBadge: {
    borderWidth: 1,
    borderRadius: THEME.radius.md,
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
  },
  progressBadgeText: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.bold,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: THEME.radius.full,
    marginBottom: THEME.spacing[14],
  },
  progressBarFill: {
    height: 5,
    width: '25%',
    borderRadius: THEME.radius.full,
  },
  progressMeta: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: "grey",
    paddingTop: THEME.spacing[12],
  },
  progressMetaItem: {
    flex: 1,
    alignItems: 'center',
  
    
  },
  progressMetaItemBorder: {
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  progressMetaVal: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.black,
  },
  progressMetaLbl: {
    fontSize: THEME.typography.size[10],
    fontWeight: THEME.typography.weight.regular,
    color: 'grey',
    marginTop: 2,
  },

  // Section
  section: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[12],
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
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
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  sectionCountBadge: {
    backgroundColor: `rgba(245,158,11,0.18)`,
    borderRadius: THEME.radius.full,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 2,
  },
  sectionCountText: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.accentAmber,
  },
  sectionAction: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.primary,
  },

  // Stat grid cards
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[10],
  },
  statCard: {
    width: '47.5%',
    backgroundColor: "white",
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing[16],
    gap: THEME.spacing[10],
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  statCardShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.6,
  },
  statIconWrap: {
    width: 52,
    height: 52,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconInner: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconText: {
    fontSize: THEME.typography.size[20],
    color: THEME.colors.black,
  },
  statValue: {
    fontSize: THEME.typography.size[22],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.black,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.regular,
    color: THEME.colors.black,
  },
  statRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

statTextContainer: {
  marginLeft: 12,
},

  // Module cards
  moduleCard: {
    backgroundColor: "white",
    borderRadius: THEME.radius.xl,
    marginBottom: THEME.spacing[10],
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  moduleCardShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.6,
  },
  moduleCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing[14],
    gap: THEME.spacing[12],
  },
  moduleIconWrap: {
    width: 52,
    height: 52,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  moduleIconInner: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIconText: {
    fontSize: THEME.typography.size[18],
  },
  moduleInfo: {
    flex: 1,
    minWidth: 0,
  },
  moduleName: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.black,
    marginBottom: THEME.spacing[4],
    letterSpacing: -0.1,
  },
  moduleNameLocked: {
    color: 'grey',
  },
  moduleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[4],
    marginBottom: THEME.spacing[8],
  },
  moduleMetaText: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.regular,
    color: 'grey',
  },
  moduleMetaDot: {
    fontSize: THEME.typography.size[11],
    color: 'rgba(255,255,255,0.2)',
  },
  moduleProgressBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: THEME.radius.full,
  },
  moduleProgressFill: {
    height: 3,
    borderRadius: THEME.radius.full,
  },
  moduleStatusPill: {
    borderWidth: 1,
    borderRadius: THEME.radius.full,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: THEME.spacing[4],
    flexShrink: 0,
  },
  moduleStatusText: {
    fontSize: THEME.typography.size[10],
    fontWeight: THEME.typography.weight.semiBold,
    letterSpacing: 0.2,
  },

  // Journey card
  journeyCard: {
    backgroundColor: "white",
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing[16],
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  journeyCardShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.6,
  },
  journeyRow: {
    flexDirection: 'row',
    gap: THEME.spacing[12],
  },
  journeyLeft: {
    alignItems: 'center',
    width: 32,
  },
  journeyCircle: {
    width: 32,
    height: 32,
    borderRadius: THEME.radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  journeyStepNum: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.bold,
  },
  journeyLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: 'grey',
    marginVertical: THEME.spacing[4],
  },
  journeyContent: {
    flex: 1,
    paddingBottom: THEME.spacing[16],
  },
  journeyTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.black,
    marginBottom: THEME.spacing[4],
    letterSpacing: -0.2,
  },
  journeyDesc: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.regular,
    color: 'grey',
    lineHeight: 18,
  },

  // FAQ
  faqCard: {
    backgroundColor: "white",
    borderRadius: THEME.radius.xl,
    marginBottom: THEME.spacing[10],
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  faqQuestion: {
    flex: 1,
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.black,
    lineHeight: 19,
  },
  faqChevron: {
    fontSize: THEME.typography.size[18],
    color: "grey",
    flexShrink: 0,
  },
  faqAnswer: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[16],
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingTop: THEME.spacing[12],
  },
  faqAnswerText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.regular,
    color: 'rgba(255,255,255,0.48)',
    lineHeight: 19,
  },

  // CTA section
  ctaSection: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
    gap: THEME.spacing[10],
  },
  ctaPrimary: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.lg,
    paddingVertical: THEME.spacing[14],
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  ctaPrimaryText: {
    fontSize: THEME.typography.size[15],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.white,
    letterSpacing: -0.2,
  },
  ctaSecondary: {
    backgroundColor: "white",
    borderRadius: THEME.radius.lg,
    paddingVertical: THEME.spacing[14],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    ...CARD_SHADOW,
  },
  ctaSecondaryText: {
    fontSize: THEME.typography.size[15],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.primary,
    letterSpacing: -0.2,
  },

  // Bottom nav
  bottomNav: {
    backgroundColor: CARD_BG_DARK,
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: THEME.spacing[10],
    paddingBottom: THEME.spacing[20],
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  bottomNavIcon: {
    fontSize: THEME.typography.size[20],
    color: 'rgba(255,255,255,0.3)',
  },
  bottomNavIconActive: {
    color: THEME.colors.accentAmber,
  },
  bottomNavLabel: {
    fontSize: THEME.typography.size[10],
    fontWeight: THEME.typography.weight.regular,
    color: 'rgba(255,255,255,0.3)',
  },
  bottomNavLabelActive: {
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.accentAmber,
  },
  bottomNavDot: {
    width: 4,
    height: 4,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.accentAmber,
    marginTop: 1,
  },
});