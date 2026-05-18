import React from 'react';
import { Text, View } from 'react-native';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import type { ProcessStep } from '../../types';
import { styles } from './ProcessSection.styles';

interface ProcessSectionData {
  title?: string;
  steps?: ProcessStep[];
}

interface ProcessSectionProps {
  process: ProcessSectionData;
}

export function ProcessSection({ process }: ProcessSectionProps): React.ReactElement | null {
  const steps = process.steps ?? [];
  if (steps.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      {process.title != null && process.title.length > 0 ? (
        <Animated.View entering={FadeInUp.duration(350)}>
          <Text style={styles.title}>{process.title}</Text>
        </Animated.View>
      ) : null}

      {steps.map((step, index) => (
        <Animated.View
          key={`${step.number}-${step.title}`}
          entering={FadeInDown.delay(index * 70).duration(400)}
          style={styles.stepCard}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{step.number}</Text>
          </View>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            {step.description.length > 0 ? (
              <Text style={styles.stepDescription}>{step.description}</Text>
            ) : null}
          </View>
        </Animated.View>
      ))}
    </View>
  );
}
