import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeAreaWrapper } from '@/shared/components';
import { Stepper } from '@/features/Services/components/Stepper';
import { DynamicStep } from '@/features/Services/components/steps/DynamicStep';
import { MandatoryThirdStep } from '@/features/Services/components/steps/MandatoryThirdStep';
import type { StepConfig } from '@/features/Services/components/types';
import { radii, shadows, spacing } from '@/theme';

const stepConfigs: StepConfig[] = [
  {
    key: 'business-info',
    title: 'Business Information',
    description: 'Collect business profile details from the backend-driven form.',
    component: DynamicStep,
    data: {
      fields: ['Business name', 'Registration number', 'Primary service'],
    },
  },
  {
    key: 'service-preferences',
    title: 'Service Preferences',
    description: 'Gather service-specific preferences and expected timeline.',
    component: DynamicStep,
    data: {
      fields: ['Service category', 'Preferred schedule', 'Additional notes'],
    },
  },
  {
    key: 'review-submit',
    title: 'Review & Confirm',
    description: 'This required step is always rendered at the end of the onboarding flow.',
    component: MandatoryThirdStep,
  },
];

const ServiceOnboarding = () => {
  const handleComplete = useCallback(() => {
    console.log('Onboarding flow complete');
  }, []);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          1.5 Lakh +{' '}
          <Text style={styles.lightTitle}>Successful MSME Registrations</Text>
        </Text>

        <View style={[styles.card, shadows.sm]}>
          <Stepper steps={stepConfigs} onComplete={handleComplete} />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ServiceOnboarding;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 140,
    gap: 20,
  },

  title: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '800',
    color: '#0B3258',
    marginBottom: 20,
  },

  lightTitle: {
    color: '#7B8794',
    fontWeight: '700',
  },

  card: {
    marginBottom: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
  },
});
