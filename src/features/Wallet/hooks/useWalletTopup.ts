import { useCallback, useState } from 'react';

import { selectAuth } from '@/features/Auth/store/authSelectors';
import {
  useCreateWalletTopupOrderMutation,
  useVerifyWalletTopupMutation,
} from '@/features/Wallet/api/walletApi';
import {
  WalletPaymentCancelledError,
  openWalletTopupRazorpayCheckout,
} from '@/features/Wallet/services/walletRazorpayCheckout';
import {
  parseTopupAmountInput,
  validateTopupAmount,
} from '@/features/Wallet/utils/walletTransactionUtils';
import { showGlobalError, showGlobalToast } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

export interface UseWalletTopupResult {
  amountInput: string;
  setAmountInput: (value: string) => void;
  isProceeding: boolean;
  handleAddBalance: () => Promise<void>;
}

export function useWalletTopup(): UseWalletTopupResult {
  const auth = useAppSelector(selectAuth);
  const [amountInput, setAmountInput] = useState('1000');
  const [isProceeding, setIsProceeding] = useState(false);

  const [createTopupOrder] = useCreateWalletTopupOrderMutation();
  const [verifyTopup] = useVerifyWalletTopupMutation();

  const handleAddBalance = useCallback(async (): Promise<void> => {
    const amount = parseTopupAmountInput(amountInput);
    const validationError = validateTopupAmount(amount);
    if (validationError != null) {
      showGlobalError(validationError);
      return;
    }
    if (amount == null) {
      return;
    }

    setIsProceeding(true);
    try {
      const order = await createTopupOrder(amount).unwrap();
      const payment = await openWalletTopupRazorpayCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amountPaise: order.amount,
        customerName: auth.user?.name ?? 'User',
        customerEmail: auth.user?.email ?? '',
        customerPhone: auth.mobile ?? auth.user?.phone ?? '',
      });

      await verifyTopup({
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
      }).unwrap();

      showGlobalToast({
        title: 'Wallet updated',
        message: 'Amount added to your wallet successfully.',
        variant: 'success',
      });
    } catch (error: unknown) {
      if (error instanceof WalletPaymentCancelledError) {
        return;
      }
      const message =
        error != null &&
        typeof error === 'object' &&
        'data' in error &&
        error.data != null &&
        typeof error.data === 'object' &&
        'message' in error.data &&
        typeof (error.data as { message?: unknown }).message === 'string'
          ? (error.data as { message: string }).message
          : error instanceof Error
            ? error.message
            : 'Could not add balance. Please try again.';
      showGlobalError(message);
    } finally {
      setIsProceeding(false);
    }
  }, [amountInput, auth.mobile, auth.user?.email, auth.user?.name, auth.user?.phone, createTopupOrder, verifyTopup]);

  return {
    amountInput,
    setAmountInput,
    isProceeding,
    handleAddBalance,
  };
}
