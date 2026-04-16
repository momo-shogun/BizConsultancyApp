import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, type ViewStyle } from 'react-native';

interface KeyboardWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function KeyboardWrapper(props: KeyboardWrapperProps): React.ReactElement {
  return (
    <KeyboardAvoidingView
      style={[styles.container, props.style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {props.children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

