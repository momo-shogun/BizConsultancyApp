import type { ConsultantDetail } from '@/features/consultant/types/consultantDetail.types';
import { store } from '@/store';

import { callEngine } from '../engine/CallEngine';
import type { CallType } from '../types/callApi.types';

function requireAuthUser(): { userId: number; role: string } | null {
  const state = store.getState();
  const token = state.auth.token;
  const role = state.auth.accountRole ?? 'user';
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
    if (auth.role === 'consultant') {
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

  async startOutgoingFromBooking(bookingId: number, remoteName: string): Promise<string | null> {
    const auth = requireAuthUser();
    if (auth == null) {
      return 'Please login to start a call';
    }
    if (auth.role !== 'consultant') {
      return 'Only consultants can start calls from bookings';
    }

    callEngine.bindSocketHandlers();
    await callEngine.startOutgoingFromBooking(bookingId, remoteName);
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
