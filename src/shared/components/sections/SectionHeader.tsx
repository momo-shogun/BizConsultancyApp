import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader(props: SectionHeaderProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {props.subtitle ? <Text style={styles.subtitle}>{props.subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: THEME.spacing[4],
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
});

