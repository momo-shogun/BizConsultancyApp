export interface EdpPurchaseRecord {
  id: number;
  amount: number;
  joiningDate: string | null;
  expiryDate: string | null;
  gatewayType: string;
  apptype: string;
}

export interface EdpPurchaseMe {
  hasActiveEnrollment: boolean;
  purchase: EdpPurchaseRecord | null;
  isConsultant?: boolean;
}

export interface CreateEdpPurchaseResult {
  paymentStatus: string;
  razorpayOrderId: string | null;
  razorpayKeyId: string | null;
  amountPaise: number | null;
}
