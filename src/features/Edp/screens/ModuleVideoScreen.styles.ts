import { StyleSheet, Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;

/** YouTube-inspired neutrals + EDP brand accent for progress. */
export const YT = {
  black: '#000000',
  white: '#FFFFFF',
  bg: '#FFFFFF',
  bgMuted: '#F9F9F9',
  rowActive: '#F2F2F2',
  text: '#0F0F0F',
  textSecondary: '#606060',
  textMuted: '#909090',
  border: '#E5E5E5',
  divider: '#ECECEC',
  brand: '#0F5132',
  brandSoft: '#E8F5EE',
  progress: '#0D9488',
  pdf: '#CC0000',
  thumbBg: '#212121',
  overlay: 'rgba(0,0,0,0.55)',
} as const;

export const PLAYER_HEIGHT = Math.round((SCREEN_WIDTH * 9) / 16);

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: YT.bg,
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 32,
    backgroundColor: YT.bg,
  },

  playerSection: {
    width: SCREEN_WIDTH,
    backgroundColor: YT.black,
    position: 'relative',
  },
  statusBarSpacer: {
    width: '100%',
    backgroundColor: YT.black,
  },
  videoWrap: {
    width: SCREEN_WIDTH,
    height: PLAYER_HEIGHT,
    backgroundColor: YT.black,
  },
  videoLoader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: YT.black,
  },
  videoEmptyText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  playerBackBtn: {
    position: 'absolute',
    left: 12,
    zIndex: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: YT.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: YT.text,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: YT.bgMuted,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: YT.textSecondary,
  },
  metaChipTextStrong: {
    fontSize: 12,
    fontWeight: '600',
    color: YT.text,
  },

  progressBlock: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: YT.divider,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: YT.text,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '600',
    color: YT.progress,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: YT.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: YT.progress,
    borderRadius: 2,
  },
  progressMeta: {
    marginTop: 6,
    fontSize: 12,
    color: YT.textMuted,
  },

  sectionDivider: {
    height: 8,
    backgroundColor: YT.bgMuted,
    marginTop: 18,
    marginHorizontal: -16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: YT.text,
  },
  sectionCount: {
    fontSize: 13,
    color: YT.textSecondary,
  },

  playlist: {
    gap: 0,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 10,
  },
  playlistRowActive: {
    backgroundColor: YT.rowActive,
  },
  playlistRowPressed: {
    opacity: 0.85,
  },
  activeIndicator: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    backgroundColor: YT.brand,
    marginRight: 2,
  },
  thumbWrap: {
    width: 120,
    height: 68,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: YT.thumbBg,
    flexShrink: 0,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: YT.thumbBg,
  },
  thumbDuration: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  thumbDurationText: {
    fontSize: 11,
    fontWeight: '600',
    color: YT.white,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  rowIndex: {
    fontSize: 11,
    fontWeight: '600',
    color: YT.textMuted,
    marginBottom: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: YT.text,
    lineHeight: 19,
  },
  rowTitleActive: {
    color: YT.brand,
    fontWeight: '600',
  },
  rowSub: {
    marginTop: 3,
    fontSize: 12,
    color: YT.textSecondary,
  },
  nowPlayingLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: YT.brand,
  },
  pdfBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pdfBtnDisabled: {
    opacity: 0.35,
  },

  relatedSection: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  relatedRow: {
    paddingTop: 4,
    paddingBottom: 12,
    gap: 12,
    paddingRight: 16,
  },
  relatedCard: {
    width: 168,
  },
  relatedThumb: {
    width: 168,
    height: 94,
    borderRadius: 8,
    backgroundColor: YT.thumbBg,
  },
  relatedThumbFallback: {
    width: 168,
    height: 94,
    borderRadius: 8,
    backgroundColor: YT.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedInfo: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  relatedTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: YT.text,
    lineHeight: 18,
  },
  relatedMeta: {
    marginTop: 4,
    fontSize: 12,
    color: YT.textSecondary,
  },

  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: YT.bg,
    gap: 12,
  },
  centerStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: YT.text,
    textAlign: 'center',
  },
  centerStateSub: {
    fontSize: 14,
    color: YT.textSecondary,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: YT.brand,
  },
  retryBtnText: {
    color: YT.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
