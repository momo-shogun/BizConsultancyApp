import { StackActions } from '@react-navigation/native';
import { AppState } from 'react-native';

import { readPersistedAuthTokenSync } from '@/features/Auth/store/readPersistedAuthToken';
import { OUTGOING_RING_TIMEOUT_MS } from '@/constants/calls';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import { store } from '@/store';
import { callsApi } from '../api/callsApi';
import { callSocketService } from '../services/callSocketService';
import { agoraMediaService } from '../services/agoraMediaService';
import { cancelIncomingCallNotification, displayIncomingCallNotification } from '../services/callNotificationService';
import { callRingtoneService } from '../services/callRingtoneService';
import { resolveCallPartyImageUrl } from '../utils/callPartyMedia';
import {
  resetCallState,
  setCallError,
  setCallOutcome,
  setCallPhase,
  setCallSession,
  setIncomingCall,
  setLocalMuted,
  setReconnecting,
  setRemoteMuted,
  setCallMinimized,
  setSpeakerOn,
  startConnectedTimer,
  updateCredentials,
} from '../store/callSlice';
import type { CallOutcome } from '../store/callSlice';
import type {
  CallEndedPayload,
  CallIncomingPayload,
  CallType,
  PersistedCallCredentials,
} from '../types/callApi.types';
import { CallReliabilityManager } from './CallReliabilityManager';
import { syncCallSession } from './CallStateSyncService';
import { transitionCallPhase, type CallPhase } from './callStateMachine';
import { ensureCallMicrophonePermission } from '../utils/callPermissions';

type CallScreen = 'IncomingCall' | 'OutgoingCall' | 'InCall';

type PendingCallNavigation =
  | { kind: 'navigate'; screen: CallScreen; sessionId: number }
  | { kind: 'replace'; screen: CallScreen; sessionId: number };

class CallEngineImpl {
  private reliability = new CallReliabilityManager();
  private pendingNavigation: PendingCallNavigation | null = null;
  private ringTimeout: ReturnType<typeof setTimeout> | null = null;
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private teardownTimer: ReturnType<typeof setTimeout> | null = null;
  private handlersBound = false;

  /** Apply navigation requested before `NavigationContainer` mounted (cold start via FCM). */
  flushPendingCallNavigation(): void {
    const pending = this.pendingNavigation;
    if (pending == null || navigationRef.isReady() !== true) {
      return;
    }
    this.pendingNavigation = null;
    const route = this.routeForScreen(pending.screen);
    const params = { sessionId: pending.sessionId };
    if (pending.kind === 'replace') {
      navigationRef.dispatch(StackActions.replace(route as never, params as never));
    } else {
      navigationRef.navigate(route as never, params as never);
    }
  }

  bindSocketHandlers(): void {
    if (this.handlersBound) {
      return;
    }
    const storeToken = store.getState().auth?.token;
    const token =
      storeToken != null && storeToken.length > 0 ? storeToken : readPersistedAuthTokenSync();
    if (token == null || token.length === 0) {
      return;
    }
    this.handlersBound = true;
    callSocketService.connect(token, {
      onIncoming: (p) => this.handleIncoming(p),
      onAccepted: (p) => {
        void this.handleAccepted(p.sessionId);
      },
      onDeclined: (p) => this.handleRemoteEnd(p, 'declined'),
      onEnded: (p) => this.handleRemoteEnd(p, 'ended'),
      onMute: (p) => {
        store.dispatch(setRemoteMuted(p.muted));
      },
    });
  }

  unbindSocketHandlers(): void {
    this.handlersBound = false;
  }

  private getCallState() {
    return store.getState().call!;
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

  private clearTeardownTimer(): void {
    if (this.teardownTimer != null) {
      clearTimeout(this.teardownTimer);
      this.teardownTimer = null;
    }
  }

  private scheduleTeardown(delayMs: number, popNavigation = true): void {
    this.clearTeardownTimer();
    this.teardownTimer = setTimeout(() => {
      if (popNavigation && navigationRef.isReady()) {
        navigationRef.goBack();
      }
      this.teardown();
    }, delayMs);
  }

  private routeForScreen(screen: CallScreen): string {
    if (screen === 'IncomingCall') {
      return ROUTES.Root.IncomingCall;
    }
    if (screen === 'OutgoingCall') {
      return ROUTES.Root.OutgoingCall;
    }
    return ROUTES.Root.InCall;
  }

  private navigateToCallScreen(screen: CallScreen, sessionId: number): void {
    this.enqueueNavigation('navigate', screen, sessionId);
  }

  private replaceCallScreen(screen: CallScreen, sessionId: number): void {
    this.enqueueNavigation('replace', screen, sessionId);
  }

  private enqueueNavigation(
    kind: 'navigate' | 'replace',
    screen: CallScreen,
    sessionId: number,
  ): void {
    if (navigationRef.isReady()) {
      const route = this.routeForScreen(screen);
      const params = { sessionId };
      if (kind === 'replace') {
        navigationRef.dispatch(StackActions.replace(route as never, params as never));
      } else {
        navigationRef.navigate(route as never, params as never);
      }
      return;
    }
    this.pendingNavigation = { kind, screen, sessionId };
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

  private showOutcomeThenEnd(outcome: CallOutcome, delayMs = 2200): void {
    callRingtoneService.stop();
    store.dispatch(setCallOutcome(outcome));
    store.dispatch(setCallPhase('ended'));
    this.scheduleTeardown(delayMs);
  }

  private async ensureMicPermissionOrAbort(restorePhase?: CallPhase): Promise<boolean> {
    const granted = await ensureCallMicrophonePermission();
    if (!granted) {
      store.dispatch(setCallError('Microphone permission is required for calls'));
      store.dispatch(setCallPhase(restorePhase ?? 'idle'));
      return false;
    }
    return true;
  }

  private async joinAgoraFromCredentials(credentials: PersistedCallCredentials): Promise<boolean> {
    agoraMediaService.setListeners({});
    try {
      await agoraMediaService.join({
        appId: credentials.appId,
        channelName: credentials.channelName,
        token: credentials.rtcToken,
        uid: credentials.uid,
        callType: credentials.callType,
      });
      return true;
    } catch {
      store.dispatch(setCallError('Could not connect audio'));
      return false;
    }
  }

  async startOutgoing(calleeUserId: number, callType: CallType, remoteName: string): Promise<void> {
    store.dispatch(resetCallState());
    this.reliability.reset();
    this.clearTeardownTimer();
    store.dispatch(setCallPhase('outgoing_initiating'));
    store.dispatch(setCallError(null));

    if (!(await this.ensureMicPermissionOrAbort())) {
      return;
    }

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

    this.navigateToCallScreen('OutgoingCall', data.sessionId);
  }

  async startOutgoingFromBooking(bookingId: number, remoteName: string): Promise<void> {
    store.dispatch(resetCallState());
    this.reliability.reset();
    this.clearTeardownTimer();
    store.dispatch(setCallPhase('outgoing_initiating'));

    if (!(await this.ensureMicPermissionOrAbort())) {
      return;
    }

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

    this.ringTimeout = setTimeout(() => {
      void this.endCall('missed_timeout');
    }, OUTGOING_RING_TIMEOUT_MS);

    this.navigateToCallScreen('OutgoingCall', data.sessionId);
  }

  handleIncoming(payload: CallIncomingPayload): void {
    if (payload.status !== 'initiated' && payload.status !== 'ringing') {
      return;
    }

    if (!this.reliability.shouldApply(payload.eventId, payload.eventVersion)) {
      return;
    }
    this.reliability.markApplied(payload.eventId, payload.eventVersion);

    const state = this.getCallState();
    if (state.phase === 'incoming_ringing' && state.sessionId === payload.sessionId) {
      return;
    }

    const callType = (payload.callType === 'video' ? 'video' : 'voice') as CallType;
    const callerName = payload.callerName?.trim();
    const displayName =
      callerName != null && callerName.length > 0 ? callerName : 'Incoming caller';
    store.dispatch(
      setIncomingCall({
        sessionId: payload.sessionId,
        callType,
        callerUserId: payload.callerUserId,
        remoteDisplayName: displayName,
        remoteAvatarUrl: resolveCallPartyImageUrl(payload.callerThumbnail),
      }),
    );
    callSocketService.setActiveCallId(payload.sessionId);
    callRingtoneService.start();
    this.navigateToCallScreen('IncomingCall', payload.sessionId);
    /** Socket path when app is backgrounded: still paint a native call-style notification. */
    if (AppState.currentState !== 'active') {
      void displayIncomingCallNotification(payload, { delivery: 'foreground' });
    }
  }

  private async handleAccepted(sessionId: number): Promise<void> {
    const state = this.getCallState();
    if (state.sessionId !== sessionId) {
      return;
    }
    if (state.phase === 'in_call' && state.connectedAtMs != null) {
      return;
    }
    const credentials = state.credentials;
    if (credentials == null) {
      return;
    }

    this.clearRingTimeout();
    store.dispatch(setCallPhase('connecting_media'));

    const joined = await this.joinAgoraFromCredentials(credentials);
    if (!joined) {
      store.dispatch(setCallPhase('outgoing_ringing'));
      return;
    }

    store.dispatch(startConnectedTimer());
    store.dispatch(setSpeakerOn(true));
    store.dispatch(setCallMinimized(false));
    agoraMediaService.setSpeakerphone(true);
    this.applyPhase('ACCEPT_OK');
    this.applyPhase('AGORA_JOINED');
    this.replaceCallScreen('InCall', sessionId);
    this.startSyncTimer(sessionId);
  }

  async acceptIncoming(): Promise<void> {
    const sessionId = this.getCallState().sessionId;
    if (sessionId == null) {
      return;
    }
    const phase = this.getCallState().phase;
    if (phase !== 'incoming_ringing') {
      return;
    }

    callRingtoneService.stop();
    void cancelIncomingCallNotification(sessionId);
    store.dispatch(setCallPhase('connecting_media'));

    if (!(await this.ensureMicPermissionOrAbort('incoming_ringing'))) {
      return;
    }

    const result = await store.dispatch(callsApi.endpoints.acceptCall.initiate(sessionId));
    if ('error' in result) {
      store.dispatch(setCallError('Could not accept call'));
      store.dispatch(setCallPhase('incoming_ringing'));
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
    this.clearRingTimeout();

    const joined = await this.joinAgoraFromCredentials(credentials);
    if (!joined) {
      store.dispatch(setCallPhase('incoming_ringing'));
      return;
    }

    store.dispatch(startConnectedTimer());
    store.dispatch(setSpeakerOn(true));
    store.dispatch(setCallMinimized(false));
    agoraMediaService.setSpeakerphone(true);
    this.applyPhase('ACCEPT_OK');
    this.applyPhase('AGORA_JOINED');
    this.replaceCallScreen('InCall', sessionId);
    this.startSyncTimer(sessionId);
  }

  async declineIncoming(): Promise<void> {
    const sessionId = this.getCallState().sessionId;
    if (sessionId == null) {
      return;
    }
    callRingtoneService.stop();
    void cancelIncomingCallNotification(sessionId);
    await store.dispatch(callsApi.endpoints.declineCall.initiate(sessionId));
    this.showOutcomeThenEnd('rejected');
  }

  async endCall(
    endReason: 'ended_by_user' | 'ended_by_consultant' | 'caller_cancelled' | 'missed_timeout' = 'ended_by_user',
  ): Promise<void> {
    const state = this.getCallState();
    const sessionId = state.sessionId;
    if (sessionId == null) {
      this.teardown();
      return;
    }
    store.dispatch(setCallPhase('ending'));
    this.clearRingTimeout();
    await store.dispatch(
      callsApi.endpoints.endCall.initiate({ sessionId, body: { endReason } }),
    );

    if (state.phase === 'outgoing_ringing' || state.phase === 'outgoing_initiating') {
      this.showOutcomeThenEnd(endReason === 'missed_timeout' ? 'missed' : 'rejected');
      return;
    }
    this.teardown();
  }

  private handleRemoteEnd(payload: CallEndedPayload, kind: 'declined' | 'ended'): void {
    const state = this.getCallState();
    if (state.sessionId == null || payload.sessionId !== state.sessionId) {
      return;
    }

    const terminal = ['ended', 'declined', 'missed', 'failed'];
    if (
      payload.status != null &&
      payload.status.length > 0 &&
      !terminal.includes(payload.status)
    ) {
      return;
    }

    const mode = state.credentials?.mode;

    if (
      mode === 'incoming' &&
      (state.phase === 'incoming_ringing' || state.phase === 'connecting_media')
    ) {
      const outcome: CallOutcome =
        kind === 'declined' ? 'rejected' : payload.status === 'missed' ? 'missed' : 'missed';
      this.showOutcomeThenEnd(outcome);
      return;
    }

    if (state.phase === 'outgoing_ringing' || state.phase === 'outgoing_initiating') {
      const outcome: CallOutcome =
        kind === 'declined' ? 'rejected' : payload.status === 'missed' ? 'missed' : 'rejected';
      this.showOutcomeThenEnd(outcome);
      return;
    }

    if (state.phase === 'in_call' || state.phase === 'reconnecting') {
      this.teardown();
      if (navigationRef.isReady()) {
        navigationRef.goBack();
      }
    }
  }

  async reconnectMedia(): Promise<void> {
    const callState = this.getCallState();
    if (callState.phase !== 'in_call' && callState.phase !== 'connecting_media') {
      return;
    }
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

  minimizeCall(): void {
    const state = this.getCallState();
    if (state.phase !== 'in_call' || state.sessionId == null) {
      return;
    }
    store.dispatch(setCallMinimized(true));
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }

  expandCall(): void {
    const state = this.getCallState();
    if (state.phase !== 'in_call' || state.sessionId == null) {
      return;
    }
    store.dispatch(setCallMinimized(false));
    if (navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.Root.InCall as never, { sessionId: state.sessionId } as never);
    }
  }

  teardown(): void {
    const sessionId = this.getCallState().sessionId;
    callRingtoneService.stop();
    void cancelIncomingCallNotification(sessionId);
    this.clearRingTimeout();
    this.clearTeardownTimer();
    this.stopSyncTimer();
    callSocketService.setActiveCallId(null);
    void agoraMediaService.leave();
    this.reliability.reset();
    store.dispatch(resetCallState());
  }
}

export const callEngine = new CallEngineImpl();
