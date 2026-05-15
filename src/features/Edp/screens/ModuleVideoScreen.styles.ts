import { COLORS } from '@/constants/colors';
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
    surface: '#F6F7FB',
    brandDark: '#0B3D2C',
    brandGreen: '#0F5132',
    brandGreenLight: '#F1FAF5',
    brandGreenBorder: '#d0ead8',
  },
  spacing: {
    0: 0, 4: 4, 8: 8, 10: 10, 12: 12,
    14: 14, 16: 16, 20: 20, 24: 24,
  },
  typography: {
    size: { 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 16: 16, 18: 18, 20: 20 },
    weight: {
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
    },
  },
  radius: { sm: 8, md: 11, lg: 13, xl: 20, full: 999 },
};

export const styles = StyleSheet.create({

  // ─── Root ──────────────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.brandDark,
  },
  scrollContent: {
    paddingBottom: THEME.spacing[24],
    backgroundColor: THEME.colors.white,
  },

  // ─── Status Bar ────────────────────────────────────────────────────────────
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

  // ─── Video Player ──────────────────────────────────────────────────────────
  videoWrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 9 / 16,
    backgroundColor: '#000',
    position: 'relative',
  },
// styles mein ye update karo

controlBtn: {
  width: 52,        // 36 → 52
  height: 52,
  borderRadius: 26,
  borderWidth: 1.5,
  borderColor: 'rgba(255,255,255,0.55)',
  alignItems: 'center',
  justifyContent: 'center',
},
controlBtnLg: {
  width: 64,        // 44 → 64
  height: 64,
  borderRadius: 32,
  borderWidth: 1.5,
  borderColor: 'rgba(255,255,255,0.55)',
  alignItems: 'center',
  justifyContent: 'center',
},
backBtn: {
  position: 'absolute',
  top: 10,
  left: 12,
  zIndex: 10,
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: 'rgba(0,0,0,0.5)',
  alignItems: 'center',
  justifyContent: 'center',
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
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[14],
    paddingTop: THEME.spacing[10],
  },
  videoTimestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: THEME.typography.weight.medium,
  },
  videoControls: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: [{ translateX: -65 }, { translateY: -22 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[20],
  },
  seekContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
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
    borderRadius: 2,
    position: 'relative',
  },
  seekDot: {
    position: 'absolute',
    right: -4, top: -3,
    width: 9, height: 9, borderRadius: 5,
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

  // ─── Body ──────────────────────────────────────────────────────────────────
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

  // stat cards
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 4,
  },
  box: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
  },
  boxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  boxLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
    marginBottom: 3,
  },
  boxValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  divider: {
    height: 0.5,
    backgroundColor: THEME.colors.border,
    marginVertical: THEME.spacing[14],
  },

  // ─── Supporting Materials ──────────────────────────────────────────────────
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
    width: 40, height: 40,
    borderRadius: THEME.radius.sm,
    backgroundColor: '#e76f51',
    alignItems: 'center', justifyContent: 'center',
  },
  supportInfo: { flex: 1 },
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
    width: 30, height: 30,
    borderRadius: THEME.radius.sm,
    borderWidth: 0.5,
    borderColor: THEME.colors.border,
    alignItems: 'center', justifyContent: 'center',
  },

  // ─── Module Progress Bar ───────────────────────────────────────────────────
  moduleProgressWrap: {
    marginBottom: THEME.spacing[16],
    paddingVertical: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[14],
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    borderWidth: 0.5,
    borderColor: THEME.colors.border,
  },
  moduleProgressMeta: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing[8],
  },
  moduleProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  moduleProgressLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  moduleProgressTrack: {
    flex: 1, height: 4,
    backgroundColor: THEME.colors.border,
    borderRadius: 999,
    overflow: 'hidden',
  },
  moduleProgressFill: {
    height: '100%',
    backgroundColor: THEME.colors.brandGreen,
    borderRadius: 999,
  },
  moduleProgressPct: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.brandGreen,
    minWidth: 28,
    textAlign: 'right',
  },

  // ─── Section Header ────────────────────────────────────────────────────────
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
    width: 4, height: 22, borderRadius: 2,
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
  progressRingWrap: { width: 20, height: 20 },

  // ─── Lesson List container ─────────────────────────────────────────────────
  lessonList: {
    // no padding; cards handle their own spacing
  },

  // ─── OTT Lesson Card ───────────────────────────────────────────────────────
  lessonCard: {
    paddingTop: THEME.spacing[14],
  },
  lessonCardLast: {
    paddingBottom: THEME.spacing[8],
  },
  lessonCardActive: {
    // subtle left green bar effect via borderLeft not supported in RN;
    // we use background tint below the nowPlayingPill instead
  },

  // "Now playing" green pill at top of active card
  nowPlayingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: THEME.spacing[8],
  },
  nowPlayingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: THEME.colors.brandGreen,
  },
  nowPlayingText: {
    fontSize: THEME.typography.size[11],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.brandGreen,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },

  // Top row inside a card
  lessonCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  // Thumbnail
  thumbWrap: {
    width: 100,
    height: 68,
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlayOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlayBtnActive: {
    backgroundColor: THEME.colors.brandGreen,
    borderColor: THEME.colors.brandGreen,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  thumbLockOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  thumbDoneBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: THEME.colors.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info column
  lessonCardInfo: {
    flex: 1,
    paddingTop: 2,
  },
  lessonCardTitle: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semiBold,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 5,
  },
  lessonCardTitleActive: {
    color: THEME.colors.brandGreen,
  },
  lessonCardTitleLocked: {
    color: THEME.colors.textMuted,
    fontWeight: THEME.typography.weight.regular,
  },
  lessonCardMeta: {
    fontSize: THEME.typography.size[11],
    color: THEME.colors.textSecondary,
  },

  // Action button (download / lock)
  lessonCardActionBtn: {
    paddingTop: 4,
    flexShrink: 0,
  },
  downloadCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadArrow: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.semiBold,
  },

  // Description
  lessonCardDesc: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginTop: THEME.spacing[8],
  },
  lessonCardDescLocked: {
    color: THEME.colors.textMuted,
    opacity: 0.7,
  },

  // Divider between cards
  lessonCardDivider: {
    height: 0.5,
    backgroundColor: THEME.colors.border,
    marginTop: THEME.spacing[14],
  },
});