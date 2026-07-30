import { StackActions } from '@react-navigation/native';
import { AppState } from 'react-native';

import { readPersistedAuthTokenSync } from '@/features/Auth/store/readPersistedAuthToken';
import {
  CALL_STATE_SYNC_INTERVAL_MS,
  OUTGOING_RING_STATUS_POLL_MS,
  OUTGOING_RING_TIMEOUT_MS,
} from '@/constants/calls';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import { store } from '@/store';
import { callsApi } from '../api/callsApi';
import { callSocketService } from '../services/callSocketService';
import { agoraMediaService } from '../services/agoraMediaService';
import { cancelIncomingCallNotification, displayIncomingCallNotification } from '../services/callNotificationService';
import { callForegroundService } from '../services/callForegroundService';
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
  setLocalVideoEnabled,
  setRemoteVideoEnabled,
  setRemoteVideoUid,
  setSpeakerOn,
  startConnectedTimer,
  updateCredentials,
} from '../store/callSlice';
import type { CallOutcome, CallUiState } from '../store/callSlice';
import type {
  CallEndedPayload,
  CallIncomingPayload,
  CallType,
  PersistedCallCredentials,
} from '../types/callApi.types';
import type { CallAnsweredSignal } from './callLifecycle';
import { CallReliabilityManager } from './CallReliabilityManager';
import { syncCallSession } from './CallStateSyncService';
import { transitionCallPhase, type CallPhase } from './callStateMachine';
import { ensureCallPermissions } from '../utils/callPermissions';

type CallScreen = 'IncomingCall' | 'OutgoingCall' | 'InCall';

type PendingCallNavigation =
  | { kind: 'navigate'; screen: CallScreen; sessionId: number }
  | { kind: 'replace'; screen: CallScreen; sessionId: number };

class CallEngineImpl {
  private reliability = new CallReliabilityManager();
  private pendingNavigation: PendingCallNavigation | null = null;
  /** Notifee Answer while JS was headless / auth not ready — retry after CallProvider boots. */
  private pendingAcceptSessionId: number | null = null;
  private ringTimeout: ReturnType<typeof setTimeout> | null = null;
  private ringStatusPollTimer: ReturnType<typeof setInterval> | null = null;
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private teardownTimer: ReturnType<typeof setTimeout> | null = null;
  private handlersBound = false;
  /** Idempotent guard: caller already transitioned RINGING → ANSWERED. */
  private outgoingAnswered = false;
  /** Prevent overlapping leave/rejoin that peers treat as a hang-up. */
  private reconnectInFlight = false;

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

  /**
   * Retry Answer after cold start when the first accept raced ahead of auth / native Agora.
   * Call from CallProvider once the user session is authenticated.
   */
  flushPendingAccept(): void {
    const sessionId = this.pendingAcceptSessionId;
    if (sessionId == null) {
      return;
    }
    const state = this.getCallState();
    if (state.sessionId !== sessionId) {
      return;
    }
    if (state.phase === 'in_call' || state.connectedAtMs != null) {
      this.pendingAcceptSessionId = null;
      return;
    }
    if (state.phase === 'connecting_media') {
      return;
    }
    if (state.phase !== 'incoming_ringing') {
      return;
    }
    void this.acceptIncoming();
  }

  /** Mark that the user answered from a notification (may need a post-boot retry). */
  requestAcceptFromNotification(sessionId: number): void {
    this.pendingAcceptSessionId = sessionId;
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
    const callState = store.getState().call as CallUiState | undefined;
    if (callState == null) {
      // Store is expected to always include the `call` slice; crash early in dev if misconfigured.
      throw new Error('Call state is missing from the Redux store.');
    }
    return callState;
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

  private stopRingStatusPoll(): void {
    if (this.ringStatusPollTimer != null) {
      clearInterval(this.ringStatusPollTimer);
      this.ringStatusPollTimer = null;
    }
  }

  private clearTeardownTimer(): void {
    if (this.teardownTimer != null) {
      clearTimeout(this.teardownTimer);
      this.teardownTimer = null;
    }
  }

  /**
   * Missed timer runs only while callee is RINGING.
   * Cancelled immediately on any answered signal (not on remote media alone).
   */
  private startOutgoingRingTimeout(sessionId: number): void {
    this.clearRingTimeout();
    this.ringTimeout = setTimeout(() => {
      const state = this.getCallState();
      if (state.sessionId !== sessionId || this.outgoingAnswered) {
        return;
      }
      if (state.phase !== 'outgoing_ringing' && state.phase !== 'outgoing_initiating') {
        return;
      }
      void this.endCall('missed_timeout');
    }, OUTGOING_RING_TIMEOUT_MS);
  }

  /** HTTP fallback while RINGING if sockets miss call.accepted. */
  private startRingStatusPoll(sessionId: number): void {
    this.stopRingStatusPoll();
    this.ringStatusPollTimer = setInterval(() => {
      void this.pollOutgoingRingStatus(sessionId);
    }, OUTGOING_RING_STATUS_POLL_MS);
  }

  private async pollOutgoingRingStatus(sessionId: number): Promise<void> {
    const state = this.getCallState();
    if (state.sessionId !== sessionId || this.outgoingAnswered) {
      return;
    }
    if (state.phase !== 'outgoing_ringing') {
      return;
    }

    const result = await store.dispatch(callsApi.endpoints.getCallStatus.initiate(sessionId));
    if ('error' in result || result.data == null) {
      return;
    }

    const status = result.data.status;
    if (status === 'connected') {
      await this.markOutgoingAnswered(sessionId, 'status.connected');
      return;
    }

    if (status === 'declined' || status === 'missed' || status === 'ended' || status === 'failed') {
      this.handleRemoteEnd(
        {
          sessionId,
          status,
          durationSeconds: result.data.durationSeconds,
          endReason: result.data.endReason,
          endedAt: result.data.endedAt,
        },
        status === 'declined' ? 'declined' : 'ended',
      );
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
    }, CALL_STATE_SYNC_INTERVAL_MS);
  }

  private stopSyncTimer(): void {
    if (this.syncTimer != null) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /** Start the mic foreground service once media is live, so the call survives backgrounding. */
  private startCallForegroundService(): void {
    const state = this.getCallState();
    if (state.sessionId == null) {
      return;
    }
    void callForegroundService.start(
      state.remoteDisplayName,
      state.callType === 'video',
      state.connectedAtMs ?? Date.now(),
      state.sessionId,
    );
  }

  private showOutcomeThenEnd(outcome: CallOutcome, delayMs = 2200): void {
    callRingtoneService.stop();
    this.clearRingTimeout();
    this.stopRingStatusPoll();
    store.dispatch(setCallOutcome(outcome));
    store.dispatch(setCallPhase('ended'));
    this.scheduleTeardown(delayMs);
  }

  private async ensureCallPermissionsOrAbort(
    callType: CallType,
    restorePhase?: CallPhase,
  ): Promise<boolean> {
    const permissions = await ensureCallPermissions(callType);
    if (!permissions.microphone) {
      store.dispatch(setCallError('Microphone permission is required for calls'));
      store.dispatch(setCallPhase(restorePhase ?? 'idle'));
      return false;
    }
    if (callType === 'video' && !permissions.camera) {
      store.dispatch(setCallError('Camera permission is required for video calls'));
      store.dispatch(setCallPhase(restorePhase ?? 'idle'));
      return false;
    }
    return true;
  }

  private bindAgoraMediaListeners(): void {
    agoraMediaService.setListeners({
      onRemoteUserJoined: (uid) => {
        store.dispatch(setRemoteVideoUid(uid));
        store.dispatch(setRemoteVideoEnabled(true));
        const state = this.getCallState();
        if (
          state.credentials?.mode === 'outgoing' &&
          state.phase === 'outgoing_ringing' &&
          state.sessionId != null
        ) {
          void this.markOutgoingAnswered(state.sessionId, 'user-joined');
        }
      },
      onRemoteUserLeft: () => {
        store.dispatch(setRemoteVideoUid(null));
        store.dispatch(setRemoteVideoEnabled(false));
      },
      onRemoteVideoMuted: (_uid, muted) => {
        store.dispatch(setRemoteVideoEnabled(!muted));
      },
      onRemoteVideoState: (uid, active) => {
        store.dispatch(setRemoteVideoUid(uid));
        store.dispatch(setRemoteVideoEnabled(active));
      },
      onConnectionState: (state) => {
        // `disconnected` also fires on intentional leave — only recover from hard failures.
        if (state !== 'failed') {
          return;
        }
        const phase = this.getCallState().phase;
        if (phase === 'in_call' || phase === 'connecting_media' || phase === 'reconnecting') {
          void this.reconnectMedia({ force: true });
        }
      },
    });
  }

  private async joinAgoraFromCredentials(credentials: PersistedCallCredentials): Promise<boolean> {
    this.bindAgoraMediaListeners();
    store.dispatch(setLocalVideoEnabled(credentials.callType === 'video'));
    try {
      await agoraMediaService.join({
        appId: credentials.appId,
        channelName: credentials.channelName,
        token: credentials.rtcToken,
        uid: credentials.uid,
        callType: credentials.callType,
      });
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message.length > 0
          ? error.message
          : 'Could not connect call';
      store.dispatch(setCallError(message));
      return false;
    }
  }

  async startOutgoing(calleeUserId: number, callType: CallType, remoteName: string): Promise<void> {
    store.dispatch(resetCallState());
    this.reliability.reset();
    this.outgoingAnswered = false;
    this.clearTeardownTimer();
    this.stopRingStatusPoll();
    store.dispatch(setCallPhase('outgoing_initiating'));
    store.dispatch(setCallError(null));

    if (!(await this.ensureCallPermissionsOrAbort(callType))) {
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

    await this.beginOutgoingAfterInitiate(result.data, remoteName);
  }

  async startOutgoingFromBooking(
    bookingId: number,
    remoteName: string,
    callType: CallType,
  ): Promise<void> {
    store.dispatch(resetCallState());
    this.reliability.reset();
    this.outgoingAnswered = false;
    this.clearTeardownTimer();
    this.stopRingStatusPoll();
    store.dispatch(setCallPhase('outgoing_initiating'));

    if (!(await this.ensureCallPermissionsOrAbort(callType))) {
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

    await this.beginOutgoingAfterInitiate(result.data, remoteName);
  }

  /**
   * Shared caller path (matches web):
   * INITIATE → JOIN_AGORA → RINGING → (wait for answered signal) → CONNECTED
   */
  private async beginOutgoingAfterInitiate(
    data: {
      sessionId: number;
      channelName: string;
      callType: CallType;
      appId: string;
      uid: number;
      rtcToken: string;
    },
    remoteName: string,
  ): Promise<void> {
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
    callRingtoneService.startOutgoing();
    this.navigateToCallScreen('OutgoingCall', data.sessionId);

    // Missed timer tracks callee RINGING from initiate (not from local join).
    this.startOutgoingRingTimeout(data.sessionId);
    this.startRingStatusPoll(data.sessionId);

    // JOIN_AGORA immediately (do not wait for call.accepted).
    const joined = await this.joinAgoraFromCredentials(credentials);
    if (!joined) {
      await this.endCall('missed_timeout');
      return;
    }
  }

  handleIncoming(payload: CallIncomingPayload): void {
    if (payload.status !== 'initiated' && payload.status !== 'ringing') {
      return;
    }

    const accountRole = store.getState().auth?.accountRole;
    const selfRole = accountRole === 'consultant' ? 'consultant' : 'user';
    if (payload.calleeRole !== selfRole) {
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

  /**
   * RINGING → ANSWERED/CONNECTED for the outgoing caller.
   * Triggered by call.accepted | user-joined | status.connected (idempotent).
   */
  private async markOutgoingAnswered(
    sessionId: number,
    _signal: CallAnsweredSignal,
  ): Promise<void> {
    const state = this.getCallState();
    if (state.sessionId !== sessionId) {
      return;
    }
    if (this.outgoingAnswered || state.connectedAtMs != null || state.phase === 'in_call') {
      return;
    }
    if (state.phase !== 'outgoing_ringing' && state.phase !== 'outgoing_initiating') {
      return;
    }

    this.outgoingAnswered = true;
    this.clearRingTimeout();
    this.stopRingStatusPoll();
    callRingtoneService.stop();

    store.dispatch(startConnectedTimer());
    store.dispatch(setSpeakerOn(true));
    store.dispatch(setCallMinimized(false));
    agoraMediaService.setSpeakerphone(true);
    this.startCallForegroundService();
    this.applyPhase('PEER_ANSWERED');
    this.replaceCallScreen('InCall', sessionId);
    this.startSyncTimer(sessionId);
  }

  private async handleAccepted(sessionId: number): Promise<void> {
    await this.markOutgoingAnswered(sessionId, 'call.accepted');
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

    const incomingCallType = this.getCallState().callType ?? 'voice';
    if (!(await this.ensureCallPermissionsOrAbort(incomingCallType, 'incoming_ringing'))) {
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
    store.dispatch(setLocalVideoEnabled(credentials.callType === 'video'));
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
    this.startCallForegroundService();
    this.applyPhase('ACCEPT_OK');
    this.applyPhase('AGORA_JOINED');
    this.pendingAcceptSessionId = null;
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
    this.stopRingStatusPoll();
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

  async reconnectMedia(opts?: { force?: boolean }): Promise<void> {
    const callState = this.getCallState();
    if (callState.phase !== 'in_call' && callState.phase !== 'connecting_media') {
      return;
    }
    if (this.reconnectInFlight) {
      return;
    }
    const sessionId = callState.sessionId;
    const creds = callState.credentials;
    if (sessionId == null) {
      return;
    }

    // Still in the Agora channel — SDK already recovered. Never leave()+join here:
    // peer web treats deliberate leave as Quit and ends the call with network_drop.
    if (!opts?.force && agoraMediaService.isInChannel()) {
      agoraMediaService.refreshVoiceAudio();
      await syncCallSession(sessionId, this.reliability.getLastEventVersion());
      return;
    }

    this.reconnectInFlight = true;
    store.dispatch(setReconnecting(true));
    this.applyPhase('AGORA_LOST');

    try {
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
      this.bindAgoraMediaListeners();
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
    } catch {
      store.dispatch(setReconnecting(false));
    } finally {
      this.reconnectInFlight = false;
    }
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

  setVideoEnabled(enabled: boolean): void {
    store.dispatch(setLocalVideoEnabled(enabled));
    agoraMediaService.setLocalVideoEnabled(enabled);
  }

  switchCamera(): void {
    agoraMediaService.switchCamera();
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
    this.pendingAcceptSessionId = null;
    this.outgoingAnswered = false;
    callRingtoneService.stop();
    void callForegroundService.stop();
    void cancelIncomingCallNotification(sessionId);
    this.clearRingTimeout();
    this.stopRingStatusPoll();
    this.clearTeardownTimer();
    this.stopSyncTimer();
    callSocketService.setActiveCallId(null);
    void agoraMediaService.leave();
    this.reliability.reset();
    store.dispatch(resetCallState());
  }
}

export const callEngine = new CallEngineImpl();
