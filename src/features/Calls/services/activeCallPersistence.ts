import MMKVStorage from 'react-native-mmkv-storage';

import type { CallType, PersistedCallCredentials } from '../types/callApi.types';

const ACTIVE_CALL_KEY = 'calls.active_session_v1';

export interface ActiveCallSnapshot {
  sessionId: number;
  callType: CallType;
  remoteDisplayName: string;
  remoteAvatarUrl: string | null;
  /** >0 only after media is connected; 0 while still ringing. */
  connectedAtMs: number;
  /** When local ringing / outbound initiate started — used to expire stale restore. */
  ringStartedAtMs: number;
  mode: PersistedCallCredentials['mode'];
}

let mmkv: ReturnType<MMKVStorage.Loader['initialize']> | null = null;

function getMmkv(): ReturnType<MMKVStorage.Loader['initialize']> {
  if (mmkv == null) {
    mmkv = new MMKVStorage.Loader().initialize();
  }
  return mmkv;
}

function isCallType(value: unknown): value is CallType {
  return value === 'voice' || value === 'video';
}

function isMode(value: unknown): value is PersistedCallCredentials['mode'] {
  return value === 'incoming' || value === 'outgoing';
}

/** Persist enough to reopen call UI after Activity/JS restart while the session is still live. */
export function saveActiveCallSnapshot(snapshot: ActiveCallSnapshot): void {
  try {
    void getMmkv().setStringAsync(ACTIVE_CALL_KEY, JSON.stringify(snapshot));
  } catch {
    // Best-effort — call can continue without persistence.
  }
}

export function readActiveCallSnapshot(): ActiveCallSnapshot | null {
  try {
    const raw = getMmkv().getString(ACTIVE_CALL_KEY);
    if (raw == null || raw.length === 0) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (parsed == null || typeof parsed !== 'object') {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    const sessionId = Number(record.sessionId);
    if (!Number.isFinite(sessionId) || sessionId <= 0) {
      return null;
    }
    if (!isCallType(record.callType) || !isMode(record.mode)) {
      return null;
    }
    const connectedAtMs = Number(record.connectedAtMs);
    const ringStartedAtMs = Number(record.ringStartedAtMs);
    return {
      sessionId,
      callType: record.callType,
      remoteDisplayName:
        typeof record.remoteDisplayName === 'string' && record.remoteDisplayName.trim().length > 0
          ? record.remoteDisplayName
          : 'Ongoing call',
      remoteAvatarUrl: typeof record.remoteAvatarUrl === 'string' ? record.remoteAvatarUrl : null,
      // Keep 0 for ringing — never coerce to Date.now() (that resurrected dead call screens).
      connectedAtMs: Number.isFinite(connectedAtMs) && connectedAtMs > 0 ? connectedAtMs : 0,
      ringStartedAtMs:
        Number.isFinite(ringStartedAtMs) && ringStartedAtMs > 0 ? ringStartedAtMs : 0,
      mode: record.mode,
    };
  } catch {
    return null;
  }
}

export function clearActiveCallSnapshot(): void {
  try {
    getMmkv().removeItem(ACTIVE_CALL_KEY);
  } catch {
    // ignore
  }
}

/** True when a ringing snapshot is older than the local ring window (missed / unanswered). */
export function isRingSnapshotExpired(
  snapshot: ActiveCallSnapshot,
  nowMs: number = Date.now(),
  outgoingTimeoutMs: number,
  incomingTimeoutMs: number,
): boolean {
  if (snapshot.connectedAtMs > 0) {
    return false;
  }
  if (snapshot.ringStartedAtMs <= 0) {
    // Unknown age — treat as expired so we never reopen a stale ring UI.
    return true;
  }
  const limitMs =
    snapshot.mode === 'incoming' ? incomingTimeoutMs : outgoingTimeoutMs;
  return nowMs - snapshot.ringStartedAtMs > limitMs;
}
