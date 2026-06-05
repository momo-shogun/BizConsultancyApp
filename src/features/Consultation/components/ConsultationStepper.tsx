import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { showGlobalError, showGlobalToast } from '@/shared/components';

import {
  useCreateConsultantBookingMutation,
  useCreateConsultantBookingRazorpayOrderMutation,
  useVerifyConsultantBookingPaymentMutation,
} from '../api/consultantBookingsApi';
import { ContactDetailsStep } from './steps/ContactDetailsStep';
import { PreviewStep } from './steps/PreviewStep';
import { ScheduleStep } from './steps/ScheduleStep';
import { useConsultationOnboarding } from '../context/ConsultationOnboardingContext';
import type { ConsultationStepConfig } from '../types/consultationOnboarding.types';
import { buildCreateConsultantBookingPayload } from '../utils/consultationBooking';
import {
  isConsultationPaymentCancelled,
  submitConsultationBooking,
} from '../utils/consultationPaymentFlow';
import {
  validateBookingSubmit,
  validateContactStep,
  validateScheduleStep,
} from '../utils/consultationValidation';

interface ConsultationStepperProps {
  onComplete: (bookingId: number) => void;
  onStepChange?: (step: number) => void;
}

const STEP_CONFIGS: ConsultationStepConfig[] = [
  {
    key: 'contact-details',
    title: 'Your details',
    description: 'Choose audio or video call, then enter your contact details.',
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

function bookingErrorMessage(error: unknown): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data != null && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
      if (Array.isArray(message) && message.length > 0) {
        return message.map(String).join(', ');
      }
    }
  }
  return 'Could not create booking. Please try again.';
}

export function ConsultationStepper(props: ConsultationStepperProps): React.ReactElement {
  const { onComplete, onStepChange } = props;
  const { form, selectedTimeSlot } = useConsultationOnboarding();
  const [createBooking, { isLoading: isCreatingBooking }] = useCreateConsultantBookingMutation();
  const [createRazorpayOrder, { isLoading: isCreatingOrder }] =
    useCreateConsultantBookingRazorpayOrderMutation();
  const [verifyPayment, { isLoading: isVerifyingPayment }] =
    useVerifyConsultantBookingPaymentMutation();
  const isSubmitting = isCreatingBooking || isCreatingOrder || isVerifyingPayment;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    onStepChange?.(activeStep);
  }, [activeStep, onStepChange]);

  const totalSteps = STEP_CONFIGS.length;
  const isLastStep = activeStep === totalSteps - 1;
  const paymentAmountLabel =
    form.price > 0 ? `₹${Math.round(form.price).toLocaleString('en-IN')}/-` : 'Free';
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
      return validateScheduleStep(form.preferredDate, form.selectedTimeSlotId);
    }
    return null;
  }, [activeStep, form.contact, form.preferredDate, form.selectedTimeSlotId]);

  const handleContinue = useCallback(() => {
    const error = validateCurrentStep();
    if (error != null) {
      showGlobalError(error);
      return;
    }

    if (isLastStep) {
      const submitError = validateBookingSubmit(form);
      if (submitError != null) {
        showGlobalError(submitError);
        return;
      }
      const slotTime = selectedTimeSlot?.label ?? form.selectedTimeSlotId ?? '';
      const payload = buildCreateConsultantBookingPayload(form, slotTime);
      if (payload == null) {
        showGlobalError('Booking details are incomplete.');
        return;
      }

      const consultantName = (form.consultantName ?? '').trim() || 'Consultant';

      void submitConsultationBooking({
        payload,
        form,
        consultantName,
        createBooking: (body) => createBooking(body).unwrap(),
        createOrder: (bookingId) => createRazorpayOrder(bookingId).unwrap(),
        verifyPayment: (bookingId, body) =>
          verifyPayment({ bookingId, body }).unwrap(),
      })
        .then((booking) => {
          showGlobalToast({
            variant: 'success',
            message:
              form.price < 1
                ? 'Consultation booked successfully.'
                : 'Payment successful! Your consultation is confirmed.',
          });
          onComplete(booking.id);
        })
        .catch((err: unknown) => {
          if (isConsultationPaymentCancelled(err)) {
            showGlobalToast({
              variant: 'info',
              message: 'Payment cancelled. Your booking is saved — pay when ready.',
            });
            return;
          }
          showGlobalError(bookingErrorMessage(err));
        });
      return;
    }

    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [
    createBooking,
    createRazorpayOrder,
    form,
    isLastStep,
    onComplete,
    selectedTimeSlot?.label,
    totalSteps,
    validateCurrentStep,
    verifyPayment,
  ]);

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
              <Text style={styles.paymentAmount}>{paymentAmountLabel}</Text>
              {form.price > 0 ? (
                <Text style={styles.paymentTax}>(Inclusive of Taxes)</Text>
              ) : null}
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Confirm booking"
            disabled={isSubmitting}
            onPress={handleContinue}
            style={[styles.payBtn, isSubmitting ? styles.payBtnDisabled : null]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.payBtnText}>Confirm booking</Text>
                <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
              </>
            )}
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
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
