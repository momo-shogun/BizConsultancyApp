export function isOnboardingSubmissionPaid(item: {
  paymentId?: string | null;
  paymentMode?: string | null;
  status?: string | null;
}): boolean {
  if (item.paymentId != null && String(item.paymentId).trim() !== '') {
    return true;
  }
  const status = (item.status ?? '').toString().trim().toLowerCase();
  if (status === 'completed') {
    return true;
  }
  const paymentMode = (item.paymentMode ?? '').toString().trim().toLowerCase();
  if (paymentMode === 'wallet' && (status === 'enrolled' || status === 'applied')) {
    return true;
  }
  return false;
}
