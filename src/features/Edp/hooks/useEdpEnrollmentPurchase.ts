import { useCallback, useMemo, useState } from 'react';

import {
  selectAccountRole,
  selectAuth,
  selectIsAuthenticated,
} from '@/features/Auth/store/authSelectors';
import {
  useCreateEdpPurchaseMutation,
  useGetEdpProgramAmountQuery,
  useVerifyEdpPurchasePaymentMutation,
} from '@/features/Edp/api/edpPurchasesApi';
import {
  useGetConsultantWalletBalanceQuery,
  useGetMyWalletBalanceQuery,
} from '@/features/Home/api/userWalletsApi';
import {
  WalletPaymentCancelledError,
  openWalletTopupRazorpayCheckout,
} from '@/features/Wallet/services/walletRazorpayCheckout';
import { showGlobalError, showGlobalToast } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';

export interface UseEdpEnrollmentPurchaseResult {
  programAmountRupees: number;
  paymentModalVisible: boolean;
  walletBalanceRupees: number | null;
  canPayWithWallet: boolean;
  payingWith: 'razorpay' | 'wallet' | null;
  isBusy: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  payWithWallet: () => Promise<void>;
  payWithRazorpay: () => Promise<void>;
}

export function useEdpEnrollmentPurchase(): UseEdpEnrollmentPurchaseResult {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accountRole = useAppSelector(selectAccountRole);
  const isConsultant = accountRole === 'consultant';
  const auth = useAppSelector(selectAuth);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [payingWith, setPayingWith] = useState<'razorpay' | 'wallet' | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const { data: amountData } = useGetEdpProgramAmountQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: userWalletBalance } = useGetMyWalletBalanceQuery(undefined, {
    skip: !paymentModalVisible || !isAuthenticated || isConsultant,
  });
  const { data: consultantWalletBalance } = useGetConsultantWalletBalanceQuery(undefined, {
    skip: !paymentModalVisible || !isAuthenticated || !isConsultant,
  });

  const [createPurchase] = useCreateEdpPurchaseMutation();
  const [verifyPayment] = useVerifyEdpPurchasePaymentMutation();

  const programAmountRupees =
    amountData != null && Number.isFinite(amountData.amount) ? Math.round(amountData.amount) : 0;

  const walletBalance = isConsultant ? consultantWalletBalance : userWalletBalance;
  const walletBalanceRupees =
    walletBalance != null && Number.isFinite(walletBalance) ? walletBalance : null;

  const canPayWithWallet =
    programAmountRupees > 0 &&
    walletBalanceRupees != null &&
    walletBalanceRupees >= programAmountRupees;

  const onPurchaseSuccess = useCallback((): void => {
    showGlobalToast({
      title: 'Enrolled',
      message: 'You are enrolled in the EDP programme.',
      variant: 'success',
    });
    setPaymentModalVisible(false);
  }, []);

  const openPaymentModal = useCallback((): void => {
    if (!isAuthenticated) {
      showGlobalError('Please log in to enroll in EDP.');
      return;
    }
    if (programAmountRupees <= 0) {
      showGlobalError('Programme price is unavailable. Try again later.');
      return;
    }
    setPaymentModalVisible(true);
  }, [isAuthenticated, programAmountRupees]);

  const closePaymentModal = useCallback((): void => {
    if (isBusy) {
      return;
    }
    setPaymentModalVisible(false);
    setPayingWith(null);
  }, [isBusy]);

  const payWithWallet = useCallback(async (): Promise<void> => {
    setIsBusy(true);
    setPayingWith('wallet');
    try {
      const res = await createPurchase({ paymentGateway: 'wallet' }).unwrap();
      if (res.paymentStatus === 'SUCCESS') {
        onPurchaseSuccess();
      } else {
        showGlobalError('Payment could not be completed.');
      }
    } catch (error: unknown) {
      showGlobalError(getApiErrorMessage(error, 'EDP purchase failed'));
    } finally {
      setIsBusy(false);
      setPayingWith(null);
    }
  }, [createPurchase, onPurchaseSuccess]);

  const payWithRazorpay = useCallback(async (): Promise<void> => {
    setIsBusy(true);
    setPayingWith('razorpay');
    try {
      const res = await createPurchase({ paymentGateway: 'razor_pay' }).unwrap();

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
      showGlobalError(getApiErrorMessage(error, 'Payment failed'));
    } finally {
      setIsBusy(false);
      setPayingWith(null);
    }
  }, [
    auth.mobile,
    auth.user?.email,
    auth.user?.name,
    auth.user?.phone,
    createPurchase,
    onPurchaseSuccess,
    verifyPayment,
  ]);

  return useMemo(
    () => ({
      programAmountRupees,
      paymentModalVisible,
      walletBalanceRupees,
      canPayWithWallet,
      payingWith,
      isBusy,
      openPaymentModal,
      closePaymentModal,
      payWithWallet,
      payWithRazorpay,
    }),
    [
      canPayWithWallet,
      closePaymentModal,
      isBusy,
      openPaymentModal,
      payWithRazorpay,
      payWithWallet,
      paymentModalVisible,
      payingWith,
      programAmountRupees,
      walletBalanceRupees,
    ],
  );
}
