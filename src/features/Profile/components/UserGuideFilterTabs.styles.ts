import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[8],
  },
  track: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.14)',
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    position: 'relative',
    minHeight: 42,
  },
  pill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 9,
    backgroundColor: THEME.colors.white,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: THEME.spacing[8],
    zIndex: 1,
  },
  tabPressed: {
    opacity: 0.9,
  },
  tabLabel: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.82)',
  },
  tabLabelActive: {
    color: '#075E54',
    fontWeight: THEME.typography.weight.bold as '700',
  },
  badge: {
    minWidth: 22,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: 'rgba(7,94,84,0.12)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.bold as '700',
    color: 'rgba(255,255,255,0.9)',
  },
  badgeTextActive: {
    color: '#075E54',
  },
});
