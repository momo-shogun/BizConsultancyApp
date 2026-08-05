/**
 * Must match `MainApplication.INCOMING_CALLS_CHANNEL_ID`.
 * Bumped when channel behavior must change (Android channels are immutable after first create).
 */
export const INCOMING_CALLS_CHANNEL_ID = 'incoming_calls_v2';

/** Default→HIGH bump needs a new channel id (Android channels are immutable after create). */
export const ONGOING_CALL_CHANNEL_ID = 'ongoing_call_v3';
