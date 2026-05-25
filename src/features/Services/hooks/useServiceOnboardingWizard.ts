import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  selectAccountRole,
  selectDisplayName,
  selectIsAuthenticated,
  selectLoggedInEmail,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import {
  useGetConsultantWalletBalanceQuery,
  useGetMyWalletBalanceQuery,
} from '@/features/Home/api/userWalletsApi';
import { ROUTES } from '@/navigation/routeNames';
import type { ServicesStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';

import {
  useCreateOnboardingOrderMutation,
  useLazyGetMyOnboardingSubmissionQuery,
  useLazyGetMyOnboardingSubmissionQuestionsQuery,
  useSaveOnboardingDraftMutation,
  useSubmitOnboardingMutation,
  useUpsertServiceIntakeMutation,
} from '../api/serviceOnboardingApi';
import {
  useGetPublicServiceFormBySlugQuery,
  useGetPublicServicePageBySlugQuery,
} from '../api/servicesApi';
import type { StepConfig } from '../components/types';
import type {
  OnboardingFieldValue,
  OnboardingForm,
  OnboardingFormQuestion,
  OnboardingPricingSummary,
} from '../types/serviceOnboarding.types';
import {
  buildDraftPayload,
  buildIntakePayload,
  buildSubmitPayload,
  type OnboardingContactFields,
} from '../utils/onboarding/onboardingPayloads';
import { buildPricingSummary } from '../utils/onboarding/onboardingPricing';
import {
  buildDefaultFormValues,
  buildOnboardingStepConfigs,
  getQuestionsForStepIndex,
  inferResumeStepIndex,
  isPricingStepIndex,
  mergeAnswersIntoDefaults,
  sortQuestions,
} from '../utils/onboarding/onboardingSteps';
import { validateStepQuestions } from '../utils/onboarding/onboardingValidation';
import {
  openServiceOnboardingRazorpayCheckout,
  ServiceOnboardingPaymentCancelledError,
} from '../services/serviceOnboardingRazorpayCheckout';

function isFetchNotFound(error: unknown): boolean {
  if (error == null || typeof error !== 'object') {
    return false;
  }
  const status = (error as FetchBaseQueryError).status;
  return status === 404;
}

export interface UseServiceOnboardingWizardParams {
  slug: string;
  submissionIdParam?: number;
}

export interface UseServiceOnboardingWizardResult {
  stepConfigs: StepConfig[];
  initialStepIndex: number;
  formValues: Record<string, OnboardingFieldValue>;
  errors: Record<string, string | undefined>;
  allQuestions: OnboardingFormQuestion[];
  pricingSummary: OnboardingPricingSummary | null;
  isLoading: boolean;
  isProcessing: boolean;
  errorMessage: string | null;
  isAuthenticated: boolean;
  setFormValues: (
    updater: (
      prev: Record<string, OnboardingFieldValue>,
    ) => Record<string, OnboardingFieldValue>,
  ) => void;
  handleBeforeNext: (stepIndex: number) => Promise<boolean>;
  handleComplete: () => Promise<void>;
}

export function useServiceOnboardingWizard({
  slug,
  submissionIdParam,
}: UseServiceOnboardingWizardParams): UseServiceOnboardingWizardResult {
  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const displayName = useAppSelector(selectDisplayName);
  const email = useAppSelector(selectLoggedInEmail);
  const mobile = useAppSelector(selectLoggedInMobile);
  const accountRole = useAppSelector(selectAccountRole);
  const isConsultant = accountRole === 'consultant';

  const {
    data: servicePage,
    isLoading: pageLoading,
    isError: pageError,
  } = useGetPublicServicePageBySlugQuery(slug, { skip: slug.length === 0 });

  const {
    data: formConfigResponse,
    isLoading: formLoading,
    isError: formQueryError,
    error: formQueryErrorDetail,
  } = useGetPublicServiceFormBySlugQuery(slug, { skip: slug.length === 0 });

  const formConfigMissing = formQueryError && isFetchNotFound(formQueryErrorDetail);
  const activeForm: OnboardingForm | null = formConfigMissing
    ? null
    : (formConfigResponse?.form ?? null);

  const [resumeQuestions, setResumeQuestions] = useState<OnboardingFormQuestion[] | null>(
    null,
  );
  const [submissionId, setSubmissionId] = useState<number | null>(
    submissionIdParam != null && Number.isFinite(submissionIdParam)
      ? submissionIdParam
      : null,
  );
  const [formValues, setFormValues] = useState<Record<string, OnboardingFieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [initialStepIndex, setInitialStepIndex] = useState(0);
  const [formReady, setFormReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentModalActive, setPaymentModalActive] = useState(false);

  const [upsertIntake] = useUpsertServiceIntakeMutation();
  const [saveDraft] = useSaveOnboardingDraftMutation();
  const [submitOnboarding] = useSubmitOnboardingMutation();
  const [createOrder] = useCreateOnboardingOrderMutation();
  const [fetchSubmission] = useLazyGetMyOnboardingSubmissionQuery();
  const [fetchSubmissionQuestions] = useLazyGetMyOnboardingSubmissionQuestionsQuery();

  const { data: userWalletBalance } = useGetMyWalletBalanceQuery(undefined, {
    skip: !isAuthenticated || !paymentModalActive || isConsultant,
  });
  const { data: consultantWalletBalance } = useGetConsultantWalletBalanceQuery(undefined, {
    skip: !isAuthenticated || !paymentModalActive || !isConsultant,
  });

  const allQuestions = useMemo((): OnboardingFormQuestion[] => {
    if (resumeQuestions != null && resumeQuestions.length > 0) {
      return sortQuestions(resumeQuestions);
    }
    return sortQuestions(activeForm?.questions ?? []);
  }, [activeForm, resumeQuestions]);

  const stepConfigs = useMemo(
    () => buildOnboardingStepConfigs(allQuestions),
    [allQuestions],
  );

  const contact = useMemo((): OnboardingContactFields => {
    return {
      name: (displayName ?? '').trim(),
      email: (email ?? '').trim(),
      mobile: (mobile ?? '').trim(),
      city: '',
    };
  }, [displayName, email, mobile]);

  const pricingSummary = useMemo((): OnboardingPricingSummary | null => {
    if (servicePage == null) {
      return null;
    }
    return buildPricingSummary({
      serviceTitle: servicePage.title,
      price: servicePage.price,
      isGstIncluded: servicePage.isGstIncluded,
      gstPercent: servicePage.gstPercent,
      cost: servicePage.cost,
    });
  }, [servicePage]);

  const serviceSlug = (activeForm?.serviceSlug?.trim() || slug).trim();

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert('Login required', 'Please sign in to continue with service registration.', [
        {
          text: 'Sign in',
          onPress: () =>
            navigation.getParent()?.navigate(ROUTES.Root.Auth, {
              screen: ROUTES.Auth.Login,
            }),
        },
        { text: 'Go back', style: 'cancel', onPress: () => navigation.goBack() },
      ]);
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    setFormReady(false);
    setResumeQuestions(null);
    setSubmissionId(
      submissionIdParam != null && Number.isFinite(submissionIdParam)
        ? submissionIdParam
        : null,
    );
  }, [slug, submissionIdParam]);

  useEffect(() => {
    if (!isAuthenticated || slug.length === 0 || servicePage == null) {
      return;
    }
    if (submissionIdParam != null && Number.isFinite(submissionIdParam)) {
      return;
    }

    let cancelled = false;
    void (async (): Promise<void> => {
      try {
        const result = await upsertIntake(
          buildIntakePayload({
            serviceSlug: slug,
            form: activeForm,
            serviceTitle: servicePage.title,
            contact,
          }),
        ).unwrap();
        if (!cancelled) {
          setSubmissionId(result.id);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setErrorMessage(getApiErrorMessage(err, 'Could not start registration.'));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    slug,
    servicePage,
    activeForm,
    contact,
    submissionIdParam,
    upsertIntake,
  ]);

  useEffect(() => {
    if (
      submissionIdParam == null ||
      !Number.isFinite(submissionIdParam) ||
      !isAuthenticated
    ) {
      return;
    }

    let cancelled = false;
    void (async (): Promise<void> => {
      try {
        const questionsResult = await fetchSubmissionQuestions(
          submissionIdParam,
        ).unwrap();
        if (!cancelled && questionsResult.length > 0) {
          setResumeQuestions(questionsResult);
        }
      } catch {
        if (!cancelled) {
          setResumeQuestions(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [submissionIdParam, isAuthenticated, fetchSubmissionQuestions]);

  useEffect(() => {
    if (!formReady && (pageLoading || (formLoading && !formConfigMissing))) {
      return;
    }

    let cancelled = false;

    const init = async (): Promise<void> => {
      const questions = allQuestions;
      const configs = buildOnboardingStepConfigs(questions);

      if (
        submissionIdParam != null &&
        Number.isFinite(submissionIdParam) &&
        isAuthenticated
      ) {
        try {
          const row = await fetchSubmission(submissionIdParam).unwrap();
          if (cancelled) {
            return;
          }
          setSubmissionId(row.id);
          const merged = mergeAnswersIntoDefaults(questions, row.answers);
          setFormValues(merged);
          setInitialStepIndex(inferResumeStepIndex(questions, merged, configs));
          setFormReady(true);
          return;
        } catch {
          if (!cancelled) {
            setFormValues(buildDefaultFormValues(questions));
            setInitialStepIndex(0);
            setFormReady(true);
          }
          return;
        }
      }

      if (!cancelled) {
        setFormValues(buildDefaultFormValues(questions));
        setInitialStepIndex(0);
        setFormReady(true);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [
    formReady,
    pageLoading,
    formLoading,
    formConfigMissing,
    allQuestions,
    submissionIdParam,
    isAuthenticated,
    fetchSubmission,
  ]);

  const persistDraft = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || servicePage == null) {
      return true;
    }
    try {
      const saved = await saveDraft(
        buildDraftPayload({
          submissionId,
          form: activeForm,
          serviceSlug,
          serviceTitle: servicePage.title,
          contact,
          formValues,
        }),
      ).unwrap();
      if (submissionId !== saved.id) {
        setSubmissionId(saved.id);
      }
      setErrorMessage(null);
      return true;
    } catch (err: unknown) {
      setErrorMessage(
        getApiErrorMessage(err, 'Failed to save step progress. Please try again.'),
      );
      return false;
    }
  }, [
    isAuthenticated,
    servicePage,
    submissionId,
    activeForm,
    serviceSlug,
    contact,
    formValues,
    saveDraft,
  ]);

  const handleBeforeNext = useCallback(
    async (stepIndex: number): Promise<boolean> => {
      if (isPricingStepIndex(stepIndex, stepConfigs)) {
        return true;
      }

      const stepQuestions = getQuestionsForStepIndex(
        allQuestions,
        stepIndex,
        stepConfigs,
      );
      if (stepQuestions.length > 0) {
        const validation = validateStepQuestions(stepQuestions, formValues);
        setErrors((prev) => ({ ...prev, ...validation.errors }));
        if (!validation.valid) {
          return false;
        }
      }

      setIsProcessing(true);
      const ok = await persistDraft();
      setIsProcessing(false);
      return ok;
    },
    [stepConfigs, allQuestions, formValues, persistDraft],
  );

  const finalizeSubmission = useCallback(
    async (args?: {
      paymentMode?: 'razorpay' | 'wallet';
      orderId?: string;
      paymentId?: string;
      amountInPaise?: number;
    }): Promise<boolean> => {
      if (servicePage == null) {
        return false;
      }
      setIsProcessing(true);
      try {
        await submitOnboarding(
          buildSubmitPayload({
            submissionId,
            form: activeForm,
            serviceSlug,
            serviceTitle: servicePage.title,
            contact,
            formValues,
            paymentMode: args?.paymentMode,
            orderId: args?.orderId,
            paymentId: args?.paymentId,
            amountInPaise: args?.amountInPaise ?? pricingSummary?.amountInPaise,
          }),
        ).unwrap();
        setErrorMessage(null);
        Alert.alert(
          'Registration complete',
          'Your registration details have been received successfully.',
          [{ text: 'OK', onPress: () => navigation.goBack() }],
        );
        return true;
      } catch (err: unknown) {
        setErrorMessage(
          getApiErrorMessage(err, 'Failed to submit registration. Please try again.'),
        );
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [
      servicePage,
      submissionId,
      activeForm,
      serviceSlug,
      contact,
      formValues,
      pricingSummary,
      submitOnboarding,
      navigation,
    ],
  );

  const runRazorpayPayment = useCallback(async (): Promise<void> => {
    if (pricingSummary == null || servicePage == null) {
      return;
    }
    const amountInPaise = pricingSummary.amountInPaise;
    if (amountInPaise < 100) {
      await finalizeSubmission();
      return;
    }

    setIsProcessing(true);
    try {
      const order = await createOrder({
        serviceSlug,
        ...(activeForm?.id != null ? { formId: activeForm.id } : {}),
        amountInPaise,
      }).unwrap();

      const payment = await openServiceOnboardingRazorpayCheckout({
        keyId: order.razorpayKeyId,
        orderId: order.razorpayOrderId,
        amountPaise: order.amount > 0 ? order.amount : amountInPaise,
        serviceName: servicePage.title,
        customerName: contact.name || 'Guest',
        customerEmail: contact.email,
        customerPhone: contact.mobile,
      });

      await finalizeSubmission({
        paymentMode: 'razorpay',
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
        amountInPaise: order.amount > 0 ? order.amount : amountInPaise,
      });
    } catch (err: unknown) {
      if (err instanceof ServiceOnboardingPaymentCancelledError) {
        return;
      }
      setErrorMessage(getApiErrorMessage(err, 'Payment could not be completed.'));
    } finally {
      setIsProcessing(false);
      setPaymentModalActive(false);
    }
  }, [
    pricingSummary,
    servicePage,
    createOrder,
    serviceSlug,
    activeForm,
    contact,
    finalizeSubmission,
  ]);

  const runWalletPayment = useCallback(async (): Promise<void> => {
    if (pricingSummary == null) {
      return;
    }
    setPaymentModalActive(false);
    await finalizeSubmission({
      paymentMode: 'wallet',
      amountInPaise: pricingSummary.amountInPaise,
    });
  }, [pricingSummary, finalizeSubmission]);

  const handleComplete = useCallback(async (): Promise<void> => {
    if (pricingSummary == null) {
      await finalizeSubmission();
      return;
    }

    const amountInPaise = pricingSummary.amountInPaise;
    if (amountInPaise < 100) {
      await finalizeSubmission();
      return;
    }

    setPaymentModalActive(true);
    const walletBalance = isConsultant ? consultantWalletBalance : userWalletBalance;
    const canWallet =
      typeof walletBalance === 'number' &&
      Number.isFinite(walletBalance) &&
      walletBalance >= amountInPaise / 100;

    const buttons: Array<{
      text: string;
      style?: 'default' | 'cancel' | 'destructive';
      onPress?: () => void;
    }> = [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Pay with Razorpay',
        onPress: () => {
          void runRazorpayPayment();
        },
      },
    ];

    if (canWallet) {
      buttons.push({
        text: 'Pay with Wallet',
        onPress: () => {
          void runWalletPayment();
        },
      });
    }

    Alert.alert(
      'Choose payment method',
      canWallet
        ? undefined
        : 'Wallet balance is insufficient for this payment. Use Razorpay to continue.',
      buttons,
      { cancelable: true, onDismiss: () => setPaymentModalActive(false) },
    );
  }, [
    pricingSummary,
    finalizeSubmission,
    isConsultant,
    consultantWalletBalance,
    userWalletBalance,
    runRazorpayPayment,
    runWalletPayment,
  ]);

  const isLoading =
    !formReady ||
    pageLoading ||
    (formLoading && !formConfigMissing) ||
    (pageError && servicePage == null);

  return {
    stepConfigs,
    initialStepIndex,
    formValues,
    errors,
    allQuestions,
    pricingSummary,
    isLoading,
    isProcessing,
    errorMessage,
    isAuthenticated,
    setFormValues,
    handleBeforeNext,
    handleComplete,
  };
}
