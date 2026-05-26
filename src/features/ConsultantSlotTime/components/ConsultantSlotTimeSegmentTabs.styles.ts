import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  track: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: THEME.colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    minHeight: 44,
  },
  pill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 10,
    backgroundColor: '#059669',
    zIndex: 0,
    elevation: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: THEME.spacing[8],
    zIndex: 2,
    elevation: 0,
  },
  tabPressed: {
    opacity: 0.92,
  },
  tabLabel: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    includeFontPadding: false,
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  badge: {
    marginLeft: 6,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: '#64748B',
    includeFontPadding: false,
  },
  badgeTextActive: {
    color: '#FFFFFF',
  },
});
