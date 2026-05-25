import type {
  DiagnosisPlanCtaMode,
  DiagnosisPlanViewModel,
  DiagnosisPurchaseState,
  DiagnosticsMembership,
} from '../types/diagnostics.types';

function parsePrice(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

export function mapDiagnosticsMembership(raw: unknown): DiagnosticsMembership | null {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const row = raw as Record<string, unknown>;
  const id = typeof row.id === 'number' ? row.id : null;
  const packName = typeof row.packName === 'string' ? row.packName : null;
  if (id == null || packName == null) {
    return null;
  }

  const features = parseStringArray(row.diagnosisFeatures);
  const services = parseStringArray(row.servicesIncluded);

  return {
    id,
    packName,
    slab: typeof row.slab === 'string' ? row.slab : null,
    servicesIncluded: services,
    diagnosisFeatures: features.length > 0 ? features : services,
    idealFor: typeof row.idealFor === 'string' ? row.idealFor : null,
    priceExclGst: parsePrice(row.priceExclGst),
    isPopular: Number(row.isPopular) === 1 || row.isPopular === true,
    tierRank: typeof row.tierRank === 'number' ? row.tierRank : id,
  };
}

export function mapDiagnosisPurchaseState(raw: unknown): DiagnosisPurchaseState | null {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const row = raw as Record<string, unknown>;
  const current = row.current;
  if (current == null || typeof current !== 'object' || Array.isArray(current)) {
    return null;
  }
  const c = current as Record<string, unknown>;
  const registrationId = typeof c.registrationId === 'number' ? c.registrationId : null;
  const diagnosticsMembershipId =
    typeof c.diagnosticsMembershipId === 'number' ? c.diagnosticsMembershipId : null;
  const tierRank = typeof c.tierRank === 'number' ? c.tierRank : 0;
  const packDeliveryStatus =
    c.packDeliveryStatus === 'active' ||
    c.packDeliveryStatus === 'completed' ||
    c.packDeliveryStatus === 'expired' ||
    c.packDeliveryStatus === 'upgraded'
      ? c.packDeliveryStatus
      : null;

  if (registrationId == null || diagnosticsMembershipId == null || packDeliveryStatus == null) {
    return null;
  }

  return {
    registrationId,
    diagnosticsMembershipId,
    packName: typeof c.packName === 'string' ? c.packName : null,
    tierRank,
    packDeliveryStatus,
  };
}

function packShortName(packName: string): string {
  const upper = packName.toUpperCase();
  if (upper.includes('STRATEGY')) return 'Strategy';
  if (upper.includes('GROWTH')) return 'Growth';
  if (upper.includes('STARTER')) return 'Starter';
  return packName.replace(/^BIZ DIAGNOSTIC\s+/i, '').trim() || packName;
}

function resolveCtaMode(
  pack: DiagnosticsMembership,
  current: DiagnosisPurchaseState | null,
): DiagnosisPlanCtaMode {
  if (current == null || current.packDeliveryStatus !== 'active') {
    return 'purchase';
  }

  const packTier = pack.tierRank;
  const currentTier = current.tierRank;

  if (current.diagnosticsMembershipId === pack.id) {
    return 'active';
  }
  if (packTier > currentTier) {
    return 'upgrade';
  }
  return 'disabled_lower';
}

function ctaLabelForMode(mode: DiagnosisPlanCtaMode): string {
  if (mode === 'active') return 'Active pack';
  if (mode === 'upgrade') return 'Upgrade';
  if (mode === 'disabled_lower') return 'Included in plan';
  return 'Get pack';
}

export function mapToDiagnosisPlanViewModels(
  packs: DiagnosticsMembership[],
  purchaseState: DiagnosisPurchaseState | null,
): DiagnosisPlanViewModel[] {
  return packs.map((pack) => {
    const ctaMode = resolveCtaMode(pack, purchaseState);
    return {
      id: pack.id,
      title: packShortName(pack.packName),
      priceLabel: `₹${Math.round(pack.priceExclGst).toLocaleString('en-IN')}`,
      idealFor: pack.idealFor,
      features: pack.diagnosisFeatures.slice(0, 6),
      isPopular: pack.isPopular,
      ctaMode,
      ctaLabel: ctaLabelForMode(ctaMode),
    };
  });
}
