import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

export interface EdpSectionHeaderProps {
  title: string;
  count?: number;
  onAction?: () => void;
  actionLabel?: string;
}

export function EdpSectionHeader(props: EdpSectionHeaderProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {props.count !== undefined ? (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{props.count}</Text>
        </View>
      ) : null}
      <View style={styles.line} />
      {props.onAction != null ? (
        <Pressable onPress={props.onAction} hitSlop={8} accessibilityRole="button">
          <Text style={styles.action}>{props.actionLabel ?? 'View all'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing[8],
    gap: THEME.spacing[8],
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(15,23,42,0.1)',
    borderRadius: 1,
  },
  countBadge: {
    backgroundColor: 'rgba(245,158,11,0.18)',
    borderRadius: 100,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
  },
  countText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.accentAmber,
  },
  action: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.primary,
  },
});
