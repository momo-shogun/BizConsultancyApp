import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '@/theme';
import type { DialogVariant } from './dialog.types';

type VariantTheme = {
  iconBg: string;
  iconColor: string;
  titleColor: string;
};

export const variantThemes: Record<DialogVariant, VariantTheme> = {
  default: {
    iconBg: '#F1F5F9',
    iconColor: '#475569',
    titleColor: colors.text,
  },
  destructive: {
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    titleColor: '#B91C1C',
  },
  success: {
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    titleColor: '#15803D',
  },
  warning: {
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
    titleColor: '#B45309',
  },
};

export const dialogStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.base,
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    gap: spacing.xs,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  childrenWrap: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    justifyContent: 'center',
  },
  footerStacked: {
    flexDirection: 'column',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
  },
  actionDefault: {
    backgroundColor: colors.text,
  },
  actionOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionDestructive: {
    backgroundColor: '#DC2626',
  },
  actionGhost: {
    backgroundColor: 'transparent',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  actionTextDefault: {
    color: colors.textInverse,
  },
  actionTextOutline: {
    color: colors.text,
  },
  actionTextDestructive: {
    color: colors.textInverse,
  },
  actionTextGhost: {
    color: colors.textSecondary,
  },
  actionPressed: {
    opacity: 0.85,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closePressed: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
});
