import React from 'react';
import { Text, View } from 'react-native';

import { HelpSettingsMenuRow } from './HelpSettingsMenuRow';
import { helpSettingsStyles as styles } from './helpSettings.styles';
import type { SettingsSectionConfig } from './helpSettings.types';

export interface HelpSettingsSectionProps {
  section: SettingsSectionConfig;
  isFirst?: boolean;
  onRowPress: (id: string) => void;
}

export function HelpSettingsSection(props: HelpSettingsSectionProps): React.ReactElement {
  const { section, isFirst = false, onRowPress } = props;

  return (
    <View style={isFirst ? styles.sectionBlockFirst : styles.sectionBlock}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionLabel}>{section.title}</Text>
        <View style={styles.sectionCount}>
          <Text style={styles.sectionCountText}>{section.rows.length}</Text>
        </View>
      </View>
      <View style={styles.menuCard}>
        {section.rows.map((row, index) => (
          <HelpSettingsMenuRow
            key={row.id}
            row={row}
            isLast={index === section.rows.length - 1}
            onPress={() => onRowPress(row.id)}
          />
        ))}
      </View>
    </View>
  );
}
