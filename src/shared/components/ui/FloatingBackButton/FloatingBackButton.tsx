import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

export interface FloatingBackButtonProps {
  onPress: () => void;
  accessibilityLabel?: string;
  topOffset?: number;
}

export function FloatingBackButton(
  props: FloatingBackButtonProps,
): React.ReactElement {
  const topOffset = props.topOffset ?? THEME.spacing[8];

  return (
    <View pointerEvents="box-none" style={[styles.layer, { top: topOffset }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={props.accessibilityLabel ?? 'Go back'}
        onPress={props.onPress}
        hitSlop={8}
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-back" size={22} color={THEME.colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    left: THEME.spacing[14],
    zIndex: 20,
  },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.42)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.28)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  pressed: {
    opacity: 0.75,
  },
});
