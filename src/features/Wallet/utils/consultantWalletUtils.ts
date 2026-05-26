import type {
  ConsultantWalletTransactionItem,
  ConsultantWalletTransactionSection,
  WithdrawalStatus,
} from '../types/consultantWallet.types';

export function formatConsultantWalletAmount(amount: number): string {
  if (!Number.isFinite(amount)) {
    return '₹0.00';
  }
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatConsultantWalletDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function withdrawalStatusLabel(status: WithdrawalStatus): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'completed') {
    return 'Completed';
  }
  if (normalized === 'rejected') {
    return 'Rejected';
  }
  if (normalized === 'approved') {
    return 'Approved';
  }
  if (normalized === 'pending') {
    return 'Pending';
  }
  return status;
}

export function withdrawalStatusColors(status: WithdrawalStatus): {
  bg: string;
  text: string;
} {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'completed') {
    return { bg: 'rgba(16,185,129,0.12)', text: '#047857' };
  }
  if (normalized === 'rejected') {
    return { bg: 'rgba(239,68,68,0.12)', text: '#B91C1C' };
  }
  if (normalized === 'approved') {
    return { bg: 'rgba(59,130,246,0.12)', text: '#1D4ED8' };
  }
  return { bg: 'rgba(245,158,11,0.14)', text: '#B45309' };
}

export function formatConsultantTransactionAmount(
  amount: number,
  isCredit: boolean,
): string {
  const formatted = amount.toLocaleString('en-IN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${isCredit ? '+' : '−'} ₹${formatted}`;
}

function sectionTitleForDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - target.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  return target.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function groupConsultantTransactionsByDate(
  items: ConsultantWalletTransactionItem[],
): ConsultantWalletTransactionSection[] {
  const groups = new Map<string, ConsultantWalletTransactionItem[]>();

  for (const item of items) {
    const date = new Date(item.createdAt);
    const key = Number.isNaN(date.getTime())
      ? 'Other'
      : sectionTitleForDate(date);
    const bucket = groups.get(key) ?? [];
    bucket.push(item);
    groups.set(key, bucket);
  }

  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}

export function readWithdrawalApiError(error: unknown, fallback: string): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === 'string' && data.trim().length > 0) {
      return data;
    }
    if (data != null && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const message = record.message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
      if (Array.isArray(message) && message.length > 0) {
        const first = message[0];
        if (typeof first === 'string') {
          return first;
        }
      }
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallback;
}
