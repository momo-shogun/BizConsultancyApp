import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import type { StepRendererProps } from './types';

export function StepRenderer({
  stepIndex,
  totalSteps,
  config,
  onNext,
  onBack,
}: StepRendererProps) {
  const StepComponent = config.component;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.description}>{config.description}</Text>
        <Text style={styles.stepIndicator}>
          Step {stepIndex + 1} of {totalSteps}
        </Text>
      </View>

      <StepComponent
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        config={config}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B3258',
  },
  description: {
    fontSize: 14,
    color: '#5B6B7E',
    lineHeight: 20,
  },
  stepIndicator: {
    fontSize: 13,
    color: '#8B96A6',
    fontWeight: '600',
  },
});
