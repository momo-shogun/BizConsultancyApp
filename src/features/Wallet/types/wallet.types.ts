export interface WalletTransaction {
  id: number;
  userId: number;
  transactionType: string;
  transactionDetail: string | null;
  /** API may return number or decimal string e.g. `"1000.00"`. */
  transactionAmount: number;
  transactionId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransactionSection {
  title: string;
  data: WalletTransaction[];
}

export interface WalletTransactionsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WalletTransactionsResponse {
  data: WalletTransaction[];
  meta: WalletTransactionsMeta;
}

export interface WalletTopupOrderResponse {
  orderId: string;
  keyId: string;
  /** Amount in paise for Razorpay checkout. */
  amount: number;
}

export interface WalletTopupVerifyPayload {
  orderId: string;
  paymentId: string;
}

export interface WalletTopupVerifyResponse {
  success: boolean;
}
