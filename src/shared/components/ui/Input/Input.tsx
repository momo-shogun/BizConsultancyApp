import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { THEME } from '@/constants/theme';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  textContentType?: 'emailAddress' | 'password' | 'telephoneNumber' | 'oneTimeCode' | 'name';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  accessibilityLabel: string;
}

export function Input(props: InputProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        accessibilityLabel={props.accessibilityLabel}
        style={styles.input}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={THEME.colors.textSecondary}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        textContentType={props.textContentType}
        autoCapitalize={props.autoCapitalize ?? 'none'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: THEME.spacing[8],
  },
  label: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.textPrimary,
  },
  input: {
    minHeight: 48,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    paddingHorizontal: THEME.spacing[16],
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[16],
  },
});

