import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

interface DashboardCardProps {
  title: string;
  value: string;
  hint?: string;
}

export function DashboardCard(props: DashboardCardProps): React.ReactElement {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.value}>{props.value}</Text>
      {props.hint ? <Text style={styles.hint}>{props.hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  title: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.medium,
  },
  value: {
    fontSize: THEME.typography.size[24],
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.bold,
  },
  hint: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
});

