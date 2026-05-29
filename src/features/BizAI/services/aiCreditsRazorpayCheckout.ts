import RazorpayCheckout from 'react-native-razorpay';

import type { AiCreditRazorpayOrder } from '../types/aiCredits.types';

export class AiCreditsPaymentCancelledError extends Error {
  constructor() {
    super('Payment cancelled');
    this.name = 'AiCreditsPaymentCancelledError';
  }
}

function formatRazorpayContact(phone: string): string {
  const trimmed = phone.trim();
  if (/^\d{10}$/.test(trimmed)) {
    return `+91${trimmed}`;
  }
  return trimmed;
}

function isPaymentCancelledError(error: unknown): boolean {
  if (error == null || typeof error !== 'object') {
    return false;
  }
  const code = 'code' in error ? (error as { code?: unknown }).code : undefined;
  if (code === 0 || code === 'PAYMENT_CANCELLED') {
    return true;
  }
  const description =
    'description' in error ? (error as { description?: unknown }).description : undefined;
  return typeof description === 'string' && description.toLowerCase().includes('cancel');
}

export interface OpenAiCreditsRazorpayParams {
  order: AiCreditRazorpayOrder;
  packageCredits: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface AiCreditsRazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export function openAiCreditsRazorpayCheckout(
  params: OpenAiCreditsRazorpayParams,
): Promise<AiCreditsRazorpaySuccess> {
  const options = {
    key: params.order.key,
    amount: String(params.order.amount),
    currency: params.order.currency,
    order_id: params.order.orderId,
    name: 'Biz Consultancy',
    description: `Biz AI credits (${params.packageCredits})`,
    prefill: {
      name: params.customerName.trim(),
      email: params.customerEmail.trim(),
      contact: formatRazorpayContact(params.customerPhone),
    },
    theme: { color: '#059669' },
  };

  return RazorpayCheckout.open(options)
    .then((data: unknown) => {
      if (data == null || typeof data !== 'object') {
        throw new Error('Invalid Razorpay response');
      }
      const paymentId =
        'razorpay_payment_id' in data
          ? (data as { razorpay_payment_id?: unknown }).razorpay_payment_id
          : undefined;
      const orderId =
        'razorpay_order_id' in data
          ? (data as { razorpay_order_id?: unknown }).razorpay_order_id
          : undefined;
      const signature =
        'razorpay_signature' in data
          ? (data as { razorpay_signature?: unknown }).razorpay_signature
          : undefined;
      if (
        typeof paymentId !== 'string' ||
        typeof orderId !== 'string' ||
        typeof signature !== 'string'
      ) {
        throw new Error('Payment response incomplete');
      }
      return {
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature,
      };
    })
    .catch((error: unknown) => {
      if (isPaymentCancelledError(error)) {
        throw new AiCreditsPaymentCancelledError();
      }
      throw error;
    });
}
