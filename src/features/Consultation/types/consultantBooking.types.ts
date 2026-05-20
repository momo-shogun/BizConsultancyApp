/** POST /api/consultant-bookings */

export type ConsultationTypeApi = 'video' | 'phone';

export interface CreateConsultantBookingPayload {
  consultantId: number;
  name: string;
  email?: string;
  phone: string;
  consultationType?: ConsultationTypeApi;
  notes?: string;
  bookingDate: string;
  slotTime: string;
}

export interface ConsultantBookingResponse {
  id: number;
  consultantId: number;
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  notes: string | null;
  bookingDate: string;
  slotTime: string;
  status: string;
  amount?: number | null;
  paymentStatus?: string;
  paymentMethod?: 'wallet' | 'online' | null;
  createdAt: string;
  updatedAt: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyConsultantBookingPaymentPayload {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface RazorpayCheckoutSuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
