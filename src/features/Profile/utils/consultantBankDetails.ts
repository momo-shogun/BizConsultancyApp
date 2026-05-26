import type { ConsultantMyProfileDto } from '../types/consultantProfile.types';
import type {
  ConsultantBankDetailsPayload,
  ConsultantBankFormState,
} from '../types/consultantBankDetails.types';

export const EMPTY_BANK_FORM: ConsultantBankFormState = {
  bankName: '',
  branchName: '',
  accountName: '',
  accountNumber: '',
  confirmAccountNumber: '',
  ifscCode: '',
};

export function bankProfileToForm(profile: ConsultantMyProfileDto): ConsultantBankFormState {
  const accountNumber = profile.accountNo ?? '';
  return {
    bankName: profile.bankName ?? '',
    branchName: profile.branchName ?? '',
    accountName: profile.accountName ?? '',
    accountNumber,
    confirmAccountNumber: accountNumber,
    ifscCode: profile.ifscCode ?? '',
  };
}

export function sanitizeAccountNumber(value: string): string {
  return value.replace(/\D/g, '').slice(0, 20);
}

export function sanitizeIfscCode(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11);
}

export function formToBankPayload(form: ConsultantBankFormState): ConsultantBankDetailsPayload {
  const accountNo = sanitizeAccountNumber(form.accountNumber);
  const ifscCode = sanitizeIfscCode(form.ifscCode);

  return {
    bankName: form.bankName.trim() || null,
    branchName: form.branchName.trim() || null,
    accountName: form.accountName.trim() || null,
    accountNo: accountNo.length > 0 ? accountNo : null,
    ifscCode: ifscCode.length > 0 ? ifscCode : null,
  };
}

export function validateBankForm(
  form: ConsultantBankFormState,
): string | null {
  const accountNo = sanitizeAccountNumber(form.accountNumber);
  const confirmNo = sanitizeAccountNumber(form.confirmAccountNumber);

  if (accountNo.length > 0 && accountNo.length < 6) {
    return 'Please enter a valid account number (at least 6 digits).';
  }

  if (accountNo !== confirmNo) {
    return 'Account numbers do not match.';
  }

  const ifsc = sanitizeIfscCode(form.ifscCode);
  if (ifsc.length > 0 && ifsc.length !== 11) {
    return 'IFSC code must be 11 characters.';
  }

  return null;
}
