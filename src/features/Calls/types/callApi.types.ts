/** Mirrors web BizConsultancy/lib/api.ts call types. */

export type CallType = 'voice' | 'video';
export type CallRole = 'consultant' | 'user';
export type CallStatus =
  | 'initiated'
  | 'ringing'
  | 'connected'
  | 'declined'
  | 'missed'
  | 'ended'
  | 'failed';

export interface InitiateCallPayload {
  calleeUserId: number;
  callType: CallType;
}

export interface InitiateCallResponse {
  sessionId: number;
  channelName: string;
  callType: CallType;
  status: CallStatus;
  appId: string;
  uid: number;
  rtcToken: string;
  callerRole: CallRole;
  calleeRole: CallRole;
}

export interface AcceptCallResponse {
  sessionId: number;
  channelName: string;
  callType: CallType;
  status: CallStatus;
  appId: string;
  uid: number;
  rtcToken: string;
}

export interface CallSessionStatusResponse {
  sessionId: number;
  status: CallStatus;
  callType: CallType;
  channelName: string;
  callerUserId: number;
  callerRole: CallRole;
  calleeUserId: number;
  calleeRole: CallRole;
  durationSeconds: number;
  endReason: string | null;
  connectedAt: string | null;
  endedAt: string | null;
}

export interface CallSyncResponse extends CallSessionStatusResponse {
  lastEventVersion: number;
  missedEvents: CallEventEnvelope[];
  serverTime: number;
}

export interface EndCallPayload {
  endReason?:
    | 'ended_by_user'
    | 'ended_by_consultant'
    | 'caller_cancelled'
    | 'missed_timeout'
    | 'network_drop'
    | 'declined';
}

export interface CallEventEnvelope<T = Record<string, unknown>> {
  eventId?: string;
  sessionId: number;
  eventVersion?: number;
  timestamp?: number;
  type?: string;
  payload?: T;
}

export interface CallIncomingPayload {
  sessionId: number;
  callType: string;
  status: string;
  callerUserId: number;
  callerRole: CallRole;
  calleeUserId: number;
  calleeRole: CallRole;
  callerName?: string | null;
  callerThumbnail?: string | null;
  eventId?: string;
  eventVersion?: number;
  timestamp?: number;
}

export interface CallAcceptedPayload {
  sessionId: number;
  status: string;
  eventId?: string;
  eventVersion?: number;
}

export interface CallEndedPayload {
  sessionId: number;
  status: string;
  durationSeconds?: number;
  endReason?: string | null;
  endedAt?: string | null;
  eventId?: string;
  eventVersion?: number;
}

export interface CallMutePayload {
  sessionId: number;
  fromUserId: number;
  kind: 'audio';
  muted: boolean;
}

export interface PersistedCallCredentials {
  sessionId: number;
  channelName: string;
  callType: CallType;
  appId: string;
  uid: number;
  rtcToken: string;
  mode: 'outgoing' | 'incoming';
}

export interface CallHistoryItem {
  id: number;
  callType: CallType;
  status: CallStatus;
  durationSeconds: number;
  startedAt: string | null;
  connectedAt: string | null;
  endedAt: string | null;
  endReason: string | null;
  channelName: string;
  direction: 'incoming' | 'outgoing';
  callerUserId: number;
  callerRole: CallRole;
  callerName?: string | null;
  calleeUserId: number;
  calleeRole: CallRole;
  calleeName?: string | null;
  consultantId?: number | null;
  consultantBookingId?: number | null;
  reviewedByMe?: boolean;
  canReview?: boolean;
}

export interface CallHistoryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CallHistoryResponse {
  data: CallHistoryItem[];
  meta: CallHistoryMeta;
}

export interface CallHistoryQueryParams {
  page?: number;
  limit?: number;
  sessionId?: number;
}
