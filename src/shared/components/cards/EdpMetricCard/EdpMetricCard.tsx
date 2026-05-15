import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { THEME } from '@/constants/theme';

import { accentAlpha, edpCardBase } from '../edp/edpCardShared';

export interface EdpMetricCardItem {
  label: string;
  value: string;
  icon: string;
  accent: string;
}

export interface EdpMetricCardProps {
  item: EdpMetricCardItem;
  onPress?: () => void;
  style?: ViewStyle;
}

export function EdpMetricCard(props: EdpMetricCardProps): React.ReactElement {
  const { item } = props;
  const accent = item.accent;

  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.card, edpCardBase.cardSurface, props.style]}
      disabled={props.onPress == null}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrap, { borderColor: accentAlpha(accent, 0.33) }]}>
          <View style={[styles.iconInner, { backgroundColor: accentAlpha(accent, 0.13) }]}>
            <Text style={[styles.iconText, { color: accent }]}>{item.icon}</Text>
          </View>
        </View>
        <View style={styles.textCol}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    padding: THEME.spacing[16],
    gap: THEME.spacing[10],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: THEME.typography.size[20],
  },
  textCol: {
    marginLeft: THEME.spacing[12],
    flex: 1,
  },
  value: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
  },
  label: {
    fontSize: THEME.typography.size[12],
    lineHeight: 16,
    color: THEME.colors.textSecondary,
  },
});
