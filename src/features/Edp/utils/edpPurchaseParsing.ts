import type {
  CreateEdpPurchaseResult,
  EdpPurchaseMe,
  EdpPurchaseRecord,
} from '../types/edpPurchase.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parsePurchaseRecord(raw: unknown): EdpPurchaseRecord | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : null;
  if (id == null) {
    return null;
  }
  return {
    id,
    amount: typeof raw.amount === 'number' ? raw.amount : Number(raw.amount ?? 0),
    joiningDate: typeof raw.joiningDate === 'string' ? raw.joiningDate : null,
    expiryDate: typeof raw.expiryDate === 'string' ? raw.expiryDate : null,
    gatewayType: typeof raw.gatewayType === 'string' ? raw.gatewayType : '',
    apptype: typeof raw.apptype === 'string' ? raw.apptype : '',
  };
}

export function parseEdpPurchaseMe(raw: unknown): EdpPurchaseMe {
  if (!isRecord(raw)) {
    return { hasActiveEnrollment: false, purchase: null };
  }
  return {
    hasActiveEnrollment: raw.hasActiveEnrollment === true,
    purchase: parsePurchaseRecord(raw.purchase),
    isConsultant: raw.isConsultant === true,
  };
}

export function parseCreateEdpPurchaseResponse(raw: unknown): CreateEdpPurchaseResult {
  if (!isRecord(raw)) {
    throw new Error('Invalid EDP purchase response');
  }

  const paymentStatus =
    typeof raw.paymentStatus === 'string' ? raw.paymentStatus : '';

  const razorpayOrderId =
    typeof raw.razorpayOrderId === 'string'
      ? raw.razorpayOrderId
      : typeof raw.razorpay_order_id === 'string'
        ? raw.razorpay_order_id
        : null;

  const razorpayKeyId =
    typeof raw.razorpayKeyId === 'string'
      ? raw.razorpayKeyId
      : typeof raw.razorpay_key_id === 'string'
        ? raw.razorpay_key_id
        : null;

  const amountRaw = raw.amount;
  const amountPaise =
    typeof amountRaw === 'number' && Number.isFinite(amountRaw) ? amountRaw : null;

  return {
    paymentStatus,
    razorpayOrderId,
    razorpayKeyId,
    amountPaise,
  };
}

export function formatEdpDate(value: string | null | undefined): string {
  if (value == null || value.length === 0) {
    return '—';
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
