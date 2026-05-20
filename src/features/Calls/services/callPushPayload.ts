import type { CallIncomingPayload } from '../types/callApi.types';

function readString(data: Record<string, string | undefined>, key: string): string | undefined {
  const value = data[key];
  if (value == null || value.length === 0) {
    return undefined;
  }
  return value;
}

function readNumber(data: Record<string, string | undefined>, key: string): number | undefined {
  const raw = readString(data, key);
  if (raw == null) {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Parse FCM `data` payload into socket-compatible incoming call shape. */
export function parseIncomingCallPushData(
  data: Record<string, string | undefined> | undefined,
): CallIncomingPayload | null {
  if (data == null) {
    return null;
  }
  const type = readString(data, 'type');
  if (type !== 'call.incoming') {
    return null;
  }

  const sessionId = readNumber(data, 'sessionId');
  const callerUserId = readNumber(data, 'callerUserId');
  const calleeUserId = readNumber(data, 'calleeUserId');
  if (sessionId == null || callerUserId == null || calleeUserId == null) {
    return null;
  }

  const callerRoleRaw = readString(data, 'callerRole');
  const callerRole = callerRoleRaw === 'consultant' ? 'consultant' : 'user';
  const calleeRoleRaw = readString(data, 'calleeRole');
  const calleeRole = calleeRoleRaw === 'consultant' ? 'consultant' : 'user';

  return {
    sessionId,
    callType: readString(data, 'callType') ?? 'voice',
    status: readString(data, 'status') ?? 'initiated',
    callerUserId,
    callerRole,
    calleeUserId,
    calleeRole,
    callerName: readString(data, 'callerName') ?? null,
    callerThumbnail: readString(data, 'callerThumbnail') ?? null,
    eventId: readString(data, 'eventId'),
    eventVersion: readNumber(data, 'eventVersion'),
    timestamp: readNumber(data, 'timestamp'),
  };
}
