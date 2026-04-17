import React from 'react';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';

import { THEME } from '@/constants/theme';

interface BaseProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

/**
 * Shadcn-like Card primitives for React Native.
 * Compose: <Card><CardHeader /><CardContent /><CardFooter /></Card>
 */
export function Card(props: BaseProps): React.ReactElement {
  return <View style={[styles.card, props.style]}>{props.children}</View>;
}

export function CardHeader(props: BaseProps): React.ReactElement {
  return <View style={[styles.header, props.style]}>{props.children}</View>;
}

export function CardContent(props: BaseProps): React.ReactElement {
  return <View style={[styles.content, props.style]}>{props.children}</View>;
}

export function CardFooter(props: BaseProps): React.ReactElement {
  return <View style={[styles.footer, props.style]}>{props.children}</View>;
}

export function CardTitle(props: TextProps): React.ReactElement {
  return <Text style={[styles.title, props.style]}>{props.children}</Text>;
}

export function CardDescription(props: TextProps): React.ReactElement {
  return <Text style={[styles.description, props.style]}>{props.children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  header: {
    padding: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  content: {
    padding: THEME.spacing[16],
  },
  footer: {
    padding: THEME.spacing[16],
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
  description: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    lineHeight: 20,
  },
});

