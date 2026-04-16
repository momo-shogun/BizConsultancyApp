import React from 'react';
import { ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';

import { THEME } from '@/constants/theme';

export function ScrollWrapper(props: ScrollViewProps): React.ReactElement {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, props.contentContainerStyle]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: THEME.spacing[16],
  },
});

