import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

export function StatsSection(): React.ReactElement {
  return (
    <View style={styles.wrap}>
      <Text style={styles.todo}>TODO: StatsSection (wire API + UI)</Text>
    </View>
  );
}

StatsSection.displayName = 'StatsSection';

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[24],
  },
  todo: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
  },
});