/**
 * Must match `MainApplication.INCOMING_CALLS_CHANNEL_ID`.
 * Bumped when channel behavior must change (Android channels are immutable after first create).
 */
export const INCOMING_CALLS_CHANNEL_ID = 'incoming_calls_v2';

/** Low-importance channel for the ongoing-call foreground service (keeps mic alive in background). */
export const ONGOING_CALL_CHANNEL_ID = 'ongoing_call_v1';
