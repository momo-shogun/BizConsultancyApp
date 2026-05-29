import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { helpSettingsStyles as styles } from './helpSettings.styles';
import type { SettingsRowConfig } from './helpSettings.types';

export interface HelpSettingsMenuRowProps {
  row: SettingsRowConfig;
  isLast: boolean;
  onPress?: () => void;
}

function HelpSettingsMenuRowComponent(props: HelpSettingsMenuRowProps): React.ReactElement {
  const { row, isLast, onPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${row.title}. ${row.subtitle}`}
      onPress={onPress}
      style={({ pressed }) => [
        isLast ? styles.menuCardItemLast : styles.menuCardItem,
        pressed ? styles.menuCardItemPressed : null,
      ]}
    >
      <View style={[styles.menuIconWrap, { backgroundColor: row.iconBgColor }]}>
        <Ionicons name={row.icon} size={22} color={row.iconColor} />
      </View>

      <View style={styles.menuTextGroup}>
        <Text style={styles.menuTitle} numberOfLines={1}>
          {row.title}
        </Text>
        <Text style={styles.menuSubtitle} numberOfLines={1}>
          {row.subtitle}
        </Text>
      </View>

      <View style={styles.chevronWrap}>
        <Ionicons name="chevron-forward" size={15} color="#475569" />
      </View>
    </Pressable>
  );
}

export const HelpSettingsMenuRow = memo(HelpSettingsMenuRowComponent);
