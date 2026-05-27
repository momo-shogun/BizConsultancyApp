import { useCallback, useState } from 'react';

import { CallController } from '@/features/Calls/controllers/CallController';
import { callEngine } from '@/features/Calls/engine/CallEngine';
import type { MyConsultantBooking } from '@/features/Bookings/types/myConsultantBooking.types';
import { hasBookingStarted } from '@/features/Bookings/utils/bookingDateTime';
import {
  canShowCallAction,
  isBookingConfirmed,
  isCallableConsultation,
} from '@/features/Bookings/utils/bookingDisplay';
import { consultationTypeToCallType } from '@/features/Calls/utils/callTypeMapping';
import { useAppSelector } from '@/store/typedHooks';
import { showGlobalToast } from '@/shared/components/toast';

export interface UseUserBookingCallResult {
  callingBookingId: number | null;
  startCallFromBooking: (booking: MyConsultantBooking, filter: 'upcoming' | 'past') => Promise<void>;
}

function isUserAccountRole(role: string | null | undefined): boolean {
  const normalized = (role ?? 'user').trim().toLowerCase();
  return normalized === 'user' || normalized === 'admin' || normalized === '';
}

export function useUserBookingCall(): UseUserBookingCallResult {
  const accountRole = useAppSelector((s) => s.auth.accountRole);
  const [callingBookingId, setCallingBookingId] = useState<number | null>(null);

  const startCallFromBooking = useCallback(
    async (booking: MyConsultantBooking, filter: 'upcoming' | 'past'): Promise<void> => {
      if (callingBookingId != null) {
        return;
      }

      if (!isUserAccountRole(accountRole)) {
        showGlobalToast({
          message: 'Switch to a user account to start calls from My Bookings',
          variant: 'error',
        });
        return;
      }

      if (!isCallableConsultation(booking.consultationType)) {
        showGlobalToast({
          message: 'Call is not available for this booking type',
          variant: 'error',
        });
        return;
      }

      if (!canShowCallAction(booking, filter)) {
        if (filter !== 'upcoming') {
          showGlobalToast({ message: 'Calls are only available for upcoming bookings', variant: 'error' });
          return;
        }
        if (!isBookingConfirmed(booking.status)) {
          showGlobalToast({
            message: 'Call is available after your booking is confirmed',
            variant: 'error',
          });
          return;
        }
        showGlobalToast({ message: 'Call is not available for this booking', variant: 'error' });
        return;
      }

      if (!hasBookingStarted(booking.bookingDate, booking.slotTime)) {
        showGlobalToast({
          message: 'Please wait until your scheduled slot time',
          variant: 'error',
        });
        return;
      }

      const callType = consultationTypeToCallType(booking.consultationType);
      if (callType == null) {
        showGlobalToast({
          message: 'Call is not available for this booking type',
          variant: 'error',
        });
        return;
      }

      setCallingBookingId(booking.id);
      callEngine.bindSocketHandlers();

      const error = await CallController.startOutgoingFromUserBooking(booking);
      setCallingBookingId(null);

      if (error != null) {
        showGlobalToast({ message: error, variant: 'error' });
      }
    },
    [accountRole, callingBookingId],
  );

  return {
    callingBookingId,
    startCallFromBooking,
  };
}
