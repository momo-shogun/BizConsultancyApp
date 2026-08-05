import { API_ORIGIN } from './api';

/** Socket.IO origin (no `/api` suffix). */
export const SOCKET_BASE_URL = API_ORIGIN;

export const CALL_SOCKET_PATH = '/socket.io';

/** Optional: set in env / build config when not using server-returned appId. */
export const AGORA_APP_ID_FALLBACK = '';

/** Client heartbeat interval (ms). */
export const PRESENCE_PING_INTERVAL_MS = 10_000;

/** In-call state sync interval (ms). Keep short so peer hang-up ends UI if socket misses. */
export const CALL_STATE_SYNC_INTERVAL_MS = 3_000;

/**
 * Outgoing ring timeout before auto-end (ms).
 * Runs only while callee is still ringing; cancelled on any answered signal.
 */
export const OUTGOING_RING_TIMEOUT_MS = 30_000;

/** HTTP status poll while caller is RINGING (socket miss fallback). */
export const OUTGOING_RING_STATUS_POLL_MS = 2_500;

/**
 * If the caller backgrounds / leaves the app while still ringing, cancel after this delay
 * so the callee does not keep ringing (and cannot answer) a dead outbound call.
 */
export const OUTGOING_RING_BACKGROUND_CANCEL_MS = 3_000;

/**
 * Callee ring timeout before the incoming UI closes itself (ms).
 * Deliberately longer than the caller's timeout: the caller ends the session first and the
 * callee normally learns via socket/poll. This only fires when neither signal lands, and the
 * extra headroom covers push delivery delay (the callee starts ringing after the caller).
 */
export const INCOMING_RING_TIMEOUT_MS = 40_000;

/** HTTP status poll while callee is RINGING (socket miss fallback). */
export const INCOMING_RING_STATUS_POLL_MS = 2_500;

/** Wait for peer Agora rejoin before treating remote leave as hang-up (ms). */
export const REMOTE_REJOIN_GRACE_MS = 12_000;
