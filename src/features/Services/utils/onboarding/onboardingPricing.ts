import type { OnboardingPricingSummary } from '../../types/serviceOnboarding.types';
import type { ServicePagePricingCost } from '../../screens/types';

function parseRupeesFromAmountText(text: string | undefined): number {
  if (text == null || text.trim().length === 0) {
    return 0;
  }
  const lower = text.toLowerCase();
  if (lower.includes('included') || lower.includes('free') || lower === '—' || lower === '-') {
    return 0;
  }
  const numStr = text.replace(/[₹,\s]/g, '').replace(/\/-.*$/, '').trim();
  const rupees = Number.parseFloat(numStr);
  return Number.isFinite(rupees) && rupees > 0 ? rupees : 0;
}

export function computeAmountInPaise(params: {
  price: string | number | null | undefined;
  isGstIncluded: string | null | undefined;
  gstPercent: string | number | null | undefined;
  cost?: ServicePagePricingCost | null;
}): number {
  const basePrice = Number(
    typeof params.price === 'string'
      ? params.price.replace(/,/g, '')
      : (params.price ?? 0),
  );
  const gstMode = (params.isGstIncluded ?? 'included').toString().trim().toLowerCase();
  const gstPct = Number(params.gstPercent ?? 0);

  if (Number.isFinite(basePrice) && basePrice > 0) {
    const payable =
      gstMode === 'excluded' && Number.isFinite(gstPct) && gstPct > 0
        ? basePrice + (basePrice * gstPct) / 100
        : basePrice;
    return Math.round(payable * 100);
  }

  const text = params.cost?.professionalFee?.amountOrText;
  const rupees = parseRupeesFromAmountText(text);
  if (rupees <= 0) {
    return 0;
  }
  return Math.round(rupees * 100);
}

export function buildPricingSummary(params: {
  serviceTitle: string;
  price: string | number | null | undefined;
  isGstIncluded: string | null | undefined;
  gstPercent: string | number | null | undefined;
  cost?: ServicePagePricingCost | null;
}): OnboardingPricingSummary {
  const basePrice = Number(
    typeof params.price === 'string'
      ? params.price.replace(/,/g, '')
      : (params.price ?? 0),
  );
  const gstMode =
    (params.isGstIncluded ?? 'included').toString().trim().toLowerCase() === 'excluded'
      ? 'excluded'
      : 'included';
  const gstPct = Number(params.gstPercent ?? 0);
  const hasMasterPrice = Number.isFinite(basePrice) && basePrice > 0;
  const gstAmountRupees =
    hasMasterPrice && gstMode === 'excluded' && Number.isFinite(gstPct) && gstPct > 0
      ? (basePrice * gstPct) / 100
      : 0;
  const totalPayableRupees = hasMasterPrice
    ? basePrice + gstAmountRupees
    : parseRupeesFromAmountText(params.cost?.professionalFee?.amountOrText);
  const amountInPaise = computeAmountInPaise(params);

  return {
    serviceTitle: params.serviceTitle,
    basePriceRupees: hasMasterPrice ? basePrice : totalPayableRupees,
    gstMode,
    gstPercent: gstPct,
    gstAmountRupees,
    totalPayableRupees: amountInPaise / 100,
    amountInPaise,
    professionalFeeLabel: params.cost?.professionalFee?.label ?? null,
    professionalFeeAmount: params.cost?.professionalFee?.amountOrText ?? null,
    governmentFeeLabel: params.cost?.governmentFee?.label ?? null,
    governmentFeeAmount: params.cost?.governmentFee?.amountOrText ?? null,
  };
}

export function formatInr(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}
