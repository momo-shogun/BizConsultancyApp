import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const THEME = {
  colors: {
    textPrimary: '#0B0F19',
    textSecondary: '#5B6475',
    textMuted: '#A0A8B8',
    white: '#FFFFFF',
    black: '#000000',
    border: '#E5E7EF',
    accentAmber: '#F59E0B',
    accentGreen: '#34D399',
    accentBlue: '#38BDF8',
    accentPurple: '#A78BFA',
    surface: '#F6F7FB',
    darkCard: '#0F2A1A',
    brandDark: '#0B3D2C',
    brandGreen: '#0F5132',
    brandGreenLight: '#F1FAF5',
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
      16: 16,
      18: 18,
      20: 20,
      22: 22,
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
    md: 11,
    lg: 13,
    xl: 20,
    full: 999,
  },
};

export const styles = StyleSheet.create({
  // ─── Root ─────────────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.brandDark,
  },
  scrollContent: {
    paddingBottom: THEME.spacing[24],
    backgroundColor: THEME.colors.white,
  },

  // ─── Status Bar ───────────────────────────────────────────────────────────
  statusBar: {
    backgroundColor: THEME.colors.brandDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[8],
  },
  statusTime: {
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.85)',
    fontWeight: THEME.typography.weight.semiBold,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    alignItems: 'center',
  },

  // ─── Video Player ─────────────────────────────────────────────────────────
  videoWrap: {
    width: SCREEN_WIDTH,
    height: 210,
    backgroundColor: '#111',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  videoTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[14],
    paddingTop: THEME.spacing[10],
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTimestamp: {
    fontSize: THEME.typography.size[11],
    color: 'rgba(255,255,255,0.75)',
    fontWeight: THEME.typography.weight.medium,
  },
  videoControls: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -65 }, { translateY: -22 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[20],
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnLg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seekContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: THEME.spacing[14],
    paddingBottom: THEME.spacing[10],
  },
  seekTrack: {
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: THEME.spacing[4],
  },
  seekFill: {
    height: '100%',
    backgroundColor: THEME.colors.white,
    width: '23%',
    borderRadius: 2,
    position: 'relative',
  },
  seekDot: {
    position: 'absolute',
    right: -4,
    top: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: THEME.colors.white,
  },
  seekLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seekLabelText: {
    fontSize: THEME.typography.size[10],
    color: 'rgba(255,255,255,0.5)',
  },

  // ─── Body ─────────────────────────────────────────────────────────────────
  body: {
    backgroundColor: THEME.colors.white,
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[16],
  },
  moduleTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing[4],
  },
  moduleSub: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: THEME.spacing[14],
  },
  divider: {
    height: 0.5,
    backgroundColor: THEME.colors.border,
    marginBottom: THEME.spacing[14],
  },

  // ─── Supporting Materials Card ────────────────────────────────────────────
  supportCard: {
    backgroundColor: THEME.colors.white,
    borderWidth: 0.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
    marginBottom: THEME.spacing[16],
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  supportIconWrap: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.textPrimary,
    marginBottom: 1,
  },
  supportSub: {
    fontSize: THEME.typography.size[11],
    color: THEME.colors.textSecondary,
  },
  downloadBtn: {
    width: 30,
    height: 30,
    borderRadius: THEME.radius.sm,
    borderWidth: 0.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Section Header ───────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing[12],
  },
  sectionLeft: {
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
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  countBadge: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
    borderRadius: THEME.radius.full,
    backgroundColor: 'rgba(245,158,11,0.18)',
  },
  countBadgeText: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.accentAmber,
    fontWeight: THEME.typography.weight.semiBold,
  },

  // ─── Lesson Rows ──────────────────────────────────────────────────────────
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingVertical: THEME.spacing[10],
    borderBottomWidth: 0.5,
    borderBottomColor: THEME.colors.border,
  },
  lessonRowLast: {
    borderBottomWidth: 0,
  },
  lessonIconDone: {
    width: 30,
    height: 30,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.brandGreenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIconActive: {
    width: 30,
    height: 30,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIconLocked: {
    width: 30,
    height: 30,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonTitle: {
    flex: 1,
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.textPrimary,
  },
  lessonTitleActive: {
    flex: 1,
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.brandGreen,
  },
  lessonTitleMuted: {
    flex: 1,
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.regular,
    color: THEME.colors.textMuted,
  },
  lessonDuration: {
    fontSize: THEME.typography.size[11],
    color: THEME.colors.textMuted,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.colors.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRowWrap: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 0.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: THEME.spacing[10],
    marginHorizontal: -4,
    marginVertical: THEME.spacing[4],
  },
  lockedRow: {
    opacity: 0.5,
  },

  // ─── Progress Ring container ───────────────────────────────────────────────
  progressRingWrap: {
    width: 20,
    height: 20,
  },
});