import { useCallback, useMemo, useState } from 'react';

import { selectAuth, selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import {
  useCreateDiagnosisRegistrationMutation,
  useVerifyDiagnosisPaymentMutation,
} from '@/features/Diagnostics/api/diagnosticsApi';
import type { DiagnosisPlanViewModel } from '@/features/Diagnostics/types/diagnostics.types';
import { useGetMyWalletBalanceQuery } from '@/features/Home/api/userWalletsApi';
import {
  WalletPaymentCancelledError,
  openWalletTopupRazorpayCheckout,
} from '@/features/Wallet/services/walletRazorpayCheckout';
import { showGlobalError, showGlobalToast } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

export interface UseDiagnosisPurchaseResult {
  paymentModalVisible: boolean;
  selectedPlan: DiagnosisPlanViewModel | null;
  amountRupees: number;
  walletBalanceRupees: number | null;
  canPayWithWallet: boolean;
  payingWith: 'razorpay' | 'wallet' | null;
  isBusy: boolean;
  openPaymentForPlan: (plan: DiagnosisPlanViewModel, amountRupees: number) => void;
  closePaymentModal: () => void;
  payWithWallet: () => Promise<void>;
  payWithRazorpay: () => Promise<void>;
}

function extractApiMessage(error: unknown): string {
  if (
    error != null &&
    typeof error === 'object' &&
    'data' in error &&
    error.data != null &&
    typeof error.data === 'object' &&
    'message' in error.data &&
    typeof (error.data as { message?: unknown }).message === 'string'
  ) {
    return (error.data as { message: string }).message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Payment failed. Please try again.';
}

export function useDiagnosisPurchase(): UseDiagnosisPurchaseResult {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const auth = useAppSelector(selectAuth);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DiagnosisPlanViewModel | null>(null);
  const [amountRupees, setAmountRupees] = useState(0);
  const [payingWith, setPayingWith] = useState<'razorpay' | 'wallet' | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const { data: walletBalance } = useGetMyWalletBalanceQuery(undefined, {
    skip: !paymentModalVisible || !isAuthenticated,
  });

  const [createRegistration] = useCreateDiagnosisRegistrationMutation();
  const [verifyPayment] = useVerifyDiagnosisPaymentMutation();

  const walletBalanceRupees =
    walletBalance != null && Number.isFinite(walletBalance) ? walletBalance : null;

  const canPayWithWallet =
    amountRupees > 0 &&
    walletBalanceRupees != null &&
    walletBalanceRupees >= amountRupees;

  const openPaymentForPlan = useCallback(
    (plan: DiagnosisPlanViewModel, priceRupees: number): void => {
      if (!isAuthenticated) {
        showGlobalError('Please log in to purchase a diagnostic pack.');
        return;
      }
      if (plan.ctaMode === 'active' || plan.ctaMode === 'disabled_lower') {
        return;
      }
      setSelectedPlan(plan);
      setAmountRupees(priceRupees);
      setPaymentModalVisible(true);
    },
    [isAuthenticated],
  );

  const closePaymentModal = useCallback((): void => {
    if (isBusy) {
      return;
    }
    setPaymentModalVisible(false);
    setSelectedPlan(null);
    setAmountRupees(0);
    setPayingWith(null);
  }, [isBusy]);

  const onPurchaseSuccess = useCallback((): void => {
    showGlobalToast({
      title: 'Pack activated',
      message: 'Your diagnostic pack is now active.',
      variant: 'success',
    });
    setPaymentModalVisible(false);
    setSelectedPlan(null);
    setAmountRupees(0);
  }, []);

  const payWithWallet = useCallback(async (): Promise<void> => {
    if (selectedPlan == null) {
      return;
    }
    setIsBusy(true);
    setPayingWith('wallet');
    try {
      const res = await createRegistration({
        diagnosticsMembershipId: selectedPlan.id,
        paymentGateway: 'wallet',
      }).unwrap();
      if (res.paymentStatus === 'SUCCESS') {
        onPurchaseSuccess();
      } else {
        showGlobalError('Payment could not be completed.');
      }
    } catch (error: unknown) {
      showGlobalError(extractApiMessage(error));
    } finally {
      setIsBusy(false);
      setPayingWith(null);
    }
  }, [createRegistration, onPurchaseSuccess, selectedPlan]);

  const payWithRazorpay = useCallback(async (): Promise<void> => {
    if (selectedPlan == null) {
      return;
    }
    setIsBusy(true);
    setPayingWith('razorpay');
    try {
      const res = await createRegistration({
        diagnosticsMembershipId: selectedPlan.id,
        paymentGateway: 'razor_pay',
      }).unwrap();

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
        showGlobalError('Unable to start Razorpay checkout.');
        return;
      }

      setPaymentModalVisible(false);

      const payment = await openWalletTopupRazorpayCheckout({
        keyId: res.razorpayKeyId,
        orderId: res.razorpayOrderId,
        amountPaise: res.amountPaise,
        customerName: auth.user?.name ?? 'User',
        customerEmail: auth.user?.email ?? '',
        customerPhone: auth.mobile ?? auth.user?.phone ?? '',
      });

      await verifyPayment({
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
      }).unwrap();

      onPurchaseSuccess();
    } catch (error: unknown) {
      if (error instanceof WalletPaymentCancelledError) {
        return;
      }
      showGlobalError(extractApiMessage(error));
    } finally {
      setIsBusy(false);
      setPayingWith(null);
    }
  }, [
    auth.mobile,
    auth.user?.email,
    auth.user?.name,
    auth.user?.phone,
    createRegistration,
    onPurchaseSuccess,
    selectedPlan,
    verifyPayment,
  ]);

  return useMemo(
    () => ({
      paymentModalVisible,
      selectedPlan,
      amountRupees,
      walletBalanceRupees,
      canPayWithWallet,
      payingWith,
      isBusy,
      openPaymentForPlan,
      closePaymentModal,
      payWithWallet,
      payWithRazorpay,
    }),
    [
      amountRupees,
      canPayWithWallet,
      closePaymentModal,
      isBusy,
      openPaymentForPlan,
      payWithRazorpay,
      payWithWallet,
      paymentModalVisible,
      payingWith,
      selectedPlan,
      walletBalanceRupees,
    ],
  );
}
