import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

export interface EdpStatsStripItem {
  label: string;
  value: string;
}

export interface EdpStatsStripProps {
  items: EdpStatsStripItem[];
}

export function EdpStatsStrip(props: EdpStatsStripProps): React.ReactElement {
  return (
    <View style={styles.strip}>
      {props.items.map((item, index) => (
        <View
          key={item.label}
          style={[styles.item, index < props.items.length - 1 ? styles.itemBorder : null]}
        >
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const STRIP_BG = '#0B3D2C';

const styles = StyleSheet.create({
  strip: {
    backgroundColor: STRIP_BG,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    paddingVertical: THEME.spacing[14],
    alignItems: 'center',
  },
  itemBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  value: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    letterSpacing: -0.2,
  },
  label: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
});
