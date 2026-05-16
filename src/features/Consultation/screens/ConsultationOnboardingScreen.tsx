import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader, showGlobalToast } from '@/shared/components';
import { radii, shadows, spacing } from '@/theme';

import { ConsultationStepper } from '../components/ConsultationStepper';
import { ProgressSegments } from '../components/ProgressSegments';
import { ConsultationOnboardingProvider } from '../context/ConsultationOnboardingContext';
import type { ConsultationOnboardingRouteParams } from '../types/consultationOnboarding.types';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof ROUTES.Root.ConsultationOnboarding
>;
type ScreenRoute = RouteProp<RootStackParamList, typeof ROUTES.Root.ConsultationOnboarding>;

function ConsultationOnboardingContent(): React.ReactElement {
  const navigation = useNavigation<NavigationProp>();
  const [activeStep, setActiveStep] = useState(0);

  const handleComplete = useCallback(() => {
    showGlobalToast({
      variant: 'success',
      message: 'Consultation booking saved. Payment flow coming soon.',
    });
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Consult Expert" onBackPress={() => navigation.goBack()} />
      <ProgressSegments totalSteps={3} activeStep={activeStep} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, shadows.sm]}>
          <ConsultationStepper onComplete={handleComplete} onStepChange={setActiveStep} />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

export function ConsultationOnboardingScreen(): React.ReactElement {
  const route = useRoute<ScreenRoute>();

  const params: ConsultationOnboardingRouteParams = {
    consultantSlug: route.params?.consultantSlug,
    consultantName: route.params?.consultantName,
    problemCategory: route.params?.problemCategory,
    problemSubCategory: route.params?.problemSubCategory,
    consultationType: route.params?.consultationType,
    callType: route.params?.callType,
    city: route.params?.city,
    language: route.params?.language,
    price: route.params?.price,
  };

  return (
    <ConsultationOnboardingProvider params={params}>
      <ConsultationOnboardingContent />
    </ConsultationOnboardingProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  card: {
    borderRadius: radii.lg,
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
  },
});
