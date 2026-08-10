import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './CallsHistoryHeader.styles';

export interface CallsHistoryHeaderProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onPressFilter: () => void;
}

function FilterLinesIcon(): React.ReactElement {
  return (
    <View style={styles.filterIcon}>
      <View style={[styles.filterLine, styles.filterLineWide]} />
      <View style={[styles.filterLine, styles.filterLineMid]} />
      <View style={[styles.filterLine, styles.filterLineNarrow]} />
    </View>
  );
}

export function CallsHistoryHeader(props: CallsHistoryHeaderProps): React.ReactElement {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={props.isEditing ? 'Done editing' : 'Edit call history'}
        onPress={props.onToggleEdit}
        style={({ pressed }) => [styles.editPill, pressed ? styles.pressed : null]}
      >
        <Text style={styles.editText}>{props.isEditing ? 'Done' : 'Edit'}</Text>
      </Pressable>

      <Text style={styles.title}>Calls</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filter calls"
        onPress={props.onPressFilter}
        style={({ pressed }) => [styles.iconBtn, pressed ? styles.pressed : null]}
      >
        <FilterLinesIcon />
      </Pressable>
    </View>
  );
}
