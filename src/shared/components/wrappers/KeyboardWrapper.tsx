import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  type KeyboardAvoidingViewProps,
  type ViewStyle,
} from 'react-native';

export interface KeyboardWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Extra offset for stacked headers (status bar + nav). */
  keyboardVerticalOffset?: number;
  behavior?: KeyboardAvoidingViewProps['behavior'];
  enabled?: boolean;
}

export function KeyboardWrapper(props: KeyboardWrapperProps): React.ReactElement {
  const behavior =
    props.behavior ?? (Platform.OS === 'ios' ? 'padding' : 'padding');

  return (
    <KeyboardAvoidingView
      style={[styles.container, props.style]}
      behavior={behavior}
      enabled={props.enabled ?? true}
      keyboardVerticalOffset={props.keyboardVerticalOffset ?? 0}
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
