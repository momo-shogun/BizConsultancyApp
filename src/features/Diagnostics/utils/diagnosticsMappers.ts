import type {
  DiagnosisDashboardFeature,
  DiagnosisDocumentRequirementItem,
  DiagnosisDocumentSelectionPayload,
  DiagnosisPlanCtaMode,
  DiagnosisPlanViewModel,
  DiagnosisPurchaseState,
  DiagnosisVaultDocument,
  DiagnosticsMembership,
  MyDiagnosisDashboard,
  MyDiagnosisDocumentRequirements,
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

  const startDate =
    typeof c.startDate === 'string' && c.startDate.length > 0 ? c.startDate : null;

  return {
    registrationId,
    diagnosticsMembershipId,
    packName: typeof c.packName === 'string' ? c.packName : null,
    tierRank,
    startDate,
    packDeliveryStatus,
  };
}

function mapDiagnosisFeature(raw: unknown): DiagnosisDashboardFeature | null {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const row = raw as Record<string, unknown>;
  const id = typeof row.id === 'number' ? row.id : null;
  const title = typeof row.title === 'string' ? row.title : null;
  if (id == null || title == null) {
    return null;
  }
  return {
    id,
    title,
    adminStatus: typeof row.adminStatus === 'string' ? row.adminStatus : 'pending',
    userStatus: typeof row.userStatus === 'string' ? row.userStatus : 'pending',
    remarks: typeof row.remarks === 'string' ? row.remarks : null,
    updatedAt: typeof row.updatedAt === 'string' ? row.updatedAt : '',
  };
}

export function mapMyDiagnosisDashboard(raw: unknown): MyDiagnosisDashboard {
  const row = raw != null && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : {};

  const current = mapDiagnosisPurchaseState({ current: row.current });
  const featuresRaw = Array.isArray(row.features) ? row.features : [];
  const features = featuresRaw
    .map(mapDiagnosisFeature)
    .filter((f): f is DiagnosisDashboardFeature => f != null);

  const progressRaw = row.serviceProgressPercent;
  const serviceProgressPercent =
    typeof progressRaw === 'number' && Number.isFinite(progressRaw)
      ? Math.min(100, Math.max(0, progressRaw))
      : 0;

  return {
    current,
    displayStatus: typeof row.displayStatus === 'string' ? row.displayStatus : null,
    features,
    serviceProgressPercent,
    nextServiceTitle:
      typeof row.nextServiceTitle === 'string' ? row.nextServiceTitle : null,
    upgradeHint: typeof row.upgradeHint === 'string' ? row.upgradeHint : null,
  };
}

function mapVaultDocument(raw: unknown): DiagnosisVaultDocument | null {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const row = raw as Record<string, unknown>;
  const id = typeof row.id === 'number' ? row.id : null;
  const documentUrl = typeof row.documentUrl === 'string' ? row.documentUrl : null;
  if (id == null || documentUrl == null) {
    return null;
  }
  return {
    id,
    documentUrl,
    originalFilename:
      typeof row.originalFilename === 'string' ? row.originalFilename : null,
    mimeType: typeof row.mimeType === 'string' ? row.mimeType : null,
    createdAt: typeof row.createdAt === 'string' ? row.createdAt : '',
  };
}

function mapDocumentRequirementItem(raw: unknown): DiagnosisDocumentRequirementItem | null {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const row = raw as Record<string, unknown>;
  const diagnosisMembershipDocumentId =
    typeof row.diagnosisMembershipDocumentId === 'number'
      ? row.diagnosisMembershipDocumentId
      : null;
  const documentTypeId = typeof row.documentTypeId === 'number' ? row.documentTypeId : null;
  if (diagnosisMembershipDocumentId == null || documentTypeId == null) {
    return null;
  }

  const availableRaw = Array.isArray(row.availableDocuments) ? row.availableDocuments : [];
  const selectedRaw = Array.isArray(row.selectedUserDocumentIds)
    ? row.selectedUserDocumentIds
    : [];

  return {
    diagnosisMembershipDocumentId,
    documentTypeId,
    documentTypeName:
      typeof row.documentTypeName === 'string' ? row.documentTypeName : null,
    status: typeof row.status === 'number' ? row.status : 0,
    sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : null,
    availableDocuments: availableRaw
      .map(mapVaultDocument)
      .filter((d): d is DiagnosisVaultDocument => d != null),
    selectedUserDocumentIds: selectedRaw
      .map((id) => (typeof id === 'number' ? id : Number(id)))
      .filter((id) => Number.isFinite(id)),
  };
}

export function mapMyDiagnosisDocumentRequirements(
  raw: unknown,
): MyDiagnosisDocumentRequirements {
  const row = raw != null && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : {};
  const itemsRaw = Array.isArray(row.items) ? row.items : [];

  return {
    registrationId: typeof row.registrationId === 'number' ? row.registrationId : null,
    diagnosticsMembershipId:
      typeof row.diagnosticsMembershipId === 'number'
        ? row.diagnosticsMembershipId
        : null,
    items: itemsRaw
      .map(mapDocumentRequirementItem)
      .filter((i): i is DiagnosisDocumentRequirementItem => i != null),
  };
}

export function toDocumentSelectionPayload(
  items: DiagnosisDocumentRequirementItem[],
): DiagnosisDocumentSelectionPayload[] {
  return items.map((item) => ({
    diagnosisMembershipDocumentId: item.diagnosisMembershipDocumentId,
    userDocumentIds: item.selectedUserDocumentIds,
  }));
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
