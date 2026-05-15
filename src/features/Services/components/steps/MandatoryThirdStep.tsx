import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StepComponentProps } from '../types';

export function MandatoryThirdStep() {
  return (
    <View style={styles.container}>
      <Text style={styles.callout}>Mandatory review</Text>
      <Text style={styles.title}>Review, confirm, and submit</Text>
      <Text style={styles.description}>
        This step is always required and can be reused inside any onboarding
        flow. It is intentionally decoupled from step logic so it remains a
        stable final step.
      </Text>

      <View style={styles.summaryList}>
        <Text style={styles.bullet}>• Confirm your contact details</Text>
        <Text style={styles.bullet}>• Verify service selections</Text>
        <Text style={styles.bullet}>• Agree to terms and confirmation</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  callout: {
    textTransform: 'uppercase',
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3258',
  },
  description: {
    fontSize: 14,
    color: '#546778',
    lineHeight: 20,
  },
  summaryList: {
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F4F8FC',
    borderWidth: 1,
    borderColor: '#D7E7F5',
  },
  bullet: {
    fontSize: 14,
    color: '#0B3258',
    lineHeight: 20,
  },
});
