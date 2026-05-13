import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { THEME } from '@/constants/theme';

interface LoaderProps {
  visible: boolean;
}

export function Loader(props: LoaderProps): React.ReactElement | null {
  if (!props.visible) return null;

  return (
    <View style={styles.backdrop} pointerEvents="auto">
      <View style={styles.card}>
        <ActivityIndicator size="small" color={THEME.colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 56,
    height: 56,
    borderRadius: THEME.radius[16],
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

