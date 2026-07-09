import type { MyConsultantBooking } from '@/features/Bookings/types/myConsultantBooking.types';
import { hasBookingStarted } from '@/features/Bookings/utils/bookingDateTime';
import type { ConsultantDetail } from '@/features/consultant/types/consultantDetail.types';
import { store } from '@/store';

import { callEngine } from '../engine/CallEngine';
import type { CallType } from '../types/callApi.types';
import { consultationTypeToCallType } from '../utils/callTypeMapping';

function normalizeAccountRole(role: string | null | undefined): string {
  return (role ?? 'user').trim().toLowerCase();
}

function isConsultantRole(role: string): boolean {
  return role === 'consultant';
}

function isUserRole(role: string): boolean {
  return role === 'user' || role === 'admin' || role === '';
}

function requireAuthUser(): { userId: number; role: string } | null {
  const state = store.getState();
  const token = state.auth.token;
  const role = normalizeAccountRole(state.auth.accountRole);
  const userIdRaw = state.auth.user?.id ?? '';
  const userId = Number(userIdRaw);
  if (token == null || token.length === 0 || !Number.isFinite(userId) || userId <= 0) {
    return null;
  }
  return { userId, role };
}

export const CallController = {
  async startOutgoingToConsultant(detail: ConsultantDetail): Promise<string | null> {
    const auth = requireAuthUser();
    if (auth == null) {
      return 'Please login to start a call';
    }
    if (isConsultantRole(auth.role)) {
      return 'Only users can initiate call from this page';
    }

    const calleeUserId = Number(detail.id);
    if (!Number.isFinite(calleeUserId) || calleeUserId <= 0) {
      return 'Invalid consultant';
    }

    callEngine.bindSocketHandlers();
    await callEngine.startOutgoing(calleeUserId, 'voice', detail.name);
    return null;
  },

  async startOutgoingFromUserBooking(booking: MyConsultantBooking): Promise<string | null> {
    const auth = requireAuthUser();
    if (auth == null) {
      return 'Please login to start a call';
    }
    if (isConsultantRole(auth.role) || !isUserRole(auth.role)) {
      return 'Only users can start calls from My Bookings';
    }

    const callType = consultationTypeToCallType(booking.consultationType);
    if (callType == null) {
      return 'Call is not available for this booking type';
    }

    if (!hasBookingStarted(booking.bookingDate, booking.slotTime)) {
      return 'Please wait for the scheduled time';
    }

    const calleeUserId = booking.consultantId;
    if (!Number.isFinite(calleeUserId) || calleeUserId <= 0) {
      return 'Invalid consultant for this booking';
    }

    const remoteName = booking.consultantName?.trim() || booking.name?.trim() || 'Consultant';
    return CallController.startOutgoingWithType(calleeUserId, callType, remoteName);
  },

  async startOutgoingFromBooking(
    bookingId: number,
    remoteName: string,
    consultationType: string,
    bookingDate: string,
    slotTime: string,
  ): Promise<string | null> {
    const auth = requireAuthUser();
    if (auth == null) {
      return 'Please login to start a call';
    }
    if (!isConsultantRole(auth.role)) {
      return 'Only consultants can start calls from bookings';
    }

    const callType = consultationTypeToCallType(consultationType);
    if (callType == null) {
      return 'Call is not available for this booking type';
    }

    if (!hasBookingStarted(bookingDate, slotTime)) {
      return 'Please wait for the scheduled time';
    }

    callEngine.bindSocketHandlers();
    await callEngine.startOutgoingFromBooking(bookingId, remoteName, callType);
    return null;
  },

  acceptIncoming(): Promise<void> {
    return callEngine.acceptIncoming();
  },

  declineIncoming(): Promise<void> {
    return callEngine.declineIncoming();
  },

  endCall(): Promise<void> {
    return callEngine.endCall();
  },

  setMuted(muted: boolean): void {
    callEngine.setMuted(muted);
  },

  setSpeaker(on: boolean): void {
    callEngine.setSpeaker(on);
  },

  setVideoEnabled(enabled: boolean): void {
    callEngine.setVideoEnabled(enabled);
  },

  switchCamera(): void {
    callEngine.switchCamera();
  },

  minimizeCall(): void {
    callEngine.minimizeCall();
  },

  expandCall(): void {
    callEngine.expandCall();
  },

  async startOutgoingWithType(
    calleeUserId: number,
    callType: CallType,
    remoteName: string,
  ): Promise<string | null> {
    const auth = requireAuthUser();
    if (auth == null) {
      return 'Please login to start a call';
    }
    callEngine.bindSocketHandlers();
    await callEngine.startOutgoing(calleeUserId, callType, remoteName);
    return null;
  },
};
