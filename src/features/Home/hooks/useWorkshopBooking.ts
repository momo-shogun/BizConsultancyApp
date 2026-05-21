import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
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
import type { PublicWorkshopApiRow } from '@/features/Home/types/publicWorkshopApi.types';
import {
  isWorkshopBookable,
  isWorkshopBookingFree,
  resolveWorkshopBookAmount,
} from '@/features/Home/utils/workshopDetailUtils';
import { readWorkshopBookingErrorMessage } from '@/features/Home/utils/workshopBookingErrors';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';

export interface UseWorkshopBookingResult {
  isBooked: boolean;
  isBooking: boolean;
  bookAmountRupees: number;
  isFreeBooking: boolean;
  paymentModalVisible: boolean;
  walletBalanceRupees: number | null;
  canPayWithWallet: boolean;
  payingWith: 'razorpay' | 'wallet' | null;
  onBookPress: () => void;
  closePaymentModal: () => void;
  onPayRazorpay: () => void;
  onPayWallet: () => void;
}

export function useWorkshopBooking(workshop: PublicWorkshopApiRow | null): UseWorkshopBookingResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accountRole = useAppSelector(selectAccountRole);
  const displayName = useAppSelector(selectDisplayName);
  const email = useAppSelector(selectLoggedInEmail);
  const mobile = useAppSelector(selectLoggedInMobile);

  const isConsultant = accountRole === 'consultant';

  const { data: myBookings = [] } = useGetMyWorkshopBookingsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createBooking, { isLoading: creating }] = useCreateWorkshopBookingMutation();
  const [confirmBooking, { isLoading: confirming }] = useConfirmWorkshopBookingMutation();

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [payingWith, setPayingWith] = useState<'razorpay' | 'wallet' | null>(null);

  const { data: userWalletBalance } = useGetMyWalletBalanceQuery(undefined, {
    skip: !isAuthenticated || !paymentModalVisible || isConsultant,
  });
  const { data: consultantWalletBalance } = useGetConsultantWalletBalanceQuery(undefined, {
    skip: !isAuthenticated || !paymentModalVisible || !isConsultant,
  });

  const bookAmountRupees = workshop != null ? resolveWorkshopBookAmount(workshop) : 0;
  const isFreeBooking = workshop != null ? isWorkshopBookingFree(workshop) : true;

  const walletBalanceRupees = useMemo((): number | null => {
    if (!paymentModalVisible || !isAuthenticated) {
      return null;
    }
    const balance = isConsultant ? consultantWalletBalance : userWalletBalance;
    return typeof balance === 'number' && Number.isFinite(balance) ? balance : null;
  }, [
    paymentModalVisible,
    isAuthenticated,
    isConsultant,
    consultantWalletBalance,
    userWalletBalance,
  ]);

  const canPayWithWallet =
    bookAmountRupees > 0 &&
    walletBalanceRupees != null &&
    walletBalanceRupees >= bookAmountRupees;

  const isBooked = useMemo((): boolean => {
    if (workshop == null) {
      return false;
    }
    return myBookings.some((b) => b.workshopId === workshop.id);
  }, [myBookings, workshop]);

  const handleFreeBook = useCallback(async (): Promise<void> => {
    if (workshop == null) {
      return;
    }
    try {
      await createBooking({ workshopId: workshop.id, type: 'free' }).unwrap();
      Alert.alert('Booked', 'Your seat has been reserved for this workshop.');
    } catch (error: unknown) {
      Alert.alert('Booking', readWorkshopBookingErrorMessage(error));
    }
  }, [workshop, createBooking]);

  const handleWalletBook = useCallback(async (): Promise<void> => {
    if (workshop == null) {
      return;
    }
    setPayingWith('wallet');
    try {
      await createBooking({ workshopId: workshop.id, type: 'wallet' }).unwrap();
      setPaymentModalVisible(false);
      Alert.alert('Confirmed', 'Paid from wallet. Your workshop seat is confirmed.');
    } catch (error: unknown) {
      Alert.alert('Booking', readWorkshopBookingErrorMessage(error));
    } finally {
      setPayingWith(null);
    }
  }, [workshop, createBooking]);

  const handleRazorpayBook = useCallback(async (): Promise<void> => {
    if (workshop == null) {
      return;
    }
    setPayingWith('razorpay');
    try {
      const result = await createBooking({ workshopId: workshop.id, type: 'online' }).unwrap();
      if (!isPaidWorkshopBookingResult(result)) {
        setPaymentModalVisible(false);
        Alert.alert('Booked', 'Your seat has been reserved for this workshop.');
        return;
      }

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

      setPaymentModalVisible(false);
      Alert.alert('Confirmed', 'Payment received. Your workshop seat is confirmed.');
    } catch (error: unknown) {
      if (error instanceof WorkshopPaymentCancelledError) {
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
  ]);

  const onBookPress = useCallback((): void => {
    if (workshop == null) {
      return;
    }

    if (!isAuthenticated) {
      Alert.alert('Login required', 'Please sign in to book this workshop.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign in',
          onPress: () => navigation.navigate(ROUTES.Root.Auth, { screen: ROUTES.Auth.Login }),
        },
      ]);
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
    isAuthenticated,
    isBooked,
    isFreeBooking,
    navigation,
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
    payingWith,
    onBookPress,
    closePaymentModal,
    onPayRazorpay: () => {
      void handleRazorpayBook();
    },
    onPayWallet: () => {
      void handleWalletBook();
    },
  };
}
