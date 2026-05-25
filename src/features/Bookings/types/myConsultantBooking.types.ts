export interface MyConsultantBooking {
  id: number;
  consultantId: number;
  consultantName: string | null;
  consultantSlug: string | null;
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  notes: string | null;
  bookingDate: string;
  slotTime: string;
  status: string;
  paymentStatus: string;
  paymentMethod: 'wallet' | 'online' | null;
  amount: number | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
}

export interface MyConsultantBookingsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MyConsultantBookingsPage {
  data: MyConsultantBooking[];
  meta: MyConsultantBookingsMeta;
}

export type BookingsFilter = 'upcoming' | 'past';
