export type CallPhase =
  | 'idle'
  | 'outgoing_initiating'
  | 'outgoing_ringing'
  | 'incoming_ringing'
  | 'connecting_media'
  | 'in_call'
  | 'reconnecting'
  | 'ending'
  | 'ended';

export type CallEvent =
  | 'INITIATE_OK'
  | 'INCOMING'
  | 'ACCEPT_OK'
  | 'DECLINED'
  | 'ENDED'
  | 'AGORA_JOINED'
  | 'AGORA_LOST'
  | 'REJOIN_OK'
  | 'TIMEOUT'
  | 'RESET';

const transitions: Record<CallPhase, Partial<Record<CallEvent, CallPhase>>> = {
  idle: {
    INITIATE_OK: 'outgoing_ringing',
    INCOMING: 'incoming_ringing',
  },
  outgoing_initiating: {
    INITIATE_OK: 'outgoing_ringing',
    ENDED: 'ended',
    RESET: 'idle',
  },
  outgoing_ringing: {
    ACCEPT_OK: 'connecting_media',
    AGORA_JOINED: 'in_call',
    DECLINED: 'ended',
    ENDED: 'ended',
    TIMEOUT: 'ended',
    RESET: 'idle',
  },
  incoming_ringing: {
    ACCEPT_OK: 'connecting_media',
    DECLINED: 'ended',
    ENDED: 'ended',
    RESET: 'idle',
  },
  connecting_media: {
    AGORA_JOINED: 'in_call',
    AGORA_LOST: 'reconnecting',
    ENDED: 'ended',
    RESET: 'idle',
  },
  in_call: {
    AGORA_LOST: 'reconnecting',
    REJOIN_OK: 'in_call',
    ENDED: 'ended',
    RESET: 'idle',
  },
  reconnecting: {
    REJOIN_OK: 'in_call',
    AGORA_JOINED: 'in_call',
    ENDED: 'ended',
    RESET: 'idle',
  },
  ending: {
    ENDED: 'ended',
    RESET: 'idle',
  },
  ended: {
    RESET: 'idle',
  },
};

export function transitionCallPhase(current: CallPhase, event: CallEvent): CallPhase {
  const next = transitions[current][event];
  return next ?? current;
}
