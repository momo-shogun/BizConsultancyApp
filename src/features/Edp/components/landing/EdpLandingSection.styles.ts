import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const landingStyles = StyleSheet.create({
  section: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[10],
  },
  emptyText: {
    fontSize: THEME.typography.size[13],
    lineHeight: 20,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.medium as '500',
  },
});
