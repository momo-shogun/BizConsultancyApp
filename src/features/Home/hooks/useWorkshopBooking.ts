import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  selectDisplayName,
  selectIsAuthenticated,
  selectLoggedInEmail,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import {
  useConfirmWorkshopBookingMutation,
  useCreateWorkshopBookingMutation,
  useGetMyWorkshopBookingsQuery,
  type CreateWorkshopBookingPaidResult,
} from '@/features/Home/api/workshopBookingsApi';
import {
  openWorkshopRazorpayCheckout,
  WorkshopPaymentCancelledError,
} from '@/features/Home/services/workshopRazorpayCheckout';
import type { PublicWorkshopApiRow } from '@/features/Home/types/publicWorkshopApi.types';
import { resolveWorkshopFee } from '@/features/Home/utils/workshopDetailUtils';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';

function isPaidBookingResult(
  result: unknown,
): result is CreateWorkshopBookingPaidResult {
  return (
    result != null &&
    typeof result === 'object' &&
    'razorpayOrderId' in result &&
    typeof (result as CreateWorkshopBookingPaidResult).razorpayOrderId === 'string'
  );
}

function readBookingErrorMessage(error: unknown): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data != null && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return 'Booking failed. Please try again.';
}

export interface UseWorkshopBookingResult {
  isBooked: boolean;
  isBooking: boolean;
  onBookPress: () => void;
}

export function useWorkshopBooking(workshop: PublicWorkshopApiRow | null): UseWorkshopBookingResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const displayName = useAppSelector(selectDisplayName);
  const email = useAppSelector(selectLoggedInEmail);
  const mobile = useAppSelector(selectLoggedInMobile);

  const { data: myBookings = [] } = useGetMyWorkshopBookingsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createBooking, { isLoading: creating }] = useCreateWorkshopBookingMutation();
  const [confirmBooking, { isLoading: confirming }] = useConfirmWorkshopBookingMutation();
  const [localBooking, setLocalBooking] = useState(false);

  const isBooked = useMemo((): boolean => {
    if (workshop == null) return false;
    return myBookings.some((b) => b.workshopId === workshop.id);
  }, [myBookings, workshop]);

  const runBooking = useCallback(async (): Promise<void> => {
    if (workshop == null) return;

    const fee = resolveWorkshopFee(workshop);
    try {
      if (fee.isFree) {
        await createBooking({ workshopId: workshop.id, type: 'free' }).unwrap();
        Alert.alert('Booked', 'Your seat has been reserved for this workshop.');
        return;
      }

      const result = await createBooking({ workshopId: workshop.id, type: 'online' }).unwrap();
      if (!isPaidBookingResult(result)) {
        Alert.alert('Booked', 'Your seat has been reserved for this workshop.');
        return;
      }

      const payment = await openWorkshopRazorpayCheckout({
        keyId: result.razorpayKeyId,
        orderId: result.razorpayOrderId,
        amountPaise: result.amount > 0 ? result.amount : Math.round(fee.amount * 100),
        workshopName: workshop.name,
        customerName: displayName ?? 'Guest',
        customerEmail: email ?? '',
        customerPhone: mobile ?? '',
      });

      await confirmBooking({
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
      }).unwrap();

      Alert.alert('Confirmed', 'Payment received. Your workshop seat is confirmed.');
    } catch (error: unknown) {
      if (error instanceof WorkshopPaymentCancelledError) {
        return;
      }
      Alert.alert('Booking', readBookingErrorMessage(error));
    }
  }, [
    workshop,
    createBooking,
    confirmBooking,
    displayName,
    email,
    mobile,
  ]);

  const onBookPress = useCallback((): void => {
    if (workshop == null || localBooking) return;

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

    const fee = resolveWorkshopFee(workshop);
    const feeLine = fee.isFree ? 'FREE' : fee.label;
    Alert.alert(
      'Confirm booking',
      `Book "${workshop.name}"?\nRegistration fee: ${feeLine}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book',
          onPress: () => {
            setLocalBooking(true);
            void runBooking().finally(() => setLocalBooking(false));
          },
        },
      ],
    );
  }, [workshop, localBooking, isAuthenticated, isBooked, navigation, runBooking]);

  return {
    isBooked,
    isBooking: creating || confirming || localBooking,
    onBookPress,
  };
}
