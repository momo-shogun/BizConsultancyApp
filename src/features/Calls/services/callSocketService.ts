import { AppState, type AppStateStatus } from 'react-native';
import { io, type Socket } from 'socket.io-client';

import { CALL_SOCKET_PATH, PRESENCE_PING_INTERVAL_MS, SOCKET_BASE_URL } from '@/constants/calls';

import { CALL_SOCKET_EVENTS } from '../constants/callSocketEvents';
import type {
  CallAcceptedPayload,
  CallEndedPayload,
  CallIncomingPayload,
  CallMutePayload,
} from '../types/callApi.types';

export type DeviceState = 'foreground' | 'background';

type SocketHandlers = {
  onIncoming?: (payload: CallIncomingPayload) => void;
  onAccepted?: (payload: CallAcceptedPayload) => void;
  onDeclined?: (payload: CallEndedPayload) => void;
  onEnded?: (payload: CallEndedPayload) => void;
  onMute?: (payload: CallMutePayload) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onPresencePong?: (payload: { serverTime: number; lastRttMs?: number }) => void;
};

let socket: Socket | null = null;
let pingTimer: ReturnType<typeof setInterval> | null = null;
let handlers: SocketHandlers = {};
let activeCallId: number | null = null;

function deviceStateFromAppState(state: AppStateStatus): DeviceState {
  return state === 'active' ? 'foreground' : 'background';
}

function startPing(): void {
  stopPing();
  pingTimer = setInterval(() => {
    if (socket?.connected !== true) {
      return;
    }
    socket.emit(CALL_SOCKET_EVENTS.PRESENCE_PING, {
      deviceState: deviceStateFromAppState(AppState.currentState),
      activeCallId,
    });
  }, PRESENCE_PING_INTERVAL_MS);
}

function stopPing(): void {
  if (pingTimer != null) {
    clearInterval(pingTimer);
    pingTimer = null;
  }
}

export const callSocketService = {
  connect(token: string, nextHandlers: SocketHandlers): void {
    handlers = nextHandlers;
    if (socket?.connected === true) {
      return;
    }
    if (socket != null) {
      socket.removeAllListeners();
      socket.disconnect();
    }

    socket = io(SOCKET_BASE_URL, {
      path: CALL_SOCKET_PATH,
      transports: ['websocket', 'polling'],
      auth: { token },
      autoConnect: true,
    });

    socket.on('connect', () => {
      handlers.onConnected?.();
      startPing();
    });

    socket.on('disconnect', () => {
      stopPing();
      handlers.onDisconnected?.();
    });

    socket.on(CALL_SOCKET_EVENTS.INCOMING, (payload: CallIncomingPayload) => {
      handlers.onIncoming?.(payload);
    });

    socket.on(CALL_SOCKET_EVENTS.ACCEPTED, (payload: CallAcceptedPayload) => {
      handlers.onAccepted?.(payload);
    });

    socket.on(CALL_SOCKET_EVENTS.DECLINED, (payload: CallEndedPayload) => {
      handlers.onDeclined?.(payload);
    });

    socket.on(CALL_SOCKET_EVENTS.ENDED, (payload: CallEndedPayload) => {
      handlers.onEnded?.(payload);
    });

    socket.on(CALL_SOCKET_EVENTS.MUTE, (payload: CallMutePayload) => {
      handlers.onMute?.(payload);
    });

    socket.on(
      CALL_SOCKET_EVENTS.PRESENCE_PONG,
      (payload: { serverTime: number; lastRttMs?: number }) => {
        handlers.onPresencePong?.(payload);
      },
    );
  },

  disconnect(): void {
    stopPing();
    handlers = {};
    activeCallId = null;
    if (socket != null) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }
  },

  setActiveCallId(sessionId: number | null): void {
    activeCallId = sessionId;
  },

  emitMute(sessionId: number, muted: boolean): void {
    socket?.emit(CALL_SOCKET_EVENTS.MUTE, {
      sessionId,
      kind: 'audio',
      muted,
    });
  },

  isConnected(): boolean {
    return socket?.connected === true;
  },
};
