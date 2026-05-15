import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StepComponentProps } from '../types';

export function DynamicStep({ config }: StepComponentProps) {
  const fields = (config.data?.fields as string[]) ?? [
    'Placeholder field 1',
    'Placeholder field 2',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>
        {config.description}
      </Text>

      <View style={styles.fieldsContainer}>
        {fields.map(field => (
          <View key={field} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{field}</Text>
            <Text style={styles.fieldValue}>Lorem ipsum</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#546778',
  },
  fieldsContainer: {
    gap: 12,
  },
  fieldRow: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7E7F5',
    backgroundColor: '#F4F8FC',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3258',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 13,
    color: '#5B6B7E',
  },
});
