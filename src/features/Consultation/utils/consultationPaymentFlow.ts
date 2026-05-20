import {
  ConsultationPaymentCancelledError,
  openConsultationRazorpayCheckout,
} from '../services/consultationRazorpayCheckout';
import type {
  ConsultantBookingResponse,
  CreateConsultantBookingPayload,
  RazorpayOrderResponse,
  VerifyConsultantBookingPaymentPayload,
} from '../types/consultantBooking.types';
import type { ConsultationOnboardingFormState } from '../types/consultationOnboarding.types';

function bookingRequiresPayment(booking: ConsultantBookingResponse): boolean {
  if (booking.paymentStatus === 'paid') {
    return false;
  }
  const amount = booking.amount;
  if (amount != null && amount < 1) {
    return false;
  }
  return true;
}

export interface SubmitConsultationBookingParams {
  payload: CreateConsultantBookingPayload;
  form: ConsultationOnboardingFormState;
  consultantName: string;
  createBooking: (payload: CreateConsultantBookingPayload) => Promise<ConsultantBookingResponse>;
  createOrder: (bookingId: number) => Promise<RazorpayOrderResponse>;
  verifyPayment: (
    bookingId: number,
    body: VerifyConsultantBookingPaymentPayload,
  ) => Promise<ConsultantBookingResponse>;
}

export async function submitConsultationBooking(
  params: SubmitConsultationBookingParams,
): Promise<ConsultantBookingResponse> {
  const { payload, form, consultantName, createBooking, createOrder, verifyPayment } = params;

  const booking = await createBooking(payload);

  if (!bookingRequiresPayment(booking)) {
    return booking;
  }

  const order = await createOrder(booking.id);

  try {
    const payment = await openConsultationRazorpayCheckout({
      order,
      consultantName,
      customerName: form.contact.fullName,
      customerEmail: form.contact.email,
      customerPhone: form.contact.phone,
    });

    return verifyPayment(booking.id, {
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpayOrderId: payment.razorpay_order_id,
      razorpaySignature: payment.razorpay_signature,
    });
  } catch (error: unknown) {
    if (error instanceof ConsultationPaymentCancelledError) {
      throw error;
    }
    throw error;
  }
}

export function isConsultationPaymentCancelled(error: unknown): boolean {
  return error instanceof ConsultationPaymentCancelledError;
}
