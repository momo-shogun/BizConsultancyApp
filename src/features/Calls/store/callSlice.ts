import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CallPhase } from '../engine/callStateMachine';
import type { CallType, PersistedCallCredentials } from '../types/callApi.types';

export type CallOutcome = 'none' | 'rejected' | 'missed' | 'connected';

export interface CallUiState {
  phase: CallPhase;
  sessionId: number | null;
  callType: CallType | null;
  credentials: PersistedCallCredentials | null;
  remoteDisplayName: string;
  remoteMuted: boolean;
  localMuted: boolean;
  speakerOn: boolean;
  elapsedSeconds: number;
  reconnecting: boolean;
  lastEventVersion: number;
  errorMessage: string | null;
  incomingCallerUserId: number | null;
  /** Shown on full-screen call UI after remote end / decline. */
  callOutcome: CallOutcome;
  /** When connected timer started (ms). */
  connectedAtMs: number | null;
}

const initialState: CallUiState = {
  phase: 'idle',
  sessionId: null,
  callType: null,
  credentials: null,
  remoteDisplayName: 'Expert',
  remoteMuted: false,
  localMuted: false,
  speakerOn: true,
  elapsedSeconds: 0,
  reconnecting: false,
  lastEventVersion: 0,
  errorMessage: null,
  incomingCallerUserId: null,
  callOutcome: 'none',
  connectedAtMs: null,
};

export const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    resetCallState: () => initialState,
    setCallPhase: (state, action: PayloadAction<CallPhase>) => {
      state.phase = action.payload;
    },
    setCallSession: (
      state,
      action: PayloadAction<{
        sessionId: number;
        callType: CallType;
        credentials: PersistedCallCredentials;
        remoteDisplayName?: string;
      }>,
    ) => {
      state.sessionId = action.payload.sessionId;
      state.callType = action.payload.callType;
      state.credentials = action.payload.credentials;
      if (action.payload.remoteDisplayName != null) {
        state.remoteDisplayName = action.payload.remoteDisplayName;
      }
    },
    setIncomingCall: (
      state,
      action: PayloadAction<{
        sessionId: number;
        callType: CallType;
        callerUserId: number;
        remoteDisplayName?: string;
      }>,
    ) => {
      state.phase = 'incoming_ringing';
      state.sessionId = action.payload.sessionId;
      state.callType = action.payload.callType;
      state.incomingCallerUserId = action.payload.callerUserId;
      state.callOutcome = 'none';
      state.elapsedSeconds = 0;
      state.connectedAtMs = null;
      if (action.payload.remoteDisplayName != null) {
        state.remoteDisplayName = action.payload.remoteDisplayName;
      }
    },
    setCallOutcome: (state, action: PayloadAction<CallOutcome>) => {
      state.callOutcome = action.payload;
    },
    startConnectedTimer: (state) => {
      state.connectedAtMs = Date.now();
      state.callOutcome = 'connected';
      state.elapsedSeconds = 0;
    },
    setRemoteMuted: (state, action: PayloadAction<boolean>) => {
      state.remoteMuted = action.payload;
    },
    setLocalMuted: (state, action: PayloadAction<boolean>) => {
      state.localMuted = action.payload;
    },
    setSpeakerOn: (state, action: PayloadAction<boolean>) => {
      state.speakerOn = action.payload;
    },
    setElapsedSeconds: (state, action: PayloadAction<number>) => {
      state.elapsedSeconds = action.payload;
    },
    setReconnecting: (state, action: PayloadAction<boolean>) => {
      state.reconnecting = action.payload;
    },
    setLastEventVersion: (state, action: PayloadAction<number>) => {
      state.lastEventVersion = action.payload;
    },
    setCallError: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    updateCredentials: (state, action: PayloadAction<PersistedCallCredentials>) => {
      state.credentials = action.payload;
    },
  },
});

export const {
  resetCallState,
  setCallPhase,
  setCallSession,
  setIncomingCall,
  setRemoteMuted,
  setLocalMuted,
  setSpeakerOn,
  setElapsedSeconds,
  setReconnecting,
  setLastEventVersion,
  setCallError,
  updateCredentials,
  setCallOutcome,
  startConnectedTimer,
} = callSlice.actions;
