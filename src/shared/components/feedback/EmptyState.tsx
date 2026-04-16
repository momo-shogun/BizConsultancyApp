import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState(props: EmptyStateProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {props.description ? <Text style={styles.description}>{props.description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing[16],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: THEME.typography.size[18],
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.semibold,
  },
  description: {
    marginTop: THEME.spacing[8],
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
});

