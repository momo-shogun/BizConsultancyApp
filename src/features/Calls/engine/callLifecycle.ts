/**
 * Shared cross-platform call lifecycle.
 * Mobile and web must follow the same sequence; only UI chrome may differ.
 *
 * INITIATE → JOIN_AGORA → RINGING → ANSWERED → CONNECTED → ENDED
 *
 * Caller: join Agora immediately after initiate, stay RINGING until any
 * answered signal (call.accepted | remote user-joined/published | status=connected).
 * Callee: accept REST → JOIN_AGORA → CONNECTED.
 *
 * Signalling identity (Phase 4): parties are (role, id). Socket rooms:
 *   party:user:{id} | party:consultant:{id}
 * (legacy user:{id} dual-joined during migration).
 *
 * Keep in sync with: BizConsultancy/lib/calls/callLifecycle.ts
 */
export const CALL_LIFECYCLE = {
  IDLE: 'idle',
  INITIATE: 'initiate',
  JOIN_AGORA: 'join_agora',
  RINGING: 'ringing',
  ANSWERED: 'answered',
  CONNECTED: 'connected',
  ENDED: 'ended',
} as const;

export type CallLifecycleStage = (typeof CALL_LIFECYCLE)[keyof typeof CALL_LIFECYCLE];

/** How the caller learned the callee answered (any one is enough). */
export type CallAnsweredSignal =
  | 'call.accepted'
  | 'user-joined'
  | 'user-published'
  | 'status.connected';
