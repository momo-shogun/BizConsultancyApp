import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { showGlobalError } from '@/shared/components';

import { ContactDetailsStep } from './steps/ContactDetailsStep';
import { PreviewStep } from './steps/PreviewStep';
import { ScheduleStep } from './steps/ScheduleStep';
import { useConsultationOnboarding } from '../context/ConsultationOnboardingContext';
import type { ConsultationStepConfig } from '../types/consultationOnboarding.types';
import {
  validateContactStep,
  validateScheduleStep,
} from '../utils/consultationValidation';

interface ConsultationStepperProps {
  onComplete: () => void;
  onStepChange?: (step: number) => void;
}

const STEP_CONFIGS: ConsultationStepConfig[] = [
  {
    key: 'contact-details',
    title: 'Your details',
    description: 'Enter your name, email, and phone number.',
    component: ContactDetailsStep,
  },
  {
    key: 'schedule',
    title: 'Preferred schedule',
    description: 'Choose a date and time slot for your consultation.',
    component: ScheduleStep,
  },
  {
    key: 'preview',
    title: 'Consultation preview',
    description: 'Review your booking before payment.',
    component: PreviewStep,
  },
];

export function ConsultationStepper(props: ConsultationStepperProps): React.ReactElement {
  const { onComplete, onStepChange } = props;
  const { form } = useConsultationOnboarding();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    onStepChange?.(activeStep);
  }, [activeStep, onStepChange]);

  const totalSteps = STEP_CONFIGS.length;
  const isLastStep = activeStep === totalSteps - 1;
  const currentStep = STEP_CONFIGS[activeStep];
  const stepProps = useMemo(
    () => ({ stepIndex: activeStep, totalSteps }),
    [activeStep, totalSteps],
  );

  const validateCurrentStep = useCallback((): string | null => {
    if (activeStep === 0) {
      return validateContactStep(form.contact);
    }
    if (activeStep === 1) {
      return validateScheduleStep(form.selectedDateId, form.selectedTimeSlotId);
    }
    return null;
  }, [activeStep, form.contact, form.selectedDateId, form.selectedTimeSlotId]);

  const handleContinue = useCallback(() => {
    const error = validateCurrentStep();
    if (error != null) {
      showGlobalError(error);
      return;
    }

    if (isLastStep) {
      onComplete();
      return;
    }

    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [isLastStep, onComplete, totalSteps, validateCurrentStep]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{currentStep.title}</Text>
        <Text style={styles.stepDescription}>{currentStep.description}</Text>
        <Text style={styles.stepIndicator}>
          Step {activeStep + 1} of {totalSteps}
        </Text>
      </View>

      {currentStep.key === 'preview' ? (
        <PreviewStep {...stepProps} onEditPress={() => setActiveStep(0)} />
      ) : (
        <currentStep.component {...stepProps} />
      )}

      {isLastStep ? (
        <View style={styles.paymentSection}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Details</Text>
            <View style={styles.paymentAmountWrap}>
              <Text style={styles.paymentAmount}>{form.price.toFixed(2)}/-</Text>
              <Text style={styles.paymentTax}>(Inclusive of Taxes)</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Proceed to payment"
            onPress={handleContinue}
            style={styles.payBtn}
          >
            <Text style={styles.payBtnText}>Proceed to Payment</Text>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.footer}>
          {activeStep > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={handleBack}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={18} color="#0B3B66" />
              <Text style={styles.backBtnText}>Back</Text>
            </Pressable>
          ) : (
            <View style={styles.footerPlaceholder} />
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue"
            onPress={handleContinue}
            style={styles.continueBtn}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  stepHeader: {
    gap: 6,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3258',
  },
  stepDescription: {
    fontSize: 14,
    color: '#5B6B7E',
    lineHeight: 20,
  },
  stepIndicator: {
    fontSize: 13,
    color: '#8B96A6',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  footerPlaceholder: {
    flex: 0.48,
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
    marginLeft: 4,
  },
  continueBtn: {
    flex: 0.48,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#0B3B66',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 4,
  },
  paymentSection: {
    marginTop: 8,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF3',
    paddingTop: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  paymentAmountWrap: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  paymentTax: {
    fontSize: 12,
    color: '#98A2B3',
    marginTop: 2,
  },
  payBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#0B3B66',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  payBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
