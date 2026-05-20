import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

type BizAIBrandCapsuleProps = {
  onPress: () => void;
  compact?: boolean;
};

export function BizAIBrandCapsule({
  onPress,
  compact = false,
}: BizAIBrandCapsuleProps): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Close Biz AI"
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={['rgba(15,23,42,0.94)', 'rgba(30,41,59,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Ionicons name="sparkles" size={compact ? 14 : 16} color="#E0E7FF" />
        {!compact ? <Text style={styles.label}>Biz AI</Text> : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  pressed: {
    opacity: 0.88,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
    letterSpacing: 0.2,
  },
});
