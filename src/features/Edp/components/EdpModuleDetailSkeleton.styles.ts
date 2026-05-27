import { Dimensions, StyleSheet } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const PLAYER_HEIGHT = Math.round((SCREEN_WIDTH * 9) / 16);

const SHIMMER_DARK = '#2A2A2A';
const SHIMMER_DARK_ALT = '#3D3D3D';

export const detailSkeletonStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
  },
  playerSection: {
    width: SCREEN_WIDTH,
    backgroundColor: '#000000',
  },
  statusBarSpacer: {
    width: '100%',
    backgroundColor: '#000000',
  },
  playerBlock: {
    borderRadius: 0,
    backgroundColor: SHIMMER_DARK,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  titleGap: {
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    borderRadius: 999,
  },
  progressBlock: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ECECEC',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTrack: {
    borderRadius: 2,
  },
  progressMeta: {
    marginTop: 8,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F9F9F9',
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
  playlist: {
    gap: 4,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  thumb: {
    borderRadius: 8,
    flexShrink: 0,
    backgroundColor: SHIMMER_DARK_ALT,
  },
  rowBody: {
    flex: 1,
    gap: 8,
  },
});
