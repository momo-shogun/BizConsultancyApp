import React from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { THEME } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
  accessibilityLabel: string;
}

export function Button(props: ButtonProps): React.ReactElement {
  const variant = props.variant ?? 'primary';
  const isDisabled = Boolean(props.disabled || props.loading);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
        props.style,
      ]}
      onPress={props.onPress}
      hitSlop={8}
    >
      <Text style={[styles.label, variant === 'primary' ? styles.labelPrimary : styles.labelSecondary]}>
        {props.loading ? 'Please wait…' : props.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: THEME.spacing[16],
    borderRadius: THEME.radius[12],
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: THEME.colors.primary,
  },
  secondary: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold,
  },
  labelPrimary: {
    color: THEME.colors.white,
  },
  labelSecondary: {
    color: THEME.colors.textPrimary,
  },
});

