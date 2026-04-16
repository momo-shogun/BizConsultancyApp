import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';

export function SafeAreaWrapper(props: SafeAreaViewProps): React.ReactElement {
  return <SafeAreaView {...props} style={[styles.container, props.style]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});

