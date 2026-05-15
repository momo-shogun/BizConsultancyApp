import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingBottom: THEME.spacing[24],
  },
  section: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[10],
  },
  ctaSection: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
    gap: THEME.spacing[10],
  },
  ctaPrimary: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 16,
    paddingVertical: THEME.spacing[14],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPrimaryText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    letterSpacing: 0.2,
  },
  ctaSecondary: {
    backgroundColor: THEME.colors.white,
    borderRadius: 16,
    paddingVertical: THEME.spacing[14],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  ctaSecondaryText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.primary,
    letterSpacing: 0.2,
  },
});
