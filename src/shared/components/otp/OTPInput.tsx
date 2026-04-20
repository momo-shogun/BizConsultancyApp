import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

interface OTPInputProps {
  value: string;
  length?: number;
  onChange: (value: string) => void;
  accessibilityLabel: string;
  onPress?: () => void;
  activeIndex?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export function OTPInput(props: OTPInputProps): React.ReactElement {
  const length = props.length ?? 6;
  const safeValue = props.value.slice(0, length);

  const digits = Array.from({ length }, (_, idx) => safeValue[idx] ?? '');
  const activeIndex = Math.min(Math.max(props.activeIndex ?? safeValue.length, 0), length - 1);

  return (
    <Pressable
      accessibilityRole="keyboardkey"
      accessibilityLabel={props.accessibilityLabel}
      onPress={props.onPress}
      style={[styles.row, props.containerStyle]}
    >
      {digits.map((d, idx) => (
        <View
          key={idx}
          style={[
            styles.cell,
            idx === activeIndex ? styles.cellActive : null,
            d ? styles.cellFilled : null,
          ]}
        >
          <Text style={styles.digit}>{d}</Text>
        </View>
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    minHeight: 48,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.white,
  },
  cellFilled: {
    backgroundColor: THEME.colors.white,
  },
  digit: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
});

