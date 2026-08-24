import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import {
  selectAccountRole,
  selectDisplayName,
  selectHasVerifiedLogin,
  selectLoggedInEmail,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import { useRazorpayAvailability } from '@/features/AppSettings/hooks/useRazorpayAvailability';
import { useProfileLoginPrompt } from '@/features/Profile/hooks/useProfileLoginPrompt';
import {
  isPaidWorkshopBookingResult,
  useConfirmWorkshopBookingMutation,
  useCreateWorkshopBookingMutation,
  useGetMyWorkshopBookingsQuery,
} from '@/features/Home/api/workshopBookingsApi';
import {
  useGetConsultantWalletBalanceQuery,
  useGetMyWalletBalanceQuery,
} from '@/features/Home/api/userWalletsApi';
import {
  openWorkshopRazorpayCheckout,
  WorkshopPaymentCancelledError,
} from '@/features/Home/services/workshopRazorpayCheckout';
import { waitForNativeModalDismiss } from '@/utils/waitForNativeModalDismiss';
import type { PublicWorkshopApiRow } from '@/features/Home/types/publicWorkshopApi.types';
import {
  isWorkshopBookable,
  isWorkshopBookingFree,
  resolveWorkshopBookAmount,
} from '@/features/Home/utils/workshopDetailUtils';
import { readWorkshopBookingErrorMessage } from '@/features/Home/utils/workshopBookingErrors';
import { useAppSelector } from '@/store/typedHooks';

export interface UseWorkshopBookingOptions {
  /** Called after a successful free / wallet / Razorpay booking. */
  onBookingSuccess?: () => void;
}

export interface UseWorkshopBookingResult {
  isBooked: boolean;
  isBooking: boolean;
  bookAmountRupees: number;
  isFreeBooking: boolean;
  paymentModalVisible: boolean;
  walletBalanceRupees: number | null;
  canPayWithWallet: boolean;
  showRazorpayOption: boolean;
  payingWith: 'razorpay' | 'wallet' | null;
  onBookPress: () => void;
  closePaymentModal: () => void;
  onPayRazorpay: () => void;
  onPayWallet: () => void;
  workshopLoginDialog: React.ReactElement;
}

export function useWorkshopBooking(
  workshop: PublicWorkshopApiRow | null,
  options?: UseWorkshopBookingOptions,
): UseWorkshopBookingResult {
  const onBookingSuccess = options?.onBookingSuccess;
  const { isRazorpayEnabled } = useRazorpayAvailability();
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const accountRole = useAppSelector(selectAccountRole);
  const displayName = useAppSelector(selectDisplayName);
  const email = useAppSelector(selectLoggedInEmail);
  const mobile = useAppSelector(selectLoggedInMobile);
  const { promptLogin, profileLoginDialog } = useProfileLoginPrompt();

  const isConsultant = accountRole === 'consultant';

  const { data: myBookings = [] } = useGetMyWorkshopBookingsQuery(undefined, {
    skip: !hasVerifiedLogin,
  });
  const [createBooking, { isLoading: creating }] = useCreateWorkshopBookingMutation();
  const [confirmBooking, { isLoading: confirming }] = useConfirmWorkshopBookingMutation();

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [payingWith, setPayingWith] = useState<'razorpay' | 'wallet' | null>(null);

  useEffect(() => {
    if (!hasVerifiedLogin) {
      setPaymentModalVisible(false);
      setPayingWith(null);
    }
  }, [hasVerifiedLogin]);

  const { data: userWalletBalance } = useGetMyWalletBalanceQuery(undefined, {
    skip: !hasVerifiedLogin || !paymentModalVisible || isConsultant,
  });
  const { data: consultantWalletBalance } = useGetConsultantWalletBalanceQuery(undefined, {
    skip: !hasVerifiedLogin || !paymentModalVisible || !isConsultant,
  });

  const bookAmountRupees = workshop != null ? resolveWorkshopBookAmount(workshop) : 0;
  const isFreeBooking = workshop != null ? isWorkshopBookingFree(workshop) : true;

  const walletBalanceRupees = useMemo((): number | null => {
    if (!paymentModalVisible || !hasVerifiedLogin) {
      return null;
    }
    const balance = isConsultant ? consultantWalletBalance : userWalletBalance;
    return typeof balance === 'number' && Number.isFinite(balance) ? balance : null;
  }, [
    paymentModalVisible,
    hasVerifiedLogin,
    isConsultant,
    consultantWalletBalance,
    userWalletBalance,
  ]);

  const canPayWithWallet =
    bookAmountRupees > 0 &&
    walletBalanceRupees != null &&
    walletBalanceRupees >= bookAmountRupees;

  const isBooked = useMemo((): boolean => {
    if (workshop == null || !hasVerifiedLogin) {
      return false;
    }
    return myBookings.some((b) => b.workshopId === workshop.id);
  }, [hasVerifiedLogin, myBookings, workshop]);

  const finishBookingSuccess = useCallback((): void => {
    setPaymentModalVisible(false);
    onBookingSuccess?.();
  }, [onBookingSuccess]);

  const handleFreeBook = useCallback(async (): Promise<void> => {
    if (workshop == null) {
      return;
    }
    try {
      await createBooking({ workshopId: workshop.id, type: 'free' }).unwrap();
      finishBookingSuccess();
    } catch (error: unknown) {
      Alert.alert('Booking', readWorkshopBookingErrorMessage(error));
    }
  }, [workshop, createBooking, finishBookingSuccess]);

  const handleWalletBook = useCallback(async (): Promise<void> => {
    if (workshop == null) {
      return;
    }
    setPayingWith('wallet');
    try {
      await createBooking({ workshopId: workshop.id, type: 'wallet' }).unwrap();
      finishBookingSuccess();
    } catch (error: unknown) {
      Alert.alert('Booking', readWorkshopBookingErrorMessage(error));
    } finally {
      setPayingWith(null);
    }
  }, [workshop, createBooking, finishBookingSuccess]);

  const handleRazorpayBook = useCallback(async (): Promise<void> => {
    if (workshop == null) {
      return;
    }
    if (!isRazorpayEnabled) {
      Alert.alert('Booking', 'Online Razorpay payments are currently disabled.');
      return;
    }
    setPayingWith('razorpay');
    try {
      const result = await createBooking({ workshopId: workshop.id, type: 'online' }).unwrap();
      if (!isPaidWorkshopBookingResult(result)) {
        finishBookingSuccess();
        return;
      }

      setPaymentModalVisible(false);
      await waitForNativeModalDismiss();

      const payment = await openWorkshopRazorpayCheckout({
        keyId: result.razorpayKeyId,
        orderId: result.razorpayOrderId,
        amountPaise:
          result.amount > 0 ? result.amount : Math.round(bookAmountRupees * 100),
        workshopName: workshop.name,
        customerName: displayName ?? 'Guest',
        customerEmail: email ?? '',
        customerPhone: mobile ?? '',
      });

      await confirmBooking({
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
      }).unwrap();

      finishBookingSuccess();
    } catch (error: unknown) {
      if (error instanceof WorkshopPaymentCancelledError) {
        setPaymentModalVisible(true);
        return;
      }
      Alert.alert('Booking', readWorkshopBookingErrorMessage(error));
    } finally {
      setPayingWith(null);
    }
  }, [
    workshop,
    createBooking,
    confirmBooking,
    bookAmountRupees,
    displayName,
    email,
    mobile,
    finishBookingSuccess,
    isRazorpayEnabled,
  ]);

  const onBookPress = useCallback((): void => {
    if (workshop == null) {
      return;
    }

    if (!hasVerifiedLogin) {
      promptLogin({
        title: 'Login required',
        message: 'Please sign in to book this workshop.',
      });
      return;
    }

    if (isBooked) {
      Alert.alert('Already booked', 'You already have a seat for this workshop.');
      return;
    }

    if (!isWorkshopBookable(workshop)) {
      Alert.alert(
        'Session ended',
        'This in-person session has already taken place and is no longer open for booking.',
      );
      return;
    }

    if (isFreeBooking) {
      void handleFreeBook();
      return;
    }

    setPaymentModalVisible(true);
  }, [
    workshop,
    hasVerifiedLogin,
    isBooked,
    isFreeBooking,
    promptLogin,
    handleFreeBook,
  ]);

  const closePaymentModal = useCallback((): void => {
    if (payingWith != null) {
      return;
    }
    setPaymentModalVisible(false);
  }, [payingWith]);

  const isBooking = creating || confirming || payingWith != null;

  return {
    isBooked,
    isBooking,
    bookAmountRupees,
    isFreeBooking,
    paymentModalVisible,
    walletBalanceRupees,
    canPayWithWallet,
    showRazorpayOption: isRazorpayEnabled,
    payingWith,
    onBookPress,
    closePaymentModal,
    onPayRazorpay: () => {
      void handleRazorpayBook();
    },
    onPayWallet: () => {
      void handleWalletBook();
    },
    workshopLoginDialog: profileLoginDialog,
  };
}
