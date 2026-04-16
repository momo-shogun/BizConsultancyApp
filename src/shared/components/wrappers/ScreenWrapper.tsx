import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { THEME } from '@/constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenWrapper(props: ScreenWrapperProps): React.ReactElement {
  return <View style={[styles.container, props.style]}>{props.children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});

