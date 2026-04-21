import { StyleSheet } from 'react-native';

export const ZEPTO_TAB_C = {
  iconAreaHeight: 32,
  tabMinWidth: 56,
  padH: 10,
  padTop: 6,
  padBottom: 2,
  underlineHeight: 3,
  gapLabelTop: 2,
  badgeNewFont: 7,
  badgeSaleFont: 7,
} as const;

export const zeptoTabCStyles = StyleSheet.create({
  outer: {
    alignSelf: 'stretch',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: ZEPTO_TAB_C.padH,
    paddingTop: ZEPTO_TAB_C.padTop,
    paddingBottom: ZEPTO_TAB_C.padBottom,
    gap: 2,
  },
  tabPressable: {
    minWidth: ZEPTO_TAB_C.tabMinWidth,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    width: '100%',
  },
  iconWrap: {
    height: ZEPTO_TAB_C.iconAreaHeight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  label: {
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.12,
    textAlign: 'center',
    marginTop: ZEPTO_TAB_C.gapLabelTop,
  },
  labelActive: {
    fontWeight: '700',
  },
  labelInactive: {
    fontWeight: '400',
  },
  underline: {
    alignSelf: 'stretch',
    height: ZEPTO_TAB_C.underlineHeight,
    marginTop: 5,
    borderRadius: 1.5,
  },
  badgeNew: {
    position: 'absolute',
    top: -1,
    right: 2,
    backgroundColor: '#DC2626',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    zIndex: 2,
  },
  badgeNewText: {
    color: '#FFFFFF',
    fontSize: ZEPTO_TAB_C.badgeNewFont,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  badgeSale: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
    pointerEvents: 'none',
  },
  badgeSaleInner: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 4,
    paddingVertical: 1,
    transform: [{ rotate: '-18deg' }],
  },
  badgeSaleText: {
    color: '#FFFFFF',
    fontSize: ZEPTO_TAB_C.badgeSaleFont,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

