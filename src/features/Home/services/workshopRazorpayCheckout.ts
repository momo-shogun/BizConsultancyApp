import RazorpayCheckout from 'react-native-razorpay';

export class WorkshopPaymentCancelledError extends Error {
  constructor() {
    super('Payment cancelled');
    this.name = 'WorkshopPaymentCancelledError';
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

export interface OpenWorkshopRazorpayParams {
  keyId: string;
  orderId: string;
  amountPaise: number;
  workshopName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface WorkshopRazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
}

export function openWorkshopRazorpayCheckout(
  params: OpenWorkshopRazorpayParams,
): Promise<WorkshopRazorpaySuccess> {
  const options = {
    key: params.keyId,
    amount: String(params.amountPaise),
    currency: 'INR',
    order_id: params.orderId,
    name: 'Biz Consultancy',
    description: params.workshopName,
    prefill: {
      name: params.customerName.trim(),
      email: params.customerEmail.trim(),
      contact: formatRazorpayContact(params.customerPhone),
    },
    theme: { color: '#0F5132' },
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
      if (typeof paymentId !== 'string' || typeof orderId !== 'string') {
        throw new Error('Payment response incomplete');
      }
      return { razorpay_payment_id: paymentId, razorpay_order_id: orderId };
    })
    .catch((error: unknown) => {
      if (isPaymentCancelledError(error)) {
        throw new WorkshopPaymentCancelledError();
      }
      throw error;
    });
}
