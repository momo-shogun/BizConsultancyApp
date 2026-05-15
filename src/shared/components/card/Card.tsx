import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type TextProps,
  type ViewProps,
} from 'react-native';

import { colors, radii, shadows, spacing } from '@/theme';

export type CardProps = ViewProps & {
  /** Default surface; `muted` = soft green (notices). */
  variant?: 'default' | 'muted';
  radius?: 'lg' | 'md';
};

/**
 * Root surface: border, radius, shadow, padding, stack margin.
 * Compose with CardHeader / CardTitle / CardDescription / CardContent / CardFooter (shadcn-style).
 */
export function Card({
  style,
  variant = 'default',
  radius = 'lg',
  ...props
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        radius === 'md' && styles.cardRadiusMd,
        variant === 'muted' && styles.cardMuted,
        style,
      ]}
      {...props}
    />
  );
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.header, style]} {...props} />;
}

export type CardTitleProps = TextProps & {
  size?: 'md' | 'sm';
};

export function CardTitle({ style, size = 'md', ...props }: CardTitleProps) {
  return (
    <Text
      style={[size === 'sm' ? styles.titleSm : styles.titleMd, style]}
      {...props}
    />
  );
}

/** Muted supporting line under the title. */
export function CardDescription({ style, ...props }: TextProps) {
  return <Text style={[styles.description, style]} {...props} />;
}

/** Small uppercase label (section eyebrow inside a card). */
export function CardEyebrow({ style, ...props }: TextProps) {
  return <Text style={[styles.eyebrow, style]} {...props} />;
}

/** Main body; use for grouped content below the header. */
export function CardContent({ style, ...props }: ViewProps) {
  return <View style={[styles.content, style]} {...props} />;
}

/** Footer row / footnote; top border by default. */
export function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.footer, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    /** Space between stacked cards on dashboards */
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardRadiusMd: {
    borderRadius: radii.md,
  },
  cardMuted: {
    backgroundColor: colors.successSoft,
    borderColor: 'rgba(21,128,61,0.2)',
  },
  header: {
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  titleMd: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  titleSm: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  content: {
    gap: spacing.xs,
  },
  footer: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
