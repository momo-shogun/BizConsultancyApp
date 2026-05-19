import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BizAIFloatingEntry } from '../components/BizAIFloatingEntry';

type BizAITabOverlayProps = {
  children: React.ReactNode;
};

/** Wraps the main tab navigator and renders the floating Biz AI entry above the tab bar. */
export function BizAITabOverlay({ children }: BizAITabOverlayProps): React.ReactElement {
  return (
    <View style={styles.root}>
      {children}
      <BizAIFloatingEntry />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
