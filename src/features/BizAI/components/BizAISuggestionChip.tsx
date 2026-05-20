import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import type { BizAiSuggestion } from '../constants/bizAiSuggestions';

type BizAISuggestionChipProps = {
  item: BizAiSuggestion;
  index: number;
  onPress: () => void;
};

export function BizAISuggestionChip({
  item,
  index,
  onPress,
}: BizAISuggestionChipProps): React.ReactElement {
  return (
    <Animated.View entering={FadeInDown.delay(60 + index * 35).duration(200)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={item.label}
      >
        <Ionicons name={item.icon} size={16} color="#A5B4FC" />
        <Text style={styles.text} numberOfLines={2}>
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 148,
    minHeight: 72,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: THEME.spacing[8],
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium as '500',
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 18,
  },
});
