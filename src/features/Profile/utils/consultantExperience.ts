/** Hint shown under experience inputs (consultant profile). */
export const CONSULTANT_EXPERIENCE_HELPER =
  'Numbers only. We add "years" for you — e.g. if you enter 5, it is saved and shown as 5 years.';

export function experienceStoredToDigits(stored: string | null | undefined): string {
  if (stored == null || !String(stored).trim()) {
    return '';
  }
  const match = String(stored).match(/\d+/);
  return match != null ? match[0] : '';
}

export function experienceDigitsToStored(digits: string): string {
  const cleaned = digits.replace(/\D/g, '');
  if (cleaned.length === 0) {
    return '';
  }
  const n = Number.parseInt(cleaned, 10);
  if (!Number.isFinite(n) || n < 0) {
    return '';
  }
  const capped = Math.min(n, 99);
  return capped === 1 ? '1 year' : `${capped} years`;
}
