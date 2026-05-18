import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  section: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.sm,
  },
  stepCard: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    padding: THEME.spacing.md,
    borderRadius: 12,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: THEME.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  stepBody: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME.colors.textSecondary,
  },
});
