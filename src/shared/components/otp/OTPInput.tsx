import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

interface OTPInputProps {
  value: string;
  length?: number;
  onChange: (value: string) => void;
  accessibilityLabel: string;
}

export function OTPInput(props: OTPInputProps): React.ReactElement {
  const length = props.length ?? 6;
  const safeValue = props.value.slice(0, length);

  const digits = Array.from({ length }, (_, idx) => safeValue[idx] ?? '');

  return (
    <Pressable
      accessibilityRole="keyboardkey"
      accessibilityLabel={props.accessibilityLabel}
      onPress={() => undefined}
      style={styles.row}
    >
      {digits.map((d, idx) => (
        <View key={idx} style={styles.cell}>
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
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
});

