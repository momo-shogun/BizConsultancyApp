import type { CallHistoryItem, CallStatus } from '@/features/Calls/types/callApi.types';

export type CallCardTone = 'declined' | 'ended';

export interface CallHistoryCardModel {
  sessionId: number;
  displayId: string;
  type: string;
  consultant: string;
  time: string;
  duration: string;
  tone: CallCardTone;
  statusLabel: string;
  canReview: boolean;
}

export function formatCallDate(value?: string | null): string {
  if (value == null || value.length === 0) {
    return 'Unknown time';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown time';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsedDate);
}

export function formatCallDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '00:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function getCallCardTone(status: CallStatus): CallCardTone {
  if (status === 'declined' || status === 'missed' || status === 'failed') {
    return 'declined';
  }

  return 'ended';
}

export function getCallTypeLabel(item: CallHistoryItem): string {
  const direction = item.direction;
  const isVideo = item.callType === 'video';

  if (direction === 'outgoing') {
    return isVideo ? 'Outgoing video' : 'Outgoing call';
  }

  if (direction === 'incoming') {
    return isVideo ? 'Incoming video' : 'Incoming call';
  }

  return isVideo ? 'Video call' : 'Call';
}

export function getConsultantName(item: CallHistoryItem): string {
  if (item.callerRole === 'consultant') {
    return item.callerName?.trim() || 'Consultant';
  }

  if (item.calleeRole === 'consultant') {
    return item.calleeName?.trim() || 'Consultant';
  }

  return item.calleeName?.trim() || item.callerName?.trim() || 'Consultant';
}

export function mapCallHistoryItem(item: CallHistoryItem): CallHistoryCardModel {
  const tone = getCallCardTone(item.status);

  return {
    sessionId: item.id,
    displayId: `#${item.id}`,
    type: getCallTypeLabel(item),
    consultant: getConsultantName(item),
    time: formatCallDate(item.startedAt),
    duration: formatCallDuration(item.durationSeconds),
    tone,
    statusLabel: item.status,
    canReview: item.canReview === true && item.reviewedByMe !== true,
  };
}
