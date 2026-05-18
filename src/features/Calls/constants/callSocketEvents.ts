/** Must match api call-realtime.constants.ts */
export const CALL_SOCKET_EVENTS = {
  INCOMING: 'call.incoming',
  DECLINED: 'call.declined',
  ENDED: 'call.ended',
  ACCEPTED: 'call.accepted',
  MUTE: 'call.mute',
  PRESENCE_PING: 'presence.ping',
  PRESENCE_PONG: 'presence.pong',
} as const;
