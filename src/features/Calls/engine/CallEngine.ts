import { OUTGOING_RING_TIMEOUT_MS } from '@/constants/calls';
import { store } from '@/store';
import { callsApi } from '../api/callsApi';
import { callSocketService } from '../services/callSocketService';
import { agoraMediaService } from '../services/agoraMediaService';
import {
  resetCallState,
  setCallError,
  setCallPhase,
  setCallSession,
  setIncomingCall,
  setLocalMuted,
  setReconnecting,
  setRemoteMuted,
  setSpeakerOn,
  updateCredentials,
} from '../store/callSlice';
import type {
  CallIncomingPayload,
  CallType,
  PersistedCallCredentials,
} from '../types/callApi.types';
import { CallReliabilityManager } from './CallReliabilityManager';
import { syncCallSession } from './CallStateSyncService';
import { transitionCallPhase, type CallPhase } from './callStateMachine';

type NavigateFn = (screen: 'OutgoingCall' | 'InCall', params: { sessionId: number }) => void;

class CallEngineImpl {
  private reliability = new CallReliabilityManager();
  private navigate: NavigateFn | null = null;
  private ringTimeout: ReturnType<typeof setTimeout> | null = null;
  private syncTimer: ReturnType<typeof setInterval> | null = null;

  setNavigator(navigate: NavigateFn): void {
    this.navigate = navigate;
  }

  bindSocketHandlers(): void {
    const token = store.getState().auth.token;
    if (token == null || token.length === 0) {
      return;
    }
    callSocketService.connect(token, {
      onIncoming: (p) => this.handleIncoming(p),
      onAccepted: (p) => {
        void this.handleAccepted(p.sessionId);
      },
      onDeclined: () => this.handleRemoteEnd(),
      onEnded: () => this.handleRemoteEnd(),
      onMute: (p) => {
        store.dispatch(setRemoteMuted(p.muted));
      },
    });
  }

  private getCallState() {
    return store.getState().call;
  }

  private applyPhase(event: Parameters<typeof transitionCallPhase>[1]): CallPhase {
    const current = this.getCallState().phase;
    const next = transitionCallPhase(current, event);
    store.dispatch(setCallPhase(next));
    return next;
  }

  private clearRingTimeout(): void {
    if (this.ringTimeout != null) {
      clearTimeout(this.ringTimeout);
      this.ringTimeout = null;
    }
  }

  private startSyncTimer(sessionId: number): void {
    this.stopSyncTimer();
    this.syncTimer = setInterval(() => {
      void syncCallSession(sessionId, this.reliability.getLastEventVersion());
    }, 20_000);
  }

  private stopSyncTimer(): void {
    if (this.syncTimer != null) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  async startOutgoing(calleeUserId: number, callType: CallType, remoteName: string): Promise<void> {
    store.dispatch(resetCallState());
    this.reliability.reset();
    store.dispatch(setCallPhase('outgoing_initiating'));
    store.dispatch(setCallError(null));

    const result = await store.dispatch(
      callsApi.endpoints.initiateCall.initiate({ calleeUserId, callType }),
    );

    if ('error' in result) {
      store.dispatch(setCallError('Failed to start call'));
      store.dispatch(setCallPhase('idle'));
      return;
    }

    const data = result.data;
    const credentials: PersistedCallCredentials = {
      sessionId: data.sessionId,
      channelName: data.channelName,
      callType: data.callType,
      appId: data.appId,
      uid: data.uid,
      rtcToken: data.rtcToken,
      mode: 'outgoing',
    };

    store.dispatch(
      setCallSession({
        sessionId: data.sessionId,
        callType: data.callType,
        credentials,
        remoteDisplayName: remoteName,
      }),
    );
    this.applyPhase('INITIATE_OK');
    callSocketService.setActiveCallId(data.sessionId);

    this.ringTimeout = setTimeout(() => {
      void this.endCall('missed_timeout');
    }, OUTGOING_RING_TIMEOUT_MS);

    this.navigate?.('OutgoingCall', { sessionId: data.sessionId });

    agoraMediaService.setListeners({
      onConnectionState: (state) => {
        if (state === 'connected') {
          this.applyPhase('AGORA_JOINED');
        }
      },
    });

    await agoraMediaService.join({
      appId: data.appId,
      channelName: data.channelName,
      token: data.rtcToken,
      uid: data.uid,
      callType: data.callType,
    });
  }

  async startOutgoingFromBooking(bookingId: number, remoteName: string): Promise<void> {
    store.dispatch(resetCallState());
    this.reliability.reset();
    store.dispatch(setCallPhase('outgoing_initiating'));

    const result = await store.dispatch(
      callsApi.endpoints.initiateCallFromBooking.initiate({ bookingId }),
    );

    if ('error' in result) {
      store.dispatch(setCallError('Failed to start call'));
      store.dispatch(setCallPhase('idle'));
      return;
    }

    const data = result.data;
    const credentials: PersistedCallCredentials = {
      sessionId: data.sessionId,
      channelName: data.channelName,
      callType: data.callType,
      appId: data.appId,
      uid: data.uid,
      rtcToken: data.rtcToken,
      mode: 'outgoing',
    };

    store.dispatch(
      setCallSession({
        sessionId: data.sessionId,
        callType: data.callType,
        credentials,
        remoteDisplayName: remoteName,
      }),
    );
    this.applyPhase('INITIATE_OK');
    callSocketService.setActiveCallId(data.sessionId);
    this.navigate?.('OutgoingCall', { sessionId: data.sessionId });

    await agoraMediaService.join({
      appId: data.appId,
      channelName: data.channelName,
      token: data.rtcToken,
      uid: data.uid,
      callType: data.callType,
    });
  }

  handleIncoming(payload: CallIncomingPayload): void {
    if (
      !this.reliability.shouldApply(payload.eventId, payload.eventVersion)
    ) {
      return;
    }
    this.reliability.markApplied(payload.eventId, payload.eventVersion);

    const callType = (payload.callType === 'video' ? 'video' : 'voice') as CallType;
    store.dispatch(
      setIncomingCall({
        sessionId: payload.sessionId,
        callType,
        callerUserId: payload.callerUserId,
        remoteDisplayName: 'Caller',
      }),
    );
    callSocketService.setActiveCallId(payload.sessionId);
  }

  private async handleAccepted(sessionId: number): Promise<void> {
    const state = this.getCallState();
    if (state.sessionId !== sessionId) {
      return;
    }
    this.clearRingTimeout();
    this.applyPhase('ACCEPT_OK');
    this.navigate?.('InCall', { sessionId });
    this.startSyncTimer(sessionId);
  }

  async acceptIncoming(): Promise<void> {
    const sessionId = this.getCallState().sessionId;
    if (sessionId == null) {
      return;
    }

    const result = await store.dispatch(callsApi.endpoints.acceptCall.initiate(sessionId));
    if ('error' in result) {
      store.dispatch(setCallError('Could not accept call'));
      return;
    }

    const data = result.data;
    const credentials: PersistedCallCredentials = {
      sessionId: data.sessionId,
      channelName: data.channelName,
      callType: data.callType,
      appId: data.appId,
      uid: data.uid,
      rtcToken: data.rtcToken,
      mode: 'incoming',
    };
    store.dispatch(updateCredentials(credentials));
    this.applyPhase('ACCEPT_OK');
    this.clearRingTimeout();
    this.navigate?.('InCall', { sessionId });
    this.startSyncTimer(sessionId);

    await agoraMediaService.join({
      appId: data.appId,
      channelName: data.channelName,
      token: data.rtcToken,
      uid: data.uid,
      callType: data.callType,
    });
    this.applyPhase('AGORA_JOINED');
  }

  async declineIncoming(): Promise<void> {
    const sessionId = this.getCallState().sessionId;
    if (sessionId == null) {
      return;
    }
    await store.dispatch(callsApi.endpoints.declineCall.initiate(sessionId));
    this.teardown();
  }

  async endCall(
    endReason: 'ended_by_user' | 'ended_by_consultant' | 'caller_cancelled' | 'missed_timeout' = 'ended_by_user',
  ): Promise<void> {
    const sessionId = this.getCallState().sessionId;
    if (sessionId == null) {
      this.teardown();
      return;
    }
    store.dispatch(setCallPhase('ending'));
    this.clearRingTimeout();
    await store.dispatch(
      callsApi.endpoints.endCall.initiate({ sessionId, body: { endReason } }),
    );
    this.teardown();
  }

  private handleRemoteEnd(): void {
    this.applyPhase('ENDED');
    this.teardown();
  }

  async reconnectMedia(): Promise<void> {
    const callState = this.getCallState();
    const sessionId = callState.sessionId;
    const creds = callState.credentials;
    if (sessionId == null) {
      return;
    }
    store.dispatch(setReconnecting(true));
    this.applyPhase('AGORA_LOST');

    const result = await store.dispatch(callsApi.endpoints.rejoinCall.initiate(sessionId));
    if ('error' in result || result.data == null) {
      store.dispatch(setReconnecting(false));
      return;
    }

    const data = result.data;
    const nextCreds: PersistedCallCredentials = {
      sessionId: data.sessionId,
      channelName: data.channelName,
      callType: data.callType,
      appId: data.appId,
      uid: data.uid,
      rtcToken: data.rtcToken,
      mode: creds?.mode ?? 'outgoing',
    };
    store.dispatch(updateCredentials(nextCreds));
    await agoraMediaService.leave();
    await agoraMediaService.join({
      appId: data.appId,
      channelName: data.channelName,
      token: data.rtcToken,
      uid: data.uid,
      callType: data.callType,
    });
    await syncCallSession(sessionId, this.reliability.getLastEventVersion());
    store.dispatch(setReconnecting(false));
    this.applyPhase('REJOIN_OK');
  }

  setMuted(muted: boolean): void {
    store.dispatch(setLocalMuted(muted));
    agoraMediaService.setMuted(muted);
    const sessionId = this.getCallState().sessionId;
    if (sessionId != null) {
      callSocketService.emitMute(sessionId, muted);
    }
  }

  setSpeaker(enabled: boolean): void {
    store.dispatch(setSpeakerOn(enabled));
    agoraMediaService.setSpeakerphone(enabled);
  }

  teardown(): void {
    this.clearRingTimeout();
    this.stopSyncTimer();
    callSocketService.setActiveCallId(null);
    void agoraMediaService.leave();
    this.reliability.reset();
    store.dispatch(resetCallState());
  }
}

export const callEngine = new CallEngineImpl();
