import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import { THEME } from '@/constants/theme';

import { BIZ_AI_THEME } from '../constants/bizAiTheme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type BizAIShortcutPillProps = {
  label: string;
  icon: IoniconName;
  onPress: () => void;
};

export function BizAIShortcutPill({
  label,
  icon,
  onPress,
}: BizAIShortcutPillProps): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={15} color={BIZ_AI_THEME.text.accentBright} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    borderRadius: BIZ_AI_THEME.radius.pill,
    backgroundColor: BIZ_AI_THEME.bg.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.default,
    minHeight: BIZ_AI_THEME.touch.min,
  },
  pillPressed: {
    opacity: 0.88,
    backgroundColor: BIZ_AI_THEME.bg.surfaceHover,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99,102,241,0.16)',
  },
  label: {
    fontSize: THEME.typography.size[13],
    color: BIZ_AI_THEME.text.secondary,
    fontWeight: THEME.typography.weight.medium as '500',
  },
});
