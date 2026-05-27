import { Dimensions, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const horizontalPadding = THEME.spacing[16];
const cardGap = THEME.spacing[12];
const screenWidth = Dimensions.get('window').width;

export const EDP_MODULE_CARD_WIDTH =
  (screenWidth - horizontalPadding * 2 - cardGap) / 2;

export const moduleCardSkeletonStyles = StyleSheet.create({
  grid: {
    marginTop: THEME.spacing[16],
    paddingHorizontal: horizontalPadding,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cardGap,
  },
  searchWrap: {
    marginHorizontal: horizontalPadding,
    marginTop: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[12],
    height: 46,
    borderRadius: 14,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  searchLine: {
    flex: 1,
    borderRadius: THEME.radius[6],
  },
  card: {
    borderRadius: 18,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    overflow: 'hidden',
  },
  thumb: {
    borderRadius: 0,
  },
  body: {
    padding: THEME.spacing[10],
    gap: THEME.spacing[10],
    minHeight: 132,
  },
  progressBlock: {
    gap: THEME.spacing[8],
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    borderRadius: 999,
  },
  track: {
    borderRadius: 999,
  },
  metaPill: {
    borderRadius: 999,
  },
});
