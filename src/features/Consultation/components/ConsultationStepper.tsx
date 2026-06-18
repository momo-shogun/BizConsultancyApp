import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DiagnosisPaymentModal } from '@/features/Diagnostics/components/DiagnosisPaymentModal';
import { useGetMyWalletBalanceQuery } from '@/features/Home/api/userWalletsApi';
import { baseApi } from '@/services/api/baseApi';
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
import { CONSULTANT_BOOKING_LOGIN_MESSAGE } from '../hooks/useConsultantBookingLoginGate';
import { openConsultationRazorpayCheckout } from '../services/consultationRazorpayCheckout';
import type { ConsultationStepConfig } from '../types/consultationOnboarding.types';
import type {
  ConsultantBookingResponse,
  CreateConsultantBookingPayload,
} from '../types/consultantBooking.types';
import { buildCreateConsultantBookingPayload } from '../utils/consultationBooking';
import { isConsultationPaymentCancelled } from '../utils/consultationPaymentFlow';
import {
  validateBookingSubmit,
  validateContactStep,
  validateScheduleStep,
} from '../utils/consultationValidation';

const consultationStepperApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    payConsultantBookingWithWallet: build.mutation<ConsultantBookingResponse, number>({
      query: (bookingId) => ({
        url: `consultant-bookings/${bookingId}/pay-wallet`,
        method: 'POST',
      }),
    }),
  }),
});

const { usePayConsultantBookingWithWalletMutation } = consultationStepperApi;

interface ConsultationStepperProps {
  onComplete: (bookingId: number) => void;
  onStepChange?: (step: number) => void;
  ensureVerifiedLogin?: () => boolean;
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
        if (message.toLowerCase().includes('unauthorized')) {
          return CONSULTANT_BOOKING_LOGIN_MESSAGE;
        }
        return message;
      }
      if (Array.isArray(message) && message.length > 0) {
        const joined = message.map(String).join(', ');
        if (joined.toLowerCase().includes('unauthorized')) {
          return CONSULTANT_BOOKING_LOGIN_MESSAGE;
        }
        return joined;
      }
    }
  }
  if (error != null && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    if (status === 401) {
      return CONSULTANT_BOOKING_LOGIN_MESSAGE;
    }
  }
  return 'Could not create booking. Please try again.';
}

function bookingRequiresPayment(booking: ConsultantBookingResponse): boolean {
  if (booking.paymentStatus === 'paid') {
    return false;
  }
  const amount = booking.amount;
  if (amount != null && amount < 1) {
    return false;
  }
  return true;
}

function formatConsultationTypeLabel(type: string): string {
  if (type === 'video') {
    return 'Video consultation';
  }
  if (type === 'phone') {
    return 'Audio consultation';
  }
  return 'Consultation';
}

export function ConsultationStepper(props: ConsultationStepperProps): React.ReactElement {
  const { onComplete, onStepChange, ensureVerifiedLogin } = props;
  const { form, selectedTimeSlot } = useConsultationOnboarding();
  const [createBooking, { isLoading: isCreatingBooking }] = useCreateConsultantBookingMutation();
  const [createRazorpayOrder] = useCreateConsultantBookingRazorpayOrderMutation();
  const [verifyPayment] = useVerifyConsultantBookingPaymentMutation();
  const [payWithWalletMutation] = usePayConsultantBookingWithWalletMutation();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<number | null>(null);
  const [payingWith, setPayingWith] = useState<'razorpay' | 'wallet' | null>(null);
  const [isPaymentBusy, setIsPaymentBusy] = useState(false);

  const { data: walletBalance } = useGetMyWalletBalanceQuery(undefined, {
    skip: !paymentModalVisible,
  });

  const walletBalanceRupees =
    walletBalance != null && Number.isFinite(walletBalance) ? walletBalance : null;

  const amountRupees = Math.max(0, Math.round(form.price));
  const canPayWithWallet =
    amountRupees > 0 &&
    walletBalanceRupees != null &&
    walletBalanceRupees >= amountRupees;

  const consultantName = (form.consultantName ?? '').trim() || 'Consultant';
  const paymentTitle = `${consultantName} · ${formatConsultationTypeLabel(form.consultationType)}`;
  const isConfirmBusy = isCreatingBooking || isPaymentBusy;

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
      return validateScheduleStep(form.preferredDate, selectedTimeSlot);
    }
    return null;
  }, [activeStep, form.contact, form.preferredDate, selectedTimeSlot]);

  const buildBookingPayload = useCallback((): CreateConsultantBookingPayload | null => {
    const slotTime = selectedTimeSlot?.label ?? form.selectedTimeSlotId ?? '';
    return buildCreateConsultantBookingPayload(form, slotTime);
  }, [form, selectedTimeSlot]);

  const handleBookingSuccess = useCallback(
    (booking: ConsultantBookingResponse, paid: boolean): void => {
      showGlobalToast({
        variant: 'success',
        message: paid
          ? 'Payment successful! Your consultation is confirmed.'
          : 'Consultation booked successfully.',
      });
      setPaymentModalVisible(false);
      setPendingBookingId(null);
      setPayingWith(null);
      onComplete(booking.id);
    },
    [onComplete],
  );

  const closePaymentModal = useCallback((): void => {
    if (isPaymentBusy) {
      return;
    }
    setPaymentModalVisible(false);
    setPayingWith(null);
    if (pendingBookingId != null) {
      showGlobalToast({
        variant: 'info',
        message: 'Payment cancelled. Your booking is saved — pay when ready.',
      });
    }
    setPendingBookingId(null);
  }, [isPaymentBusy, pendingBookingId]);

  const payWithWallet = useCallback(async (): Promise<void> => {
    if (pendingBookingId == null) {
      return;
    }
    setIsPaymentBusy(true);
    setPayingWith('wallet');
    try {
      const booking = await payWithWalletMutation(pendingBookingId).unwrap();
      handleBookingSuccess(booking, true);
    } catch (err: unknown) {
      showGlobalError(bookingErrorMessage(err));
    } finally {
      setIsPaymentBusy(false);
      setPayingWith(null);
    }
  }, [handleBookingSuccess, payWithWalletMutation, pendingBookingId]);

  const payWithRazorpay = useCallback(async (): Promise<void> => {
    if (pendingBookingId == null) {
      return;
    }
    setIsPaymentBusy(true);
    setPayingWith('razorpay');
    try {
      const order = await createRazorpayOrder(pendingBookingId).unwrap();
      setPaymentModalVisible(false);

      const payment = await openConsultationRazorpayCheckout({
        order,
        consultantName,
        customerName: form.contact.fullName,
        customerEmail: form.contact.email,
        customerPhone: form.contact.phone,
      });

      const booking = await verifyPayment({
        bookingId: pendingBookingId,
        body: {
          razorpayPaymentId: payment.razorpay_payment_id,
          razorpayOrderId: payment.razorpay_order_id,
          razorpaySignature: payment.razorpay_signature,
        },
      }).unwrap();

      handleBookingSuccess(booking, true);
    } catch (err: unknown) {
      if (isConsultationPaymentCancelled(err)) {
        showGlobalToast({
          variant: 'info',
          message: 'Payment cancelled. Your booking is saved — pay when ready.',
        });
        setPendingBookingId(null);
        return;
      }
      showGlobalError(bookingErrorMessage(err));
    } finally {
      setIsPaymentBusy(false);
      setPayingWith(null);
    }
  }, [
    consultantName,
    createRazorpayOrder,
    form.contact.email,
    form.contact.fullName,
    form.contact.phone,
    handleBookingSuccess,
    pendingBookingId,
    verifyPayment,
  ]);

  const startBookingCheckout = useCallback(async (): Promise<void> => {
    if (ensureVerifiedLogin != null && !ensureVerifiedLogin()) {
      return;
    }

    const submitError = validateBookingSubmit(form, selectedTimeSlot);
    if (submitError != null) {
      showGlobalError(submitError);
      return;
    }

    const payload = buildBookingPayload();
    if (payload == null) {
      showGlobalError('Booking details are incomplete.');
      return;
    }

    try {
      const booking = await createBooking(payload).unwrap();

      if (!bookingRequiresPayment(booking) || amountRupees < 1) {
        handleBookingSuccess(booking, false);
        return;
      }

      setPendingBookingId(booking.id);
      setPaymentModalVisible(true);
    } catch (err: unknown) {
      showGlobalError(bookingErrorMessage(err));
    }
  }, [
    amountRupees,
    buildBookingPayload,
    createBooking,
    form,
    handleBookingSuccess,
    ensureVerifiedLogin,
    selectedTimeSlot,
  ]);

  const handleContinue = useCallback(() => {
    const error = validateCurrentStep();
    if (error != null) {
      showGlobalError(error);
      return;
    }

    if (isLastStep) {
      void startBookingCheckout();
      return;
    }

    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
<<<<<<< HEAD
  }, [isLastStep, startBookingCheckout, totalSteps, validateCurrentStep]);
=======
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
>>>>>>> d9ce79b (solving issues)

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  return (
    <>
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
            disabled={isConfirmBusy}
            onPress={handleContinue}
            style={[styles.payBtn, isConfirmBusy ? styles.payBtnDisabled : null]}
          >
            {isConfirmBusy && !paymentModalVisible ? (
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

    <DiagnosisPaymentModal
      visible={paymentModalVisible}
      packTitle={paymentTitle}
      amountRupees={amountRupees}
      walletBalanceRupees={walletBalanceRupees}
      canPayWithWallet={canPayWithWallet}
      payingWith={payingWith}
      isBusy={isPaymentBusy}
      onClose={closePaymentModal}
      onPayRazorpay={() => void payWithRazorpay()}
      onPayWallet={() => void payWithWallet()}
    />
    </>
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
