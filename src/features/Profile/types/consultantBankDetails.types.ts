export interface ConsultantBankFormState {
  bankName: string;
  branchName: string;
  accountName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
}

export interface ConsultantBankDetailsPayload {
  bankName: string | null;
  branchName: string | null;
  accountName: string | null;
  accountNo: string | null;
  ifscCode: string | null;
}
