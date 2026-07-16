export type MembershipPaymentGateway = 'wallet' | 'razor_pay';

export interface CreateMembershipRegistrationPayload {
  name: string;
  email: string;
  mobile: string;
  membershipId: number;
  categoryId: number;
  segmentId: number;
  userType: 'user' | 'consultant';
  memberShipType: string;
  paymentGateway: MembershipPaymentGateway;
  amount: number;
}

export interface CreateMembershipRegistrationResult {
  paymentStatus: string;
  razorpayOrderId: string | null;
  razorpayKeyId: string | null;
  amountPaise: number | null;
}

export interface VerifyMembershipPaymentPayload {
  orderId: string;
  paymentId: string;
  signature?: string;
}
