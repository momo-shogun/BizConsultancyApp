import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { radii, shadows, spacing } from '@/theme';
import { useOnboardingFormContext } from '../context/OnboardingFormContext';
import { ONBOARDING_PRICING_STEP_KEY } from './onboardingStepKeys';
import type { StepperProps } from './types';
import { StepRenderer } from './StepRenderer';

export function Stepper({
  steps,
  initialStep = 0,
  onComplete,
  onBeforeNext,
  isProcessing = false,
}: StepperProps) {
  const [activeStep, setActiveStep] = useState(initialStep);

  useEffect(() => {
    setActiveStep(initialStep);
  }, [initialStep]);

  const totalSteps = steps.length;
  const isLastStep = activeStep === totalSteps - 1;
  const isPricingStep = steps[activeStep]?.key === ONBOARDING_PRICING_STEP_KEY;
  const { pricingSummary } = useOnboardingFormContext();

  const isPaidFinish = (pricingSummary?.amountInPaise ?? 0) >= 100;
  const finishLabel = isProcessing
    ? 'Please wait...'
    : isLastStep
      ? isPaidFinish
        ? 'Pay & confirm'
        : 'Confirm registration'
      : 'Next';
  const finishIcon = isLastStep
    ? isPaidFinish
      ? 'card-outline'
      : 'checkmark-circle'
    : 'arrow-forward';

  const progress = useMemo(
    () => Math.round(((activeStep + 1) / totalSteps) * 100),
    [activeStep, totalSteps],
  );

  const progressStyle: ViewStyle = {
    width: `${progress}%`,
  };

  const handleNext = (): void => {
    void (async (): Promise<void> => {
      if (onBeforeNext != null) {
        const allowed = await onBeforeNext(activeStep);
        if (!allowed) {
          return;
        }
      }

      if (isLastStep) {
        await onComplete?.();
        return;
      }

      setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
    })();
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <View style={[styles.container, isPricingStep && styles.containerCompact]}>
      <View style={[styles.progressCard, isPricingStep && styles.progressCardCompact]}>
        {!isPricingStep ? (
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>
              {activeStep === 0
                ? `0/${totalSteps} complete`
                : `${activeStep + 1}/${totalSteps} complete`}
            </Text>
            <Text style={styles.progressTime}>Takes less than 1 min</Text>
          </View>
        ) : null}

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>

      <StepRenderer
        stepIndex={activeStep}
        totalSteps={totalSteps}
        config={steps[activeStep]}
        onNext={handleNext}
        onBack={handleBack}
      />

      <View style={styles.footer}>
        {activeStep > 0 ? (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.backBtn}
            onPress={handleBack}
            disabled={isProcessing}>
            <Ionicons name="arrow-back" size={18} color="#0B3B66" />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.nextBtn,
            isLastStep && styles.finishBtn,
            isLastStep && styles.finishBtnWide,
            isProcessing && styles.btnDisabled,
          ]}
          onPress={handleNext}
          disabled={isProcessing}>
          <Text style={[styles.nextBtnText, isLastStep && styles.finishText]}>
            {finishLabel}
          </Text>
          <Ionicons name={finishIcon} size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  containerCompact: {
    gap: spacing.sm,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECEFF3',
    marginBottom: 16,
  },
  progressCardCompact: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  progressTime: {
    fontSize: 13,
    color: '#98A2B3',
    fontWeight: '500',
  },
  progressTrack: {
    height: 5,
    borderRadius: 10,
    backgroundColor: '#EEF1F4',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#45C15A',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: spacing.md,
  },
  backBtn: {
    flex: 0.48,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0B3B66',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B3B66',
    marginLeft: 6,
  },
  nextBtn: {
    flex: 0.48,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#0B3B66',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishBtn: {
    backgroundColor: '#219653',
  },
  finishBtnWide: {
    flex: 0.58,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 6,
  },
  finishText: {
    color: '#FFFFFF',
  },
  placeholder: {
    flex: 0.48,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
