import { Platform, StyleSheet } from 'react-native';

export const ZEPTO = {
  pillRadius: 14,
  pillHeight: 60,
  gap: 12,
  scrollPadH: 14,
  scrollPadV: 10,
  fontSize: 13,
} as const;

export const zeptoTabsStyles = StyleSheet.create({
  outer: {
    alignSelf: 'stretch',
    borderRadius: ZEPTO.pillRadius + 6,
    overflow: 'hidden',
  },
  tabsBg: {
    alignSelf: 'stretch',
  },
  tabRowOuter: {
    alignSelf: 'stretch',
    flexGrow: 0,
    paddingHorizontal: ZEPTO.scrollPadH,
    paddingTop: ZEPTO.scrollPadV,
    paddingBottom: 0,
  },
  tabRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    flexWrap: 'nowrap',
    minHeight: ZEPTO.pillHeight,
  },
  highlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: ZEPTO.pillHeight,
    borderTopLeftRadius: ZEPTO.pillRadius,
    borderTopRightRadius: ZEPTO.pillRadius,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
      },
    }),
  },
  pressable: {
    zIndex: 1,
    flex: 1,
    minWidth: 0,
    height: ZEPTO.pillHeight,
    borderRadius: ZEPTO.pillRadius,
    overflow: 'hidden',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: ZEPTO.pillHeight - 10,
    paddingHorizontal: 6,
    borderRadius: ZEPTO.pillRadius,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  tabInnerActive: {
    backgroundColor: 'transparent',
    marginBottom: 0,
    height: ZEPTO.pillHeight,
  },
  label: {
    fontSize: ZEPTO.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelStack: {
    flexShrink: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelTop: {
    lineHeight: 16,
    letterSpacing: 0.35,
  },
  labelBottom: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 0,
    letterSpacing: 0.28,
  },
  /** Dark slate headline color; overridden when `tabLabelColors` is passed. */
  labelActive: {
    color: '#071225',
    fontWeight: '800',
  },
  /** Second line of a tab label: same color as active, slightly lighter weight. */
  labelActiveSubline: {
    fontWeight: '700',
  },
  labelInactive: {
    color: '#5B616A',
    fontWeight: '600',
  },
  /** Inactive still readable; avoids “washed” tabs while staying secondary to active. */
  labelInactiveDim: {
    opacity: 0.78,
  },
  iconWrap: {
    marginRight: 6,
  },
  searchWrap: {
    paddingHorizontal: ZEPTO.scrollPadH,
    paddingVertical: ZEPTO.scrollPadV,
  },
  searchBg: {
    alignSelf: 'stretch',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17,24,39,0.10)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      default: {
        elevation: 1,
      },
    }),
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#111827',
    opacity: 0.9,
  },
  searchIconHandle: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: '#111827',
    borderRadius: 2,
    opacity: 0.9,
    transform: [{ rotate: '45deg' }, { translateX: 7 }, { translateY: 7 }],
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
});

