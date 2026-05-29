import type {
  AiCreditPackage,
  AiCreditPurchaseResult,
  AiCreditRazorpayOrder,
  AiUsageSummary,
} from '../types/aiCredits.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function parseAiCreditPackage(raw: unknown): AiCreditPackage | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = parseNumber(raw.id);
  const price = parseNumber(raw.price);
  const credits = parseNumber(raw.credits);
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (id == null || price == null || credits == null || name.length === 0) {
    return null;
  }
  return { id, name, price, credits };
}

export function parseAiCreditPackagesResponse(raw: unknown): AiCreditPackage[] {
  const rows = Array.isArray(raw) ? raw : [];
  const packages: AiCreditPackage[] = [];
  for (const row of rows) {
    const parsed = parseAiCreditPackage(row);
    if (parsed != null) {
      packages.push(parsed);
    }
  }
  return packages;
}

export function parseAiUsageSummary(raw: unknown): AiUsageSummary | null {
  if (!isRecord(raw)) {
    return null;
  }
  const remainingCredits = parseNumber(raw.remainingCredits);
  if (remainingCredits == null) {
    return null;
  }
  return {
    remainingCredits,
    freeQuestionsUsed: parseNumber(raw.freeQuestionsUsed) ?? undefined,
    creditsUsed: parseNumber(raw.creditsUsed) ?? undefined,
  };
}

export function parseAiCreditRazorpayOrder(raw: unknown): AiCreditRazorpayOrder | null {
  if (!isRecord(raw)) {
    return null;
  }
  const key = typeof raw.key === 'string' ? raw.key : '';
  const orderId =
    typeof raw.orderId === 'string'
      ? raw.orderId
      : typeof raw.order_id === 'string'
        ? raw.order_id
        : '';
  const amount = parseNumber(raw.amount);
  const currency = typeof raw.currency === 'string' ? raw.currency : 'INR';
  if (key.length === 0 || orderId.length === 0 || amount == null) {
    return null;
  }
  return { key, orderId, amount, currency };
}

export function parseAiCreditPurchaseResult(raw: unknown): AiCreditPurchaseResult | null {
  if (!isRecord(raw)) {
    return null;
  }
  const remainingCredits = parseNumber(raw.remainingCredits);
  if (remainingCredits == null) {
    return null;
  }
  const addedCredits = parseNumber(raw.addedCredits);
  return {
    remainingCredits,
    ...(addedCredits != null ? { addedCredits } : {}),
  };
}

export function parseApiErrorMessage(error: unknown, fallback: string): string {
  if (isRecord(error) && 'data' in error) {
    const data = error.data;
    if (isRecord(data) && typeof data.message === 'string' && data.message.trim().length > 0) {
      return data.message.trim();
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim();
  }
  return fallback;
}
