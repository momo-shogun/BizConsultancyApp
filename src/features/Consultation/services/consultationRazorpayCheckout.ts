import RazorpayCheckout from 'react-native-razorpay';

import type {
  RazorpayCheckoutSuccess,
  RazorpayOrderResponse,
} from '../types/consultantBooking.types';

export class ConsultationPaymentCancelledError extends Error {
  constructor() {
    super('Payment cancelled');
    this.name = 'ConsultationPaymentCancelledError';
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

export interface OpenConsultationRazorpayParams {
  order: RazorpayOrderResponse;
  consultantName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export function openConsultationRazorpayCheckout(
  params: OpenConsultationRazorpayParams,
): Promise<RazorpayCheckoutSuccess> {
  const { order, consultantName, customerName, customerEmail, customerPhone } = params;

  const options = {
    key: order.keyId,
    amount: String(order.amount),
    currency: order.currency,
    order_id: order.orderId,
    name: 'Biz Consultancy',
    description: `Consultation with ${consultantName}`,
    prefill: {
      name: customerName.trim(),
      email: customerEmail.trim(),
      contact: formatRazorpayContact(customerPhone),
    },
    theme: { color: '#0B3B66' },
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
        throw new ConsultationPaymentCancelledError();
      }
      throw error;
    });
}
