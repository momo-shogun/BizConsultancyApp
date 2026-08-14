import type { CallHistoryItem, CallStatus } from '@/features/Calls/types/callApi.types';
import { resolveCallPartyImageUrl } from '@/features/Calls/utils/callPartyMedia';

const MISSED_STATUSES: CallStatus[] = ['declined', 'missed', 'failed'];

export interface CallsTabRowModel {
  key: string;
  item: CallHistoryItem;
  count: number;
  displayName: string;
  avatarUri: string | null;
  otherUserId: number;
  mediumLabel: string;
  timeLabel: string;
  isMissed: boolean;
  isOutgoing: boolean;
  canCallBack: boolean;
}

type OtherPartySide = 'caller' | 'callee';

function isValidUserId(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value) && value > 0;
}

/**
 * Prefer the party that is not the logged-in user so a bad `direction`
 * cannot treat the current user as the person to call back.
 */
export function resolveOtherPartySide(
  item: CallHistoryItem,
  currentUserId?: number | null,
): OtherPartySide {
  if (isValidUserId(currentUserId)) {
    const isCaller = item.callerUserId === currentUserId;
    const isCallee = item.calleeUserId === currentUserId;
    if (isCaller && !isCallee) {
      return 'callee';
    }
    if (isCallee && !isCaller) {
      return 'caller';
    }
  }
  return item.direction === 'outgoing' ? 'callee' : 'caller';
}

function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function getOtherPartyName(
  item: CallHistoryItem,
  currentUserId?: number | null,
): string {
  if (resolveOtherPartySide(item, currentUserId) === 'callee') {
    const name = item.calleeName?.trim();
    if (name != null && name.length > 0) {
      return name;
    }
    return item.calleeRole === 'consultant' ? 'Consultant' : 'Contact';
  }

  const name = item.callerName?.trim();
  if (name != null && name.length > 0) {
    return name;
  }
  return item.callerRole === 'consultant' ? 'Consultant' : 'Contact';
}

export function getOtherPartyUserId(
  item: CallHistoryItem,
  currentUserId?: number | null,
): number {
  return resolveOtherPartySide(item, currentUserId) === 'callee'
    ? item.calleeUserId
    : item.callerUserId;
}

export function getOtherPartyThumbnail(
  item: CallHistoryItem,
  currentUserId?: number | null,
): string | null {
  if (resolveOtherPartySide(item, currentUserId) === 'callee') {
    const thumb = item.calleeThumbnail?.trim();
    return thumb != null && thumb.length > 0 ? thumb : null;
  }
  const thumb = item.callerThumbnail?.trim();
  return thumb != null && thumb.length > 0 ? thumb : null;
}

export function isMissedCall(item: CallHistoryItem): boolean {
  return MISSED_STATUSES.includes(item.status);
}

export function formatCallsTabTime(value?: string | null): string {
  if (value == null || value.length === 0) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const now = new Date();
  const dayDiff = Math.round((startOfLocalDay(now) - startOfLocalDay(parsed)) / 86_400_000);

  if (dayDiff === 0) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(parsed);
  }

  if (dayDiff === 1) {
    return 'Yesterday';
  }

  if (dayDiff > 1 && dayDiff < 7) {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(parsed);
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  }).format(parsed);
}

function mediumBaseLabel(item: CallHistoryItem): string {
  return item.callType === 'video' ? 'Video' : 'Voice';
}

export function buildCallsTabRows(
  items: CallHistoryItem[],
  currentUserId?: number | null,
): CallsTabRowModel[] {
  const rows: CallsTabRowModel[] = [];

  for (const item of items) {
    const otherUserId = getOtherPartyUserId(item, currentUserId);
    const groupKey = `${otherUserId}-${item.callType}-${item.direction}`;
    const last = rows[rows.length - 1];

    if (last != null && last.key === groupKey) {
      last.count += 1;
      continue;
    }

    const row: CallsTabRowModel = {
      key: groupKey,
      item,
      count: 1,
      displayName: getOtherPartyName(item, currentUserId),
      avatarUri: resolveCallPartyImageUrl(getOtherPartyThumbnail(item, currentUserId)),
      otherUserId,
      mediumLabel: mediumBaseLabel(item),
      timeLabel: formatCallsTabTime(item.startedAt ?? item.connectedAt ?? item.endedAt),
      isMissed: isMissedCall(item),
      isOutgoing: item.direction === 'outgoing',
      canCallBack: isValidUserId(otherUserId) && otherUserId !== currentUserId,
    };
    rows.push(row);
  }

  return rows.map((row, index) => ({
    ...row,
    key: `${row.key}-${row.item.id}-${index}`,
    mediumLabel: row.count > 1 ? `${row.mediumLabel} (${row.count})` : row.mediumLabel,
  }));
}
