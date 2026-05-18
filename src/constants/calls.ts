import { API_ORIGIN } from './api';

/** Socket.IO origin (no `/api` suffix). */
export const SOCKET_BASE_URL = API_ORIGIN;

export const CALL_SOCKET_PATH = '/socket.io';

/** Optional: set in env / build config when not using server-returned appId. */
export const AGORA_APP_ID_FALLBACK = '';

/** Client heartbeat interval (ms). */
export const PRESENCE_PING_INTERVAL_MS = 10_000;

/** In-call state sync interval (ms). */
export const CALL_STATE_SYNC_INTERVAL_MS = 20_000;

/** Outgoing ring timeout before auto-end (ms). */
export const OUTGOING_RING_TIMEOUT_MS = 30_000;
