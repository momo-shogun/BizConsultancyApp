/**
 * UI/engine phases mapped onto the shared lifecycle
 * (see callLifecycle.ts):
 *
 *   idle                 → IDLE
 *   outgoing_initiating  → INITIATE
 *   connecting_media     → JOIN_AGORA (callee accept path; brief)
 *   outgoing_ringing     → RINGING (caller already in Agora, waiting for answer)
 *   incoming_ringing     → RINGING (callee)
 *   in_call              → ANSWERED / CONNECTED
 *   reconnecting         → CONNECTED (recovering)
 *   ending / ended       → ENDED
 */
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
  | 'PEER_ANSWERED'
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
  /**
   * Caller is (or will be) in Agora while still RINGING.
   * AGORA_JOINED alone must NOT move to in_call — wait for an answered signal.
   */
  outgoing_ringing: {
    ACCEPT_OK: 'in_call',
    PEER_ANSWERED: 'in_call',
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
    ACCEPT_OK: 'in_call',
    PEER_ANSWERED: 'in_call',
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
