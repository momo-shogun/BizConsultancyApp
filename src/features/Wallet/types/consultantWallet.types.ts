export type WithdrawalStatus = 'pending' | 'approved' | 'completed' | 'rejected' | string;

export interface ConsultantWithdrawalItem {
  id: number;
  consultantId: number;
  status: WithdrawalStatus;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultantWalletTransactionItem {
  id: number;
  userName: string | null;
  transactionDetail: string | null;
  createdAt: string;
  transactionType: 'credit' | 'debit' | string;
  transactionAmount: number;
  commissionAmount: number;
  bookingId: number | null;
}

export interface ConsultantWalletTransactionsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ConsultantWalletTransactionsResponse {
  data: ConsultantWalletTransactionItem[];
  meta: ConsultantWalletTransactionsMeta;
}

export interface ConsultantWalletTransactionSection {
  title: string;
  data: ConsultantWalletTransactionItem[];
}
