import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import { BIZ_AI_THEME } from '../constants/bizAiTheme';
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
    <Animated.View entering={FadeInDown.delay(80 + index * 40).duration(220)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={item.label}
        accessibilityHint={`Ask: ${item.prompt}`}
      >
        <View style={styles.iconWrap}>
          <Ionicons name={item.icon} size={17} color={BIZ_AI_THEME.text.accentBright} />
        </View>
        <Text style={styles.text} numberOfLines={2}>
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 156,
    minHeight: 88,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[14],
    borderRadius: BIZ_AI_THEME.radius.lg,
    backgroundColor: BIZ_AI_THEME.bg.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.default,
    gap: THEME.spacing[10],
    ...BIZ_AI_THEME.shadow.card,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: BIZ_AI_THEME.bg.surfaceHover,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99,102,241,0.18)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.accent,
  },
  text: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium as '500',
    color: BIZ_AI_THEME.text.primary,
    lineHeight: 20,
  },
});
