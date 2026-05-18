import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const TAB_METRICS = {
  minHeight: 36,
  pillHeight: 40,
  pillRadius: 999,
  gap: 8,
  scrollPadH: 6,
  scrollPadV: 8,
  iconSize: 15,
  labelSize: 13,
  labelSizeActive: 13,
} as const;

export const styles = StyleSheet.create({
  shell: {
    marginHorizontal: THEME.spacing[8],
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        // elevation: 8,
      },
    }),
  },
  shellGlow: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    opacity: 0.55,
  },
  scrollContent: {
    paddingHorizontal: TAB_METRICS.scrollPadH,
    paddingVertical: TAB_METRICS.scrollPadV,
    flexDirection: 'row',
    alignItems: 'center',
    gap: TAB_METRICS.gap,
  },
  track: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TAB_METRICS.minHeight,
    paddingVertical: 2,
    borderRadius: 14,
  },
  pill: {
    position: 'absolute',
    left: 0,
    top: 2,
    height: TAB_METRICS.pillHeight,
    borderRadius: TAB_METRICS.pillRadius,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  pillGradient: {
    ...StyleSheet.absoluteFill,
    borderRadius: TAB_METRICS.pillRadius,
  },
  pillShine: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 1,
  },
  tabPressable: {
    zIndex: 1,
    minHeight: TAB_METRICS.minHeight,
    justifyContent: 'center',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: TAB_METRICS.pillHeight,
    borderRadius: TAB_METRICS.pillRadius,
  },
  tabLabel: {
    fontSize: TAB_METRICS.labelSize,
    fontWeight: THEME.typography.weight.medium as '500',
    letterSpacing: 0.1,
    maxWidth: 140,
  },
  tabLabelActive: {
    fontSize: TAB_METRICS.labelSizeActive,
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: 0.15,
  },
});
