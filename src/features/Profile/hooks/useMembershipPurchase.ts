import { useCallback, useMemo, useState } from 'react';

import {
  selectAccountRole,
  selectDisplayName,
  selectIsAuthenticated,
  selectLoggedInEmail,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import { useGetMasterCategoriesQuery, useGetMasterSegmentsQuery } from '@/features/consultant/api/consultantApi';
import { useGetMyWalletBalanceQuery } from '@/features/Home/api/userWalletsApi';
import { showGlobalError, showGlobalToast } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

import {
  useCreateMembershipRegistrationMutation,
  useVerifyMembershipPaymentMutation,
} from '../api/membershipRegistrationApi';
import { useGetUserMeQuery } from '../api/userProfileApi';
import {
  MembershipPaymentCancelledError,
  openMembershipRazorpayCheckout,
} from '../services/membershipRazorpayCheckout';
import type { MembershipPlan } from '../types/membershipPlan.types';
import { readMembershipApiErrorMessage } from '../utils/membershipRegistrationParsing';

export interface UseMembershipPurchaseResult {
  checkoutVisible: boolean;
  paymentStepVisible: boolean;
  selectedPlan: MembershipPlan | null;
  categoryId: string;
  segmentId: string;
  categoryError: string | null;
  segmentError: string | null;
  amountRupees: number;
  walletBalanceRupees: number | null;
  canPayWithWallet: boolean;
  payingWith: 'razorpay' | 'wallet' | null;
  isBusy: boolean;
  categoriesLoading: boolean;
  segmentsLoading: boolean;
  categoryOptions: Array<{ label: string; value: string }>;
  segmentOptions: Array<{ label: string; value: string }>;
  setCategoryId: (value: string) => void;
  setSegmentId: (value: string) => void;
  openCheckout: (plan: MembershipPlan) => void;
  closeCheckout: () => void;
  proceedToPayment: () => void;
  backToDetails: () => void;
  payWithWallet: () => Promise<void>;
  payWithRazorpay: () => Promise<void>;
}

export function useMembershipPurchase(): UseMembershipPurchaseResult {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accountRole = useAppSelector(selectAccountRole);
  const displayName = useAppSelector(selectDisplayName);
  const authEmail = useAppSelector(selectLoggedInEmail);
  const authMobile = useAppSelector(selectLoggedInMobile);

  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [paymentStepVisible, setPaymentStepVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [categoryId, setCategoryIdState] = useState('');
  const [segmentId, setSegmentIdState] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [segmentError, setSegmentError] = useState<string | null>(null);
  const [payingWith, setPayingWith] = useState<'razorpay' | 'wallet' | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const { data: profile } = useGetUserMeQuery(undefined, { skip: !isAuthenticated });
  const { data: categories = [], isLoading: categoriesLoading } = useGetMasterCategoriesQuery();
  const { data: segments = [], isLoading: segmentsLoading } = useGetMasterSegmentsQuery(
    { categoryId },
    { skip: categoryId.length === 0 },
  );

  const { data: walletBalance } = useGetMyWalletBalanceQuery(undefined, {
    skip: !checkoutVisible || !paymentStepVisible || !isAuthenticated,
  });

  const [createRegistration] = useCreateMembershipRegistrationMutation();
  const [verifyPayment] = useVerifyMembershipPaymentMutation();

  const amountRupees = selectedPlan?.amount ?? 0;
  const walletBalanceRupees =
    walletBalance != null && Number.isFinite(walletBalance) ? walletBalance : null;
  const canPayWithWallet =
    amountRupees > 0 &&
    walletBalanceRupees != null &&
    walletBalanceRupees >= amountRupees;

  const categoryOptions = useMemo(
    () => categories.map((item) => ({ label: item.name, value: String(item.id) })),
    [categories],
  );

  const segmentOptions = useMemo(
    () => segments.map((item) => ({ label: item.name, value: String(item.id) })),
    [segments],
  );

  const resetCheckout = useCallback((): void => {
    setCheckoutVisible(false);
    setPaymentStepVisible(false);
    setSelectedPlan(null);
    setCategoryIdState('');
    setSegmentIdState('');
    setCategoryError(null);
    setSegmentError(null);
    setPayingWith(null);
    setIsBusy(false);
  }, []);

  const openCheckout = useCallback(
    (plan: MembershipPlan): void => {
      if (!isAuthenticated) {
        showGlobalError('Please log in to purchase a membership.');
        return;
      }
      if (plan.ctaMode === 'active' || plan.ctaMode === 'disabled') {
        return;
      }
      setSelectedPlan(plan);
      setCategoryIdState('');
      setSegmentIdState('');
      setCategoryError(null);
      setSegmentError(null);
      setPaymentStepVisible(false);
      setCheckoutVisible(true);
    },
    [isAuthenticated],
  );

  const closeCheckout = useCallback((): void => {
    if (isBusy) {
      return;
    }
    resetCheckout();
  }, [isBusy, resetCheckout]);

  const setCategoryId = useCallback((value: string): void => {
    setCategoryIdState(value);
    setSegmentIdState('');
    setCategoryError(null);
    setSegmentError(null);
  }, []);

  const setSegmentId = useCallback((value: string): void => {
    setSegmentIdState(value);
    setSegmentError(null);
  }, []);

  const validateCheckoutDetails = useCallback((): boolean => {
    let valid = true;
    if (categoryId.length === 0) {
      setCategoryError('Select a business category');
      valid = false;
    } else {
      setCategoryError(null);
    }
    if (segmentId.length === 0) {
      setSegmentError('Select a business segment');
      valid = false;
    } else {
      setSegmentError(null);
    }
    return valid;
  }, [categoryId, segmentId]);

  const proceedToPayment = useCallback((): void => {
    if (!validateCheckoutDetails()) {
      return;
    }
    const email = profile?.email?.trim() ?? authEmail?.trim() ?? '';
    const mobile = profile?.mobile?.trim() ?? authMobile?.trim() ?? '';
    if (email.length === 0) {
      showGlobalError('Add an email address in My Profile before purchasing.');
      return;
    }
    if (mobile.length === 0) {
      showGlobalError('Add a mobile number in My Profile before purchasing.');
      return;
    }
    setPaymentStepVisible(true);
  }, [authEmail, authMobile, profile?.email, profile?.mobile, validateCheckoutDetails]);

  const backToDetails = useCallback((): void => {
    if (isBusy) {
      return;
    }
    setPaymentStepVisible(false);
    setPayingWith(null);
  }, [isBusy]);

  const buildRegistrationPayload = useCallback(
    (gateway: 'wallet' | 'razor_pay') => {
      if (selectedPlan == null) {
        throw new Error('No plan selected');
      }
      const email = profile?.email?.trim() ?? authEmail?.trim() ?? '';
      const mobile = profile?.mobile?.trim() ?? authMobile?.trim() ?? '';
      const name = profile?.name?.trim() ?? displayName?.trim() ?? 'Member';
      const userType = accountRole === 'consultant' ? 'consultant' : 'user';

      return {
        name,
        email,
        mobile,
        membershipId: selectedPlan.membershipId,
        categoryId: Number(categoryId),
        segmentId: Number(segmentId),
        userType,
        memberShipType: selectedPlan.membershipType,
        paymentGateway: gateway,
        amount: selectedPlan.amount,
      } as const;
    },
    [
      accountRole,
      authEmail,
      authMobile,
      categoryId,
      displayName,
      profile?.email,
      profile?.mobile,
      profile?.name,
      segmentId,
      selectedPlan,
    ],
  );

  const onPurchaseSuccess = useCallback((): void => {
    showGlobalToast({
      title: 'Membership activated',
      message: 'Your payment was successful and your plan is now active.',
      variant: 'success',
    });
    resetCheckout();
  }, [resetCheckout]);

  const payWithWallet = useCallback(async (): Promise<void> => {
    if (selectedPlan == null || !validateCheckoutDetails()) {
      return;
    }
    setIsBusy(true);
    setPayingWith('wallet');
    try {
      const res = await createRegistration(buildRegistrationPayload('wallet')).unwrap();
      if (res.paymentStatus === 'SUCCESS') {
        onPurchaseSuccess();
      } else {
        showGlobalError('Payment could not be completed.');
      }
    } catch (error: unknown) {
      showGlobalError(readMembershipApiErrorMessage(error, 'Payment failed. Please try again.'));
    } finally {
      setIsBusy(false);
      setPayingWith(null);
    }
  }, [
    buildRegistrationPayload,
    createRegistration,
    onPurchaseSuccess,
    selectedPlan,
    validateCheckoutDetails,
  ]);

  const payWithRazorpay = useCallback(async (): Promise<void> => {
    if (selectedPlan == null || !validateCheckoutDetails()) {
      return;
    }
    setIsBusy(true);
    setPayingWith('razorpay');
    try {
      const res = await createRegistration(buildRegistrationPayload('razor_pay')).unwrap();

      if (res.paymentStatus === 'SUCCESS') {
        onPurchaseSuccess();
        return;
      }

      if (
        res.paymentStatus !== 'PENDING' ||
        res.razorpayOrderId == null ||
        res.razorpayKeyId == null ||
        res.amountPaise == null
      ) {
        showGlobalError(
          'Online payment could not start. Razorpay may not be configured on the server.',
        );
        return;
      }

      setCheckoutVisible(false);

      const payment = await openMembershipRazorpayCheckout({
        keyId: res.razorpayKeyId,
        orderId: res.razorpayOrderId,
        amountPaise: res.amountPaise,
        planName: selectedPlan.name,
        customerName: profile?.name?.trim() ?? displayName?.trim() ?? 'Member',
        customerEmail: profile?.email?.trim() ?? authEmail?.trim() ?? '',
        customerPhone: profile?.mobile?.trim() ?? authMobile?.trim() ?? '',
      });

      await verifyPayment({
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
      }).unwrap();

      onPurchaseSuccess();
    } catch (error: unknown) {
      if (error instanceof MembershipPaymentCancelledError) {
        setCheckoutVisible(true);
        setPaymentStepVisible(true);
        return;
      }
      showGlobalError(readMembershipApiErrorMessage(error, 'Payment failed. Please try again.'));
      setCheckoutVisible(true);
      setPaymentStepVisible(true);
    } finally {
      setIsBusy(false);
      setPayingWith(null);
    }
  }, [
    authEmail,
    authMobile,
    buildRegistrationPayload,
    createRegistration,
    displayName,
    onPurchaseSuccess,
    profile?.email,
    profile?.mobile,
    profile?.name,
    selectedPlan,
    validateCheckoutDetails,
    verifyPayment,
  ]);

  return useMemo(
    () => ({
      checkoutVisible,
      paymentStepVisible,
      selectedPlan,
      categoryId,
      segmentId,
      categoryError,
      segmentError,
      amountRupees,
      walletBalanceRupees,
      canPayWithWallet,
      payingWith,
      isBusy,
      categoriesLoading,
      segmentsLoading,
      categoryOptions,
      segmentOptions,
      setCategoryId,
      setSegmentId,
      openCheckout,
      closeCheckout,
      proceedToPayment,
      backToDetails,
      payWithWallet,
      payWithRazorpay,
    }),
    [
      amountRupees,
      backToDetails,
      canPayWithWallet,
      categoriesLoading,
      categoryError,
      categoryId,
      categoryOptions,
      checkoutVisible,
      closeCheckout,
      isBusy,
      openCheckout,
      payWithRazorpay,
      payWithWallet,
      payingWith,
      paymentStepVisible,
      proceedToPayment,
      segmentError,
      segmentId,
      segmentOptions,
      segmentsLoading,
      selectedPlan,
      setCategoryId,
      setSegmentId,
      walletBalanceRupees,
    ],
  );
}
