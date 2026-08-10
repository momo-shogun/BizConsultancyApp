import type { CallHistoryItem, CallStatus } from '@/features/Calls/types/callApi.types';

export type CallsTabFilter = 'all' | 'missed';

const MISSED_STATUSES: CallStatus[] = ['declined', 'missed', 'failed'];

export interface CallsTabRowModel {
  key: string;
  item: CallHistoryItem;
  count: number;
  displayName: string;
  otherUserId: number;
  mediumLabel: string;
  timeLabel: string;
  isMissed: boolean;
  isOutgoing: boolean;
}

function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function getOtherPartyName(item: CallHistoryItem): string {
  if (item.direction === 'outgoing') {
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

export function getOtherPartyUserId(item: CallHistoryItem): number {
  return item.direction === 'outgoing' ? item.calleeUserId : item.callerUserId;
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

export function matchesCallsTabFilter(item: CallHistoryItem, filter: CallsTabFilter): boolean {
  if (filter === 'all') {
    return true;
  }
  return isMissedCall(item);
}

export function buildCallsTabRows(
  items: CallHistoryItem[],
  filter: CallsTabFilter,
): CallsTabRowModel[] {
  const filtered = items.filter((item) => matchesCallsTabFilter(item, filter));
  const rows: CallsTabRowModel[] = [];

  for (const item of filtered) {
    const otherUserId = getOtherPartyUserId(item);
    const groupKey = `${otherUserId}-${item.callType}-${item.direction}`;
    const last = rows[rows.length - 1];

    if (last != null && last.key === groupKey) {
      last.count += 1;
      continue;
    }

    rows.push({
      key: groupKey,
      item,
      count: 1,
      displayName: getOtherPartyName(item),
      otherUserId,
      mediumLabel: mediumBaseLabel(item),
      timeLabel: formatCallsTabTime(item.startedAt ?? item.connectedAt ?? item.endedAt),
      isMissed: isMissedCall(item),
      isOutgoing: item.direction === 'outgoing',
    });
  }

  return rows.map((row, index) => ({
    ...row,
    key: `${row.key}-${row.item.id}-${index}`,
    mediumLabel: row.count > 1 ? `${row.mediumLabel} (${row.count})` : row.mediumLabel,
  }));
}

export function avatarGradientIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % 5;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  const letters = `${first}${last}`.toUpperCase();
  return letters.length > 0 ? letters : '?';
}
