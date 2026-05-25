import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { SafeAreaWrapper } from '@/shared/components';
import type { ServicesStackParamList } from '@/navigation/types';
import { ROUTES } from '@/navigation/routeNames';

import { Stepper } from '@/features/Services/components/Stepper';
import { OnboardingFormProvider } from '@/features/Services/context/OnboardingFormContext';
import { useServiceOnboardingWizard } from '@/features/Services/hooks/useServiceOnboardingWizard';
import { radii, shadows, spacing } from '@/theme';

type ServiceOnboardingRoute = RouteProp<
  ServicesStackParamList,
  typeof ROUTES.Services.Onboarding
>;

const ServiceOnboarding = (): React.ReactElement => {
  const route = useRoute<ServiceOnboardingRoute>();
  const slug = route.params.slug;
  const submissionId = route.params.submissionId;

  const wizard = useServiceOnboardingWizard({ slug, submissionIdParam: submissionId });

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
          {wizard.errorMessage != null ? (
            <Text style={styles.errorBanner}>{wizard.errorMessage}</Text>
          ) : null}

          {wizard.isLoading || !wizard.isAuthenticated ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#0B3B66" />
              <Text style={styles.loadingText}>Loading your registration form…</Text>
            </View>
          ) : (
            <OnboardingFormProvider
              allQuestions={wizard.allQuestions}
              formValues={wizard.formValues}
              errors={wizard.errors}
              pricingSummary={wizard.pricingSummary}
              onFormValuesChange={wizard.setFormValues}>
              <Stepper
                steps={wizard.stepConfigs}
                initialStep={wizard.initialStepIndex}
                onBeforeNext={wizard.handleBeforeNext}
                onComplete={wizard.handleComplete}
                isProcessing={wizard.isProcessing}
              />
            </OnboardingFormProvider>
          )}
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
  errorBanner: {
    fontSize: 13,
    color: '#DC2626',
    marginBottom: 12,
    lineHeight: 18,
  },
  loadingWrap: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#546778',
  },
});
