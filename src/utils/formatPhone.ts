/**
 * Normalizes digits and formats a 10-digit Indian mobile as `+91 XXXXX XXXXX`.
 */
export function formatIndianMobile(mobile: string | null | undefined): string | null {
  if (mobile == null) {
    return null;
  }
  const digits = mobile.replace(/\D/g, '');
  if (digits.length < 10) {
    return null;
  }
  const ten = digits.slice(-10);
  return `+91 ${ten.slice(0, 5)} ${ten.slice(5)}`;
}

export function isValidIndianMobile(mobile: string | null | undefined): boolean {
  if (mobile == null) {
    return false;
  }
  const digits = mobile.replace(/\D/g, '');
  return digits.length >= 10;
}
