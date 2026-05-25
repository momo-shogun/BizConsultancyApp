import type {
  WalletTransaction,
  WalletTransactionSection,
} from '../types/wallet.types';

export const WALLET_TOPUP_MIN_AMOUNT = 100;
export const WALLET_TOPUP_MAX_AMOUNT = 100_000;

export type WalletTransactionVisualKind = 'topup' | 'payment' | 'credit' | 'debit';

export interface WalletTransactionVisual {
  kind: WalletTransactionVisualKind;
  iconName: string;
  accent: string;
  accentSoft: string;
  label: string;
}

export function formatWalletTransactionDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }
  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isWalletTopupDetail(detail: string | null): boolean {
  if (detail == null || detail.trim().length === 0) {
    return false;
  }
  const normalized = detail.toLowerCase();
  return (
    normalized.includes('top') ||
    normalized.includes('topup') ||
    normalized.includes('add')
  );
}

export function parseTopupAmountInput(raw: string): number | null {
  const trimmed = raw.replace(/,/g, '').trim();
  if (trimmed.length === 0) {
    return null;
  }
  const amount = Number(trimmed);
  if (!Number.isFinite(amount)) {
    return null;
  }
  return Math.round(amount);
}

export function validateTopupAmount(amount: number | null): string | null {
  if (amount == null) {
    return 'Enter an amount';
  }
  if (amount < WALLET_TOPUP_MIN_AMOUNT) {
    return `Minimum amount is ₹${WALLET_TOPUP_MIN_AMOUNT}`;
  }
  if (amount > WALLET_TOPUP_MAX_AMOUNT) {
    return `Maximum amount is ₹${WALLET_TOPUP_MAX_AMOUNT.toLocaleString('en-IN')}`;
  }
  return null;
}

export function formatWalletTransactionAmount(amount: number, isCredit: boolean): string {
  const formatted = amount.toLocaleString('en-IN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${isCredit ? '+' : '−'} ₹${formatted}`;
}

export function formatWalletTransactionTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed.toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function getTransactionSectionTitle(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return 'Earlier';
  }

  const today = startOfDay(new Date());
  const target = startOfDay(parsed);
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86_400_000);

  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getTransactionVisual(item: WalletTransaction): WalletTransactionVisual {
  const isCredit = item.transactionType.toLowerCase() === 'credit';
  const isTopup = isWalletTopupDetail(item.transactionDetail);

  if (isTopup) {
    return {
      kind: 'topup',
      iconName: 'arrow-down-circle-outline',
      accent: '#059669',
      accentSoft: '#ECFDF5',
      label: 'Top-up',
    };
  }

  if (!isCredit) {
    return {
      kind: 'payment',
      iconName: 'arrow-up-circle-outline',
      accent: '#DC2626',
      accentSoft: '#FEF2F2',
      label: 'Payment',
    };
  }

  return {
    kind: 'credit',
    iconName: 'checkmark-circle-outline',
    accent: '#2563EB',
    accentSoft: '#EFF6FF',
    label: 'Credit',
  };
}

export function getTransactionTitle(item: WalletTransaction): string {
  const detail = item.transactionDetail?.trim();
  if (detail != null && detail.length > 0) {
    return detail;
  }
  return item.transactionType.toLowerCase() === 'credit' ? 'Wallet credit' : 'Wallet debit';
}

export function shortenOrderId(orderId: string | null): string | null {
  if (orderId == null || orderId.trim().length === 0) {
    return null;
  }
  const trimmed = orderId.trim();
  if (trimmed.length <= 14) {
    return trimmed;
  }
  return `${trimmed.slice(0, 6)}…${trimmed.slice(-4)}`;
}

export function groupWalletTransactionsByDate(
  items: WalletTransaction[],
): WalletTransactionSection[] {
  const sorted = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const sections: WalletTransactionSection[] = [];
  let currentTitle: string | null = null;

  for (const item of sorted) {
    const title = getTransactionSectionTitle(item.createdAt);
    if (title !== currentTitle) {
      sections.push({ title, data: [] });
      currentTitle = title;
    }
    sections[sections.length - 1]?.data.push(item);
  }

  return sections;
}
