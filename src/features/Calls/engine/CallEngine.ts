import { StackActions } from '@react-navigation/native';
import { AppState } from 'react-native';

import { readPersistedAuthTokenSync } from '@/features/Auth/store/readPersistedAuthToken';
import {
  CALL_STATE_SYNC_INTERVAL_MS,
  INCOMING_RING_STATUS_POLL_MS,
  INCOMING_RING_TIMEOUT_MS,
  OUTGOING_RING_BACKGROUND_CANCEL_MS,
  OUTGOING_RING_STATUS_POLL_MS,
  OUTGOING_RING_TIMEOUT_MS,
  REMOTE_REJOIN_GRACE_MS,
} from '@/constants/calls';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import { store } from '@/store';
import { callsApi } from '../api/callsApi';
import { callSocketService } from '../services/callSocketService';
import { agoraMediaService } from '../services/agoraMediaService';
import { cancelIncomingCallNotification, displayIncomingCallNotification, setNativeConnectedCallSession } from '../services/callNotificationService';
import { callForegroundService, type ReturnToCallStage } from '../services/callForegroundService';
import {
  clearActiveCallSnapshot,
  isRingSnapshotExpired,
  readActiveCallSnapshot,
  saveActiveCallSnapshot,
} from '../services/activeCallPersistence';
import {
  enableCallLockOverlay,
  isDeviceLocked,
  leaveCallUiIfLocked,
} from '../services/callLockScreenBridge';
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
  CallSessionStatusResponse,
  CallType,
  PersistedCallCredentials,
} from '../types/callApi.types';
import type { CallAnsweredSignal } from './callLifecycle';
import { CallReliabilityManager } from './CallReliabilityManager';
import { syncCallSession } from './CallStateSyncService';
import { transitionCallPhase, type CallPhase } from './callStateMachine';
import { ensureCallPermissions } from '../utils/callPermissions';
import { resolveLocalCallRole, resolveLocalUserId } from '../utils/resolveLocalCallRole';

type CallScreen = 'IncomingCall' | 'OutgoingCall' | 'InCall';

/** Server statuses from which a session can never return to an active call. */
const TERMINAL_CALL_STATUSES: readonly string[] = ['ended', 'declined', 'missed', 'failed'];

function isTerminalCallStatus(status: string | null | undefined): boolean {
  return status != null && TERMINAL_CALL_STATUSES.includes(status);
}

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
  private incomingRingTimeout: ReturnType<typeof setTimeout> | null = null;
  private incomingRingStatusPollTimer: ReturnType<typeof setInterval> | null = null;
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private teardownTimer: ReturnType<typeof setTimeout> | null = null;
  private remoteLeftGraceTimer: ReturnType<typeof setTimeout> | null = null;
  private handlersBound = false;
  /** Idempotent guard: caller already transitioned RINGING → ANSWERED. */
  private outgoingAnswered = false;
  /** Prevent overlapping leave/rejoin that peers treat as a hang-up. */
  private reconnectInFlight = false;
  private appStateSub: { remove: () => void } | null = null;
  private restoreInFlight = false;
  /** Cancels outbound ring if the caller leaves the app and does not return. */
  private outgoingBackgroundCancelTimer: ReturnType<typeof setTimeout> | null = null;

  /** Apply navigation requested before `NavigationContainer` mounted (cold start via FCM). */
  flushPendingCallNavigation(): void {
    const pending = this.pendingNavigation;
    if (pending == null || navigationRef.isReady() !== true) {
      return;
    }
    this.pendingNavigation = null;
    const state = this.getCallState();
    /**
     * After a missed/ended call, teardown resets phase to idle but used to leave
     * `pendingNavigation` set — flushing it on the next open resurrected IncomingCall.
     */
    if (!this.isPendingNavigationStillValid(pending, state)) {
      return;
    }
    enableCallLockOverlay();
    const route = this.routeForScreen(pending.screen);
    const params = { sessionId: pending.sessionId };
    if (pending.kind === 'replace') {
      navigationRef.dispatch(StackActions.replace(route as never, params as never));
    } else {
      navigationRef.navigate(route as never, params as never);
    }
  }

  private isPendingNavigationStillValid(
    pending: PendingCallNavigation,
    state: CallUiState,
  ): boolean {
    if (state.sessionId != null && Number(state.sessionId) !== Number(pending.sessionId)) {
      return false;
    }
    if (pending.screen === 'IncomingCall') {
      return state.phase === 'incoming_ringing';
    }
    if (pending.screen === 'OutgoingCall') {
      return state.phase === 'outgoing_ringing' || state.phase === 'outgoing_initiating';
    }
    return (
      state.phase === 'in_call' ||
      state.phase === 'connecting_media' ||
      state.phase === 'reconnecting'
    );
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
    const storeToken = store.getState().auth?.token;
    const token =
      storeToken != null && storeToken.length > 0 ? storeToken : readPersistedAuthTokenSync();
    if (token == null || token.length === 0) {
      return;
    }
    this.handlersBound = true;
    this.ensureAppStateListener();
    // Always call connect: updates handlers and recreates the socket if it dropped.
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
    this.clearOutgoingBackgroundCancel();
    this.appStateSub?.remove();
    this.appStateSub = null;
    callSocketService.disconnect();
  }

  private clearOutgoingBackgroundCancel(): void {
    if (this.outgoingBackgroundCancelTimer != null) {
      clearTimeout(this.outgoingBackgroundCancelTimer);
      this.outgoingBackgroundCancelTimer = null;
    }
  }

  /**
   * Caller left the app while still ringing. After a short grace, cancel so the consultant
   * stops ringing and cannot answer a call with no live caller.
   */
  private scheduleOutgoingBackgroundCancel(): void {
    this.clearOutgoingBackgroundCancel();
    this.outgoingBackgroundCancelTimer = setTimeout(() => {
      this.outgoingBackgroundCancelTimer = null;
      if (AppState.currentState === 'active') {
        return;
      }
      const state = this.getCallState();
      if (state.phase !== 'outgoing_ringing' && state.phase !== 'outgoing_initiating') {
        return;
      }
      if (this.outgoingAnswered || state.connectedAtMs != null) {
        return;
      }
      void this.endCall('caller_cancelled');
    }, OUTGOING_RING_BACKGROUND_CANCEL_MS);
  }

  private ensureAppStateListener(): void {
    if (this.appStateSub != null) {
      return;
    }
    void callForegroundService.warmUp();
    this.appStateSub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        this.clearOutgoingBackgroundCancel();
        return;
      }
      if (next !== 'background' && next !== 'inactive') {
        return;
      }
      const state = this.getCallState();
      if (this.isReturnToCallPhase(state.phase)) {
        // Paint immediately on leave — don't wait for the next FGS timer tick.
        if (callForegroundService.isRunning()) {
          callForegroundService.bump();
        }
        this.ensureReturnToCallNotification();
      }
      if (state.phase === 'outgoing_ringing' || state.phase === 'outgoing_initiating') {
        this.scheduleOutgoingBackgroundCancel();
      }
    });
  }

  private isReturnToCallPhase(phase: CallPhase): boolean {
    return (
      phase === 'outgoing_initiating' ||
      phase === 'outgoing_ringing' ||
      phase === 'incoming_ringing' ||
      phase === 'connecting_media' ||
      phase === 'in_call' ||
      phase === 'reconnecting'
    );
  }

  private stageForPhase(phase: CallPhase): ReturnToCallStage {
    if (phase === 'incoming_ringing') {
      return 'incoming_ringing';
    }
    if (phase === 'outgoing_initiating' || phase === 'outgoing_ringing') {
      return 'outgoing_ringing';
    }
    return 'in_call';
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

  private clearIncomingRingTimeout(): void {
    if (this.incomingRingTimeout != null) {
      clearTimeout(this.incomingRingTimeout);
      this.incomingRingTimeout = null;
    }
  }

  private stopIncomingRingStatusPoll(): void {
    if (this.incomingRingStatusPollTimer != null) {
      clearInterval(this.incomingRingStatusPollTimer);
      this.incomingRingStatusPollTimer = null;
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

  /**
   * HTTP fallback while RINGING if sockets miss accept / decline / cancel.
   * Always forceRefetch — cached status stays `initiated` and would miss peer reject.
   */
  private startRingStatusPoll(sessionId: number, side: 'outgoing' | 'incoming'): void {
    this.stopRingStatusPoll();
    this.ringStatusPollTimer = setInterval(() => {
      if (side === 'outgoing') {
        void this.pollOutgoingRingStatus(sessionId);
      } else {
        void this.pollIncomingRingStatus(sessionId);
      }
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

    const result = await store.dispatch(
      callsApi.endpoints.getCallStatus.initiate(sessionId, { forceRefetch: true }),
    );
    if ('error' in result || result.data == null) {
      return;
    }

    if (result.data.status === 'connected') {
      await this.markOutgoingAnswered(sessionId, 'status.connected');
      return;
    }

    this.endIfStatusTerminal(sessionId, result.data);
  }

  /**
   * Callee backstop: the caller abandons the session at OUTGOING_RING_TIMEOUT_MS, after which
   * accept can no longer succeed. Without this the incoming UI rings forever whenever the
   * caller's `call.ended` never reaches this device (socket down, push-only wake).
   */
  private startIncomingRingTimeout(sessionId: number): void {
    this.clearIncomingRingTimeout();
    this.incomingRingTimeout = setTimeout(() => {
      const state = this.getCallState();
      if (state.sessionId !== sessionId || state.phase !== 'incoming_ringing') {
        return;
      }
      void this.expireIncomingRing(sessionId);
    }, INCOMING_RING_TIMEOUT_MS);
  }

  private async expireIncomingRing(sessionId: number): Promise<void> {
    if (await this.endIfSessionClosed(sessionId)) {
      return;
    }
    const state = this.getCallState();
    if (state.sessionId !== sessionId || state.phase !== 'incoming_ringing') {
      // Answered while the status check was in flight.
      return;
    }
    await store.dispatch(
      callsApi.endpoints.endCall.initiate({ sessionId, body: { endReason: 'missed_timeout' } }),
    );
    this.showOutcomeThenEnd('missed');
  }

  /** HTTP fallback while RINGING if sockets miss the caller's cancel / timeout. */
  private startIncomingRingStatusPoll(sessionId: number): void {
    this.stopIncomingRingStatusPoll();
    this.incomingRingStatusPollTimer = setInterval(() => {
      void this.pollIncomingRingStatus(sessionId);
    }, INCOMING_RING_STATUS_POLL_MS);
  }

  private async pollIncomingRingStatus(sessionId: number): Promise<void> {
    const state = this.getCallState();
    if (state.sessionId !== sessionId || state.phase !== 'incoming_ringing') {
      return;
    }
    await this.endIfSessionClosed(sessionId);
  }

  /** Restart the ringing guards after an accept attempt failed for a recoverable reason. */
  private resumeIncomingRing(sessionId: number): void {
    if (this.getCallState().phase !== 'incoming_ringing') {
      return;
    }
    this.startIncomingRingTimeout(sessionId);
    this.startIncomingRingStatusPoll(sessionId);
  }

  /**
   * Ask the server whether the session is already closed and, if so, end the local UI.
   * Returns true when the call was ended here.
   */
  private async endIfSessionClosed(sessionId: number): Promise<boolean> {
    const result = await store.dispatch(
      callsApi.endpoints.getCallStatus.initiate(sessionId, { forceRefetch: true }),
    );
    if ('error' in result || result.data == null) {
      return false;
    }
    return this.endIfStatusTerminal(sessionId, result.data);
  }

  private endIfStatusTerminal(sessionId: number, data: CallSessionStatusResponse): boolean {
    if (!isTerminalCallStatus(data.status)) {
      return false;
    }
    this.clearRemoteLeftGrace();
    this.handleRemoteEnd(
      {
        sessionId,
        status: data.status,
        durationSeconds: data.durationSeconds,
        endReason: data.endReason,
        endedAt: data.endedAt,
      },
      data.status === 'declined' ? 'declined' : 'ended',
    );
    return true;
  }

  private scheduleTeardown(delayMs: number, popNavigation = true): void {
    this.clearTeardownTimer();
    this.teardownTimer = setTimeout(() => {
      void (async () => {
        const locked = await isDeviceLocked();
        if (popNavigation && !locked && navigationRef.isReady()) {
          navigationRef.goBack();
        }
        this.teardown();
      })();
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
    /** Call screens may appear over the keyguard; everyday app shell must not. */
    enableCallLockOverlay();
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
    const tick = (): void => {
      void this.pollInCallStatus(sessionId);
    };
    tick();
    this.syncTimer = setInterval(tick, CALL_STATE_SYNC_INTERVAL_MS);
  }

  private stopSyncTimer(): void {
    if (this.syncTimer != null) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  private clearRemoteLeftGrace(): void {
    if (this.remoteLeftGraceTimer != null) {
      clearTimeout(this.remoteLeftGraceTimer);
      this.remoteLeftGraceTimer = null;
    }
  }

  /** HTTP fallback while in-call if sockets miss call.ended. */
  private async pollInCallStatus(sessionId: number): Promise<void> {
    const state = this.getCallState();
    if (state.sessionId !== sessionId) {
      return;
    }
    if (state.phase !== 'in_call' && state.phase !== 'reconnecting' && state.phase !== 'connecting_media') {
      return;
    }

    const result = await store.dispatch(
      callsApi.endpoints.getCallStatus.initiate(sessionId, { forceRefetch: true }),
    );
    if ('error' in result || result.data == null) {
      await syncCallSession(sessionId, this.reliability.getLastEventVersion());
      return;
    }

    await syncCallSession(sessionId, this.reliability.getLastEventVersion());

    this.endIfStatusTerminal(sessionId, result.data);
  }

  /**
   * Peer left Agora. If server already ended (deliberate hang-up), close UI now.
   * Otherwise wait briefly for soft reconnect before ending.
   */
  private async onRemoteUserLeftFromRtc(): Promise<void> {
    store.dispatch(setRemoteVideoUid(null));
    store.dispatch(setRemoteVideoEnabled(false));

    const state = this.getCallState();
    const sessionId = state.sessionId;
    if (sessionId == null) {
      return;
    }
    if (state.phase !== 'in_call' && state.phase !== 'reconnecting' && state.phase !== 'connecting_media') {
      return;
    }

    const result = await store.dispatch(
      callsApi.endpoints.getCallStatus.initiate(sessionId, { forceRefetch: true }),
    );
    if (!('error' in result) && result.data != null) {
      if (this.endIfStatusTerminal(sessionId, result.data)) {
        return;
      }
    }

    if (this.remoteLeftGraceTimer != null) {
      return;
    }
    store.dispatch(setReconnecting(true));
    this.remoteLeftGraceTimer = setTimeout(() => {
      this.remoteLeftGraceTimer = null;
      const latest = this.getCallState();
      if (latest.sessionId !== sessionId) {
        return;
      }
      if (latest.phase !== 'in_call' && latest.phase !== 'reconnecting' && latest.phase !== 'connecting_media') {
        return;
      }
      // Peer never returned — close from our side.
      void this.endCall('network_drop');
    }, REMOTE_REJOIN_GRACE_MS);
  }

  /**
   * Sticky "Tap to return" tray for any live call phase (outgoing ring, incoming ring, in-call).
   * Also backs the mic FGS once Agora is joined.
   */
  private ensureReturnToCallNotification(): void {
    const state = this.getCallState();
    if (state.sessionId == null || !this.isReturnToCallPhase(state.phase)) {
      return;
    }
    const stage = this.stageForPhase(state.phase);
    const connectedAtMs =
      stage === 'in_call' ? (state.connectedAtMs ?? Date.now()) : 0;
    if (stage === 'in_call') {
      setNativeConnectedCallSession(state.sessionId);
    }
    const existing = readActiveCallSnapshot();
    const ringStartedAtMs =
      existing?.sessionId === state.sessionId && existing.ringStartedAtMs > 0
        ? existing.ringStartedAtMs
        : Date.now();
    saveActiveCallSnapshot({
      sessionId: state.sessionId,
      callType: state.callType ?? 'voice',
      remoteDisplayName: state.remoteDisplayName,
      remoteAvatarUrl: state.remoteAvatarUrl,
      connectedAtMs,
      ringStartedAtMs,
      mode:
        state.credentials?.mode ??
        (state.phase === 'incoming_ringing' ? 'incoming' : 'outgoing'),
    });
    void callForegroundService.start(
      state.remoteDisplayName,
      state.callType === 'video',
      connectedAtMs,
      state.sessionId,
      stage,
    );
    // Connected path: drop any delayed Answer/Decline incoming tray.
    if (stage === 'in_call') {
      void cancelIncomingCallNotification(state.sessionId);
    }
  }

  /** @deprecated name kept as alias — prefer ensureReturnToCallNotification */
  private startCallForegroundService(): void {
    this.ensureReturnToCallNotification();
  }

  /** Discard unanswered / timed-out ring snapshots so reopen does not show call UI. */
  private discardExpiredRingSnapshot(): boolean {
    const snapshot = readActiveCallSnapshot();
    if (snapshot == null) {
      return false;
    }
    if (
      !isRingSnapshotExpired(
        snapshot,
        Date.now(),
        OUTGOING_RING_TIMEOUT_MS,
        INCOMING_RING_TIMEOUT_MS,
      )
    ) {
      return false;
    }
    clearActiveCallSnapshot();
    setNativeConnectedCallSession(null);
    void callForegroundService.stop();
    void cancelIncomingCallNotification(snapshot.sessionId);
    return true;
  }

  /** Instant tray from MMKV before any network restore (skip expired rings). */
  private paintOngoingFromSnapshot(): void {
    if (this.discardExpiredRingSnapshot()) {
      return;
    }
    const snapshot = readActiveCallSnapshot();
    if (snapshot == null) {
      return;
    }
    const stage: ReturnToCallStage =
      snapshot.connectedAtMs > 0
        ? 'in_call'
        : snapshot.mode === 'incoming'
          ? 'incoming_ringing'
          : 'outgoing_ringing';
    if (stage === 'in_call') {
      setNativeConnectedCallSession(snapshot.sessionId);
    }
    void callForegroundService.start(
      snapshot.remoteDisplayName,
      snapshot.callType === 'video',
      snapshot.connectedAtMs,
      snapshot.sessionId,
      stage,
    );
  }

  private showOutcomeThenEnd(outcome: CallOutcome, delayMs = 2200): void {
    const sessionId = this.getCallState().sessionId;
    callRingtoneService.stop();
    this.clearRingTimeout();
    this.stopRingStatusPoll();
    this.clearIncomingRingTimeout();
    this.stopIncomingRingStatusPoll();
    this.clearOutgoingBackgroundCancel();
    this.pendingNavigation = null;
    this.pendingAcceptSessionId = null;
    // Drop Answer/Decline immediately when the other side hangs up / cancels.
    void cancelIncomingCallNotification(sessionId);
    // Clear immediately so a force-kill during the outcome delay cannot restore this call.
    clearActiveCallSnapshot();
    setNativeConnectedCallSession(null);
    void callForegroundService.stop();
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
        this.clearRemoteLeftGrace();
        store.dispatch(setReconnecting(false));
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
        void this.onRemoteUserLeftFromRtc();
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
    this.startRingStatusPoll(data.sessionId, 'outgoing');

    // JOIN_AGORA immediately (do not wait for call.accepted).
    const joined = await this.joinAgoraFromCredentials(credentials);
    if (!joined) {
      await this.endCall('missed_timeout');
      return;
    }
    this.ensureReturnToCallNotification();
  }

  /**
   * Ask the server whether this session should still ring locally.
   * FCM can arrive late — never paint incoming for connected / ended sessions.
   * Returns true when the local UI should NOT start ringing.
   */
  /**
   * Ask the server whether this session should still ring locally.
   * FCM can arrive late — never paint incoming for connected / ended sessions.
   * Returns true when the local UI should NOT start ringing.
   *
   * @param requireConfirmedRinging When true (notification tap / cold open), treat an
   *   unreachable status API as closed so a missed call cannot reopen IncomingCall.
   *   Live FCM must stay fail-open — otherwise a slow status fetch cancels the native
   *   Answer/Decline tray that already painted.
   */
  private async discardIfIncomingSessionClosed(
    sessionId: number,
    opts?: { requireConfirmedRinging?: boolean },
  ): Promise<boolean> {
    const result = await store.dispatch(
      callsApi.endpoints.getCallStatus.initiate(sessionId, { forceRefetch: true }),
    );
    if ('error' in result || result.data == null) {
      if (opts?.requireConfirmedRinging === true) {
        const state = this.getCallState();
        if (state.phase === 'incoming_ringing' && state.sessionId === sessionId) {
          return false;
        }
        return true;
      }
      // Live push: keep ringing; status poll tears down if the session is already dead.
      return false;
    }
    const status = result.data.status;
    // Only `initiated` / `ringing` should open the incoming UI. `connected` means we already
    // answered — a delayed push must not show a second "incoming call" tray entry.
    if (status === 'initiated' || status === 'ringing') {
      return false;
    }
    void cancelIncomingCallNotification(sessionId);
    return true;
  }

  /** True when this device already owns a live session (do not re-ring as incoming). */
  private isLocallyInActiveCall(sessionId?: number): boolean {
    const state = this.getCallState();
    if (
      state.phase !== 'in_call' &&
      state.phase !== 'connecting_media' &&
      state.phase !== 'reconnecting'
    ) {
      return false;
    }
    if (sessionId == null) {
      return state.sessionId != null;
    }
    return state.sessionId === sessionId;
  }

  handleIncoming(payload: CallIncomingPayload): void {
    void this.handleIncomingAsync(payload);
  }

  /**
   * Apply an incoming call only if the server still has it ringing.
   * Returns false when the session is already terminal (missed / ended / …).
   */
  async handleIncomingAsync(
    payload: CallIncomingPayload,
    opts?: { requireConfirmedRinging?: boolean },
  ): Promise<boolean> {
    if (payload.status !== 'initiated' && payload.status !== 'ringing') {
      return false;
    }

    if (this.isLocallyInActiveCall(payload.sessionId)) {
      void cancelIncomingCallNotification(payload.sessionId);
      return false;
    }

    const localRole = resolveLocalCallRole();
    /**
     * When role is known, require match. When unknown (headless pre-rehydrate), trust the push —
     * FCM was already addressed to this device as `payload.calleeRole`.
     */
    if (localRole != null && payload.calleeRole !== localRole) {
      return false;
    }

    const localUserId = resolveLocalUserId();
    // Same device can switch accounts (consultant-1 → consultant-2). Never ring a call for someone else.
    if (localUserId != null && payload.calleeUserId !== localUserId) {
      if (__DEV__) {
        console.warn(
          `[calls] Ignoring incoming for callee=${payload.calleeUserId}; local user=${localUserId}`,
        );
      }
      return false;
    }

    if (!this.reliability.shouldApply(payload.eventId, payload.eventVersion)) {
      return false;
    }

    if (
      await this.discardIfIncomingSessionClosed(payload.sessionId, {
        requireConfirmedRinging: opts?.requireConfirmedRinging === true,
      })
    ) {
      return false;
    }

    // Race: accept completed while status was in flight.
    if (this.isLocallyInActiveCall(payload.sessionId)) {
      void cancelIncomingCallNotification(payload.sessionId);
      return false;
    }

    this.reliability.markApplied(payload.eventId, payload.eventVersion);
    this.applyIncomingRinging(payload);
    return true;
  }

  /**
   * Notifee Answer / Decline / tap: always seed session from notification data.
   * Notification payload is authoritative even if an earlier headless `handleIncoming` no-op'd.
   */
  seedIncomingFromNotification(payload: CallIncomingPayload): void {
    void this.seedIncomingFromNotificationAsync(payload);
  }

  async seedIncomingFromNotificationAsync(payload: CallIncomingPayload): Promise<boolean> {
    if (payload.status !== 'initiated' && payload.status !== 'ringing') {
      return false;
    }

    const localRole = resolveLocalCallRole();
    if (localRole != null && payload.calleeRole !== localRole) {
      return false;
    }
    const localUserId = resolveLocalUserId();
    if (localUserId != null && payload.calleeUserId !== localUserId) {
      await cancelIncomingCallNotification(payload.sessionId);
      return false;
    }

    const state = this.getCallState();
    if (
      state.sessionId === payload.sessionId &&
      (state.phase === 'incoming_ringing' ||
        state.phase === 'connecting_media' ||
        state.phase === 'in_call')
    ) {
      return true;
    }

    // Notification actions / cold open must confirm the session is still ringing.
    if (
      await this.discardIfIncomingSessionClosed(payload.sessionId, {
        requireConfirmedRinging: true,
      })
    ) {
      return false;
    }

    if (this.reliability.shouldApply(payload.eventId, payload.eventVersion)) {
      this.reliability.markApplied(payload.eventId, payload.eventVersion);
    }
    this.applyIncomingRinging(payload, { paintNotification: false });
    return true;
  }

  private applyIncomingRinging(
    payload: CallIncomingPayload,
    opts?: { paintNotification?: boolean },
  ): void {
    const state = this.getCallState();
    if (state.phase === 'incoming_ringing' && state.sessionId === payload.sessionId) {
      return;
    }
    // Never demote a live call back to the incoming ring UI / tray.
    if (this.isLocallyInActiveCall(payload.sessionId)) {
      void cancelIncomingCallNotification(payload.sessionId);
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
    this.startRingStatusPoll(payload.sessionId, 'incoming');
    this.navigateToCallScreen('IncomingCall', payload.sessionId);

    // The caller gives up first; these detect that even when its `call.ended` never arrives.
    this.startIncomingRingTimeout(payload.sessionId);
    this.startIncomingRingStatusPoll(payload.sessionId);
    this.ensureReturnToCallNotification();
    const shouldPaint = opts?.paintNotification !== false;
    /** Socket path when app is backgrounded: still paint a native call-style notification. */
    if (shouldPaint && AppState.currentState !== 'active') {
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
    this.clearOutgoingBackgroundCancel();
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

  /** FCM `call.ended` — tear down local ringing UI when the caller cancelled / timed out. */
  applyRemoteCallEnded(payload: CallEndedPayload): void {
    this.handleRemoteEnd(
      payload,
      payload.status === 'declined' ? 'declined' : 'ended',
    );
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
    this.clearIncomingRingTimeout();
    this.stopIncomingRingStatusPoll();
    store.dispatch(setCallPhase('connecting_media'));

    const incomingCallType = this.getCallState().callType ?? 'voice';
    if (!(await this.ensureCallPermissionsOrAbort(incomingCallType, 'incoming_ringing'))) {
      this.resumeIncomingRing(sessionId);
      return;
    }

    const result = await store.dispatch(callsApi.endpoints.acceptCall.initiate(sessionId));
    if ('error' in result) {
      /**
       * A late answer is rejected by the server because the caller's ring timeout already
       * closed the session. Treat that as terminal — returning to `incoming_ringing` leaves
       * an unanswerable call on screen that can never connect or hang up.
       */
      if (await this.endIfSessionClosed(sessionId)) {
        return;
      }
      store.dispatch(setCallError('Could not accept call'));
      store.dispatch(setCallPhase('incoming_ringing'));
      this.resumeIncomingRing(sessionId);
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
      // Accept already succeeded, so the server has this session connected. Falling back to
      // ringing would strand the caller in a call this device can never join.
      await store.dispatch(
        callsApi.endpoints.endCall.initiate({ sessionId, body: { endReason: 'network_drop' } }),
      );
      this.showOutcomeThenEnd('missed');
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
    this.stopRingStatusPoll();
    void cancelIncomingCallNotification(sessionId);
    // Ensure socket is up so we can still receive peer cancel races during decline.
    this.bindSocketHandlers();

    const declineResult = await store.dispatch(
      callsApi.endpoints.declineCall.initiate(sessionId),
    );
    // If decline fails (status race / network), fall back to end so the caller still
    // gets `call.ended` — critical for app-to-app reject before accept.
    if ('error' in declineResult) {
      await store.dispatch(
        callsApi.endpoints.endCall.initiate({
          sessionId,
          body: { endReason: 'declined' },
        }),
      );
    }
    this.showOutcomeThenEnd('rejected');
  }

  async endCall(
    endReason:
      | 'ended_by_user'
      | 'ended_by_consultant'
      | 'caller_cancelled'
      | 'missed_timeout'
      | 'network_drop' = 'ended_by_user',
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
    this.clearIncomingRingTimeout();
    this.stopIncomingRingStatusPoll();
    this.clearOutgoingBackgroundCancel();
    this.clearRemoteLeftGrace();

    const accountRole = store.getState().auth?.accountRole;
    const reason =
      endReason === 'ended_by_user' && accountRole === 'consultant'
        ? 'ended_by_consultant'
        : endReason;

    await store.dispatch(
      callsApi.endpoints.endCall.initiate({ sessionId, body: { endReason: reason } }),
    );

    if (state.phase === 'outgoing_ringing' || state.phase === 'outgoing_initiating') {
      this.showOutcomeThenEnd(endReason === 'missed_timeout' ? 'missed' : 'rejected');
      return;
    }
    this.teardown();
  }

  private handleRemoteEnd(payload: CallEndedPayload, kind: 'declined' | 'ended'): void {
    // Always clear Answer/Decline for this session — even if local Redux never hydrated
    // (native tray only) or phase is already idle.
    void cancelIncomingCallNotification(payload.sessionId);

    const state = this.getCallState();
    if (state.sessionId == null || Number(payload.sessionId) !== Number(state.sessionId)) {
      return;
    }

    // Treat status=declined on either socket event as a reject (server dual-emits both).
    const effectiveKind: 'declined' | 'ended' =
      kind === 'declined' || payload.status === 'declined' ? 'declined' : 'ended';

    if (
      payload.status != null &&
      payload.status.length > 0 &&
      !isTerminalCallStatus(payload.status)
    ) {
      return;
    }

    this.clearRemoteLeftGrace();

    /**
     * Callee still on the incoming UI. Keyed on phase alone: credentials (and therefore
     * `mode`) only exist once accept has succeeded, so a ringing callee has none — gating
     * this on `mode === 'incoming'` made it drop every caller cancel / timeout.
     */
    if (state.phase === 'incoming_ringing' || state.phase === 'connecting_media') {
      this.showOutcomeThenEnd(effectiveKind === 'declined' ? 'rejected' : 'missed');
      return;
    }

    if (state.phase === 'outgoing_ringing' || state.phase === 'outgoing_initiating') {
      const outcome: CallOutcome =
        effectiveKind === 'declined'
          ? 'rejected'
          : payload.status === 'missed'
            ? 'missed'
            : 'rejected';
      this.showOutcomeThenEnd(outcome);
      return;
    }

    if (state.phase === 'in_call' || state.phase === 'reconnecting' || state.phase === 'ending') {
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
      const joined = await this.joinWithRejoinToken(sessionId, creds?.mode ?? 'outgoing');
      if (!joined) {
        store.dispatch(setReconnecting(false));
        return;
      }
      await syncCallSession(sessionId, this.reliability.getLastEventVersion());
      store.dispatch(setReconnecting(false));
      this.applyPhase('REJOIN_OK');
    } catch {
      store.dispatch(setReconnecting(false));
    } finally {
      this.reconnectInFlight = false;
    }
  }

  /** Rejoin Agora without forcing the UI into `in_call` (used while still ringing). */
  private async rejoinAgoraForActiveSession(sessionId: number): Promise<void> {
    if (agoraMediaService.isInChannel() || this.reconnectInFlight) {
      return;
    }
    this.reconnectInFlight = true;
    try {
      await this.joinWithRejoinToken(
        sessionId,
        this.getCallState().credentials?.mode ?? 'outgoing',
      );
    } finally {
      this.reconnectInFlight = false;
    }
  }

  private async joinWithRejoinToken(
    sessionId: number,
    mode: PersistedCallCredentials['mode'],
  ): Promise<boolean> {
    const result = await store.dispatch(callsApi.endpoints.rejoinCall.initiate(sessionId));
    if ('error' in result || result.data == null) {
      return false;
    }
    const data = result.data;
    const nextCreds: PersistedCallCredentials = {
      sessionId: data.sessionId,
      channelName: data.channelName,
      callType: data.callType,
      appId: data.appId,
      uid: data.uid,
      rtcToken: data.rtcToken,
      mode,
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
    return true;
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
    /** Lock screen: stay on call UI only — no browsing the rest of the app. */
    void isDeviceLocked().then((locked) => {
      if (locked) {
        return;
      }
      store.dispatch(setCallMinimized(true));
      if (navigationRef.isReady() && navigationRef.canGoBack()) {
        navigationRef.goBack();
      }
    });
  }

  expandCall(): void {
    void this.returnToActiveCall();
  }

  /**
   * Tap on the ongoing-call notification (or cold reopen while a live session is persisted).
   * Restores InCall + Agora when JS/Activity restarted with an empty Redux call slice.
   */
  async returnToActiveCall(sessionIdHint?: number): Promise<void> {
    const state = this.getCallState();
    if (this.isReturnToCallPhase(state.phase) && state.sessionId != null) {
      store.dispatch(setCallMinimized(false));
      if (state.phase === 'incoming_ringing') {
        this.navigateToCallScreen('IncomingCall', state.sessionId);
      } else if (state.phase === 'outgoing_ringing' || state.phase === 'outgoing_initiating') {
        this.navigateToCallScreen('OutgoingCall', state.sessionId);
      } else {
        this.navigateToCallScreen('InCall', state.sessionId);
      }
      this.ensureReturnToCallNotification();
      if (
        (state.phase === 'in_call' || state.phase === 'reconnecting' || state.phase === 'connecting_media') &&
        !agoraMediaService.isInChannel()
      ) {
        void this.reconnectMedia({ force: true });
      }
      return;
    }

    if (this.restoreInFlight) {
      return;
    }

    // Show Tap-to-return immediately — do not wait for status HTTP.
    this.paintOngoingFromSnapshot();

    const snapshot = readActiveCallSnapshot();
    const sessionId = sessionIdHint ?? snapshot?.sessionId;
    if (sessionId == null) {
      return;
    }

    this.restoreInFlight = true;
    try {
      this.bindSocketHandlers();
      const result = await store.dispatch(
        callsApi.endpoints.getCallStatus.initiate(sessionId, { forceRefetch: true }),
      );
      if ('error' in result || result.data == null) {
        clearActiveCallSnapshot();
        return;
      }

      /**
       * Cold start / Tap-to-return: only resume a live connected call.
       * Never reopen Incoming/Outgoing ring screens after an unanswered call — that left
       * users stuck on call UI when opening the app later.
       */
      if (result.data.status !== 'connected') {
        clearActiveCallSnapshot();
        setNativeConnectedCallSession(null);
        void callForegroundService.stop();
        void cancelIncomingCallNotification(sessionId);
        return;
      }

      const displayName =
        snapshot?.remoteDisplayName ??
        (state.remoteDisplayName.trim().length > 0 ? state.remoteDisplayName : 'Ongoing call');
      const callType = snapshot?.callType ?? result.data.callType ?? 'voice';
      const mode = snapshot?.mode ?? state.credentials?.mode ?? 'outgoing';
      const serverConnectedAtMs =
        result.data.connectedAt != null ? Date.parse(result.data.connectedAt) : NaN;
      const restoredConnectedAtMs =
        snapshot?.connectedAtMs != null && snapshot.connectedAtMs > 0
          ? snapshot.connectedAtMs
          : Number.isFinite(serverConnectedAtMs) && serverConnectedAtMs > 0
            ? serverConnectedAtMs
            : Date.now();

      this.outgoingAnswered = true;
      store.dispatch(
        setCallSession({
          sessionId,
          callType,
          credentials: {
            sessionId,
            channelName: result.data.channelName,
            callType,
            appId: state.credentials?.appId ?? '',
            uid: state.credentials?.uid ?? 0,
            rtcToken: state.credentials?.rtcToken ?? '',
            mode,
          },
          remoteDisplayName: displayName,
          remoteAvatarUrl: snapshot?.remoteAvatarUrl ?? state.remoteAvatarUrl,
        }),
      );
      store.dispatch(setCallPhase('connecting_media'));
      store.dispatch(setCallMinimized(false));
      store.dispatch(startConnectedTimer(restoredConnectedAtMs));
      callSocketService.setActiveCallId(sessionId);
      this.navigateToCallScreen('InCall', sessionId);
      this.startCallForegroundService();
      this.startSyncTimer(sessionId);
      await this.reconnectMedia({ force: true });
      store.dispatch(setCallPhase('in_call'));
    } finally {
      this.restoreInFlight = false;
    }
  }

  /**
   * After auth boot: only restore a still-connected call. Ringing snapshots are dropped so
   * unanswered calls do not reopen call screens on the next launch.
   */
  async restoreActiveCallIfNeeded(): Promise<void> {
    if (this.discardExpiredRingSnapshot()) {
      return;
    }
    const state = this.getCallState();
    if (this.isReturnToCallPhase(state.phase)) {
      this.ensureReturnToCallNotification();
      return;
    }
    const snapshot = readActiveCallSnapshot();
    if (snapshot == null) {
      return;
    }
    // Unanswered / still-ringing persistence must not open call UI on cold start.
    if (snapshot.connectedAtMs <= 0) {
      clearActiveCallSnapshot();
      void callForegroundService.stop();
      void cancelIncomingCallNotification(snapshot.sessionId);
      return;
    }
    this.paintOngoingFromSnapshot();
    await this.returnToActiveCall(snapshot.sessionId);
  }

  teardown(): void {
    const sessionId = this.getCallState().sessionId;
    this.pendingAcceptSessionId = null;
    this.pendingNavigation = null;
    this.outgoingAnswered = false;
    this.reconnectInFlight = false;
    callRingtoneService.stop();
    clearActiveCallSnapshot();
    setNativeConnectedCallSession(null);
    void callForegroundService.stop();
    void cancelIncomingCallNotification(sessionId);
    this.clearRingTimeout();
    this.stopRingStatusPoll();
    this.clearIncomingRingTimeout();
    this.stopIncomingRingStatusPoll();
    this.clearOutgoingBackgroundCancel();
    this.clearTeardownTimer();
    this.clearRemoteLeftGrace();
    this.stopSyncTimer();
    callSocketService.setActiveCallId(null);
    void agoraMediaService.leave();
    this.reliability.reset();
    store.dispatch(resetCallState());
    leaveCallUiIfLocked();
  }
}

export const callEngine = new CallEngineImpl();
