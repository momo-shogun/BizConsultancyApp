export interface ConsultantSelfBooking {
  id: number;
  consultantId: number;
  name: string;
  customerImageUrl?: string | null;
  customerImage?: string | null;
  profileImage?: string | null;
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
}

export type ConsultantBookingsFilter = 'upcoming' | 'past';
