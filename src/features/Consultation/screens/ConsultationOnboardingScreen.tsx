import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CommonActions, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { radii, shadows, spacing } from '@/theme';

import {
  selectEffectiveAccountRole,
  selectHasVerifiedLogin,
} from '@/features/Auth/store/authSelectors';
import { useAppSelector } from '@/store/typedHooks';

import { ConsultationStepper } from '../components/ConsultationStepper';
import { ProgressSegments } from '../components/ProgressSegments';
import { ConsultationOnboardingProvider } from '../context/ConsultationOnboardingContext';
import { useConsultantBookingLoginGate } from '../hooks/useConsultantBookingLoginGate';
import type { ConsultationOnboardingRouteParams } from '../types/consultationOnboarding.types';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof ROUTES.Root.ConsultationOnboarding
>;
type ScreenRoute = RouteProp<RootStackParamList, typeof ROUTES.Root.ConsultationOnboarding>;

function ConsultationOnboardingContent(): React.ReactElement {
  const navigation = useNavigation<NavigationProp>();
  const [activeStep, setActiveStep] = useState(0);
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const accountRole = useAppSelector(selectEffectiveAccountRole);
  const { ensureVerifiedLogin, consultantBookingLoginDialog } = useConsultantBookingLoginGate();

  useEffect(() => {
    if (!hasVerifiedLogin) {
      ensureVerifiedLogin();
    }
  }, [ensureVerifiedLogin, hasVerifiedLogin]);

  const handleComplete = useCallback(
    (_bookingId: number) => {
      /**
       * Clear Root overlays (onboarding / consultant detail) so Back from My Bookings
       * does not return here. Account stack starts at MyBookings only — MyBookings
       * back falls through to the Home tab.
       */
      const showEdp = accountRole !== 'consultant';
      const tabRoutes = [
        { name: ROUTES.App.Home },
        { name: ROUTES.App.Services },
        { name: ROUTES.App.Calls },
        ...(showEdp ? [{ name: ROUTES.App.Edp }] : []),
        {
          name: ROUTES.App.Account,
          state: {
            routes: [{ name: ROUTES.Account.MyBookings }],
            index: 0,
          },
        },
      ];

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: ROUTES.Root.App,
              state: {
                routes: tabRoutes,
                index: tabRoutes.length - 1,
              },
            },
          ],
        }),
      );
    },
    [accountRole, navigation],
  );

  return (
    <>
      {consultantBookingLoginDialog}
      <SafeAreaWrapper edges={['top', 'bottom']}>
        <ScreenHeader title="Consult Expert" onBackPress={() => navigation.goBack()} />
        <ProgressSegments totalSteps={3} activeStep={activeStep} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, shadows.sm]}>
            <ConsultationStepper
              onComplete={handleComplete}
              onStepChange={setActiveStep}
              ensureVerifiedLogin={ensureVerifiedLogin}
            />
          </View>
        </ScrollView>
      </SafeAreaWrapper>
    </>
  );
}

export function ConsultationOnboardingScreen(): React.ReactElement {
  const route = useRoute<ScreenRoute>();

  const params: ConsultationOnboardingRouteParams = {
    consultantId: route.params?.consultantId,
    consultantSlug: route.params?.consultantSlug,
    consultantName: route.params?.consultantName,
    consultationType: route.params?.consultationType,
    callType: route.params?.callType,
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
