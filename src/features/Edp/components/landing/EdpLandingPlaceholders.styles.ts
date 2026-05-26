import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const cardShell = {
  borderRadius: 16,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: THEME.colors.border,
  backgroundColor: THEME.colors.white,
} as const;

export const placeholderStyles = StyleSheet.create({
  strip: {
    ...cardShell,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[14],
    marginHorizontal: THEME.spacing[16],
    marginTop: THEME.spacing[12],
  },
  stripItem: {
    alignItems: 'center',
    gap: THEME.spacing[6],
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[10],
  },
  metricCard: {
    ...cardShell,
    width: '47%',
    minHeight: 88,
    padding: THEME.spacing[14],
    gap: THEME.spacing[8],
  },
  list: {
    gap: THEME.spacing[10],
  },
  listRowCard: {
    ...cardShell,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
    padding: THEME.spacing[14],
  },
  listRowBody: {
    flex: 1,
    gap: THEME.spacing[8],
  },
  accordion: {
    ...cardShell,
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: THEME.spacing[4],
  },
  accordionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.border,
  },
});
