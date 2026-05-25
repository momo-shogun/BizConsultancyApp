import React from 'react';
import { StyleSheet, View } from 'react-native';

export function MyServiceCardSkeleton(): React.ReactElement {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.body}>
        <View style={styles.lineLg} />
        <View style={styles.lineSm} />
        <View style={styles.metaRow}>
          <View style={styles.chip} />
          <View style={styles.chipWide} />
        </View>
        <View style={styles.actions}>
          <View style={styles.btn} />
          <View style={styles.btnPrimary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDF2',
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    backgroundColor: '#E2E8F0',
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 10,
  },
  lineLg: {
    height: 16,
    width: '72%',
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  lineSm: {
    height: 12,
    width: '40%',
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    height: 22,
    width: 64,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  chipWide: {
    height: 22,
    width: 100,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    height: 34,
    width: 88,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  btnPrimary: {
    height: 34,
    width: 100,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
});
