import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';

import { radii, spacing } from '@/theme';
import type { ToastVariant } from './toast.types';

type VariantTheme = {
  bg: string;
  border: string;
  icon: string;
  title: string;
  message: string;
  actionText: string;
};

export const variantThemes: Record<ToastVariant, VariantTheme> = {
  success: {
    bg: '#F0FDF4',
    border: '#BBF7D0',
    icon: '#16A34A',
    title: '#15803D',
    message: '#166534',
    actionText: '#16A34A',
  },
  error: {
    bg: '#FEF2F2',
    border: '#FECACA',
    icon: '#DC2626',
    title: '#B91C1C',
    message: '#991B1B',
    actionText: '#DC2626',
  },
  warning: {
    bg: '#FFFBEB',
    border: '#FDE68A',
    icon: '#D97706',
    title: '#B45309',
    message: '#92400E',
    actionText: '#D97706',
  },
  info: {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    icon: '#2563EB',
    title: '#1D4ED8',
    message: '#1E40AF',
    actionText: '#2563EB',
  },
  alert: {
    bg: '#F5F3FF',
    border: '#DDD6FE',
    icon: '#7C3AED',
    title: '#6D28D9',
    message: '#5B21B6',
    actionText: '#7C3AED',
  },
};

export const toastStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    zIndex: 9999,
  },
  wrapperTop: {
    top: 0,
  },
  wrapperBottom: {
    bottom: spacing.lg,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePressed: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
});

export function getVariantContainerStyle(variant: ToastVariant): ViewStyle {
  const t = variantThemes[variant];
  return {
    backgroundColor: t.bg,
    borderColor: t.border,
  };
}

export function getVariantTitleStyle(variant: ToastVariant): TextStyle {
  return { color: variantThemes[variant].title };
}

export function getVariantMessageStyle(variant: ToastVariant): TextStyle {
  return { color: variantThemes[variant].message };
}
