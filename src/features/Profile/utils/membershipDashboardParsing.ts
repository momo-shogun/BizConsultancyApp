import type {
  MembershipFeatureRequestResult,
  MyMembershipCurrentDto,
  MyMembershipDashboardDto,
  MyMembershipFeatureDto,
  MyMembershipPurchaseStateDto,
  MembershipPurchaseStatus,
} from '../types/membershipDashboard.types';

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function readString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parsePurchaseStatus(value: unknown): MembershipPurchaseStatus {
  return value === 'expired' ? 'expired' : 'active';
}

function parseCurrent(raw: unknown): MyMembershipCurrentDto | null {
  if (raw == null || typeof raw !== 'object') {
    return null;
  }
  const row = raw as Record<string, unknown>;
  const registrationId = readNumber(row.registrationId);
  const membershipId = readNumber(row.membershipId);
  if (registrationId == null || membershipId == null) {
    return null;
  }
  return {
    registrationId,
    membershipId,
    membershipName: readString(row.membershipName) ?? undefined,
    tierRank: readNumber(row.tierRank) ?? 0,
    startDate: readString(row.startDate),
    endDate: readString(row.endDate),
    status: parsePurchaseStatus(row.status),
    upgradedFromLower: row.upgradedFromLower === true,
  };
}

function parseMembershipFeatureScope(raw: unknown): MyMembershipFeatureDto['membershipScope'] {
  if (raw == null || typeof raw !== 'object') {
    return null;
  }
  const scope = raw as Record<string, unknown>;
  return {
    id: readNumber(scope.id),
    status: readNumber(scope.status),
    isDeleted: readNumber(scope.isDeleted),
    isActive:
      scope.isActive === true || scope.isActive === 1
        ? true
        : scope.isActive === false || scope.isActive === 0
          ? false
          : null,
  };
}

function parseFeature(raw: unknown): MyMembershipFeatureDto | null {
  if (raw == null || typeof raw !== 'object') {
    return null;
  }
  const row = raw as Record<string, unknown>;
  const id = readNumber(row.id);
  const title = readString(row.title);
  if (id == null || title == null) {
    return null;
  }
  const scopeRaw = row.membershipScope ?? row.scope;

  return {
    id,
    title,
    adminStatus: readString(row.adminStatus) ?? 'pending',
    userStatus: readString(row.userStatus) ?? 'pending',
    remarks: readString(row.remarks),
    updatedAt: readString(row.updatedAt) ?? '',
    featureStatus: readNumber(row.status),
    isDeleted: readNumber(row.isDeleted),
    scopeStatus: readNumber(row.scopeStatus),
    membershipScopeStatus: readNumber(row.membershipScopeStatus),
    membershipScope: parseMembershipFeatureScope(scopeRaw),
  };
}

function isActiveNumericStatus(status: number): boolean {
  return status === 1;
}

export function isMembershipFeatureScopeActive(feature: MyMembershipFeatureDto): boolean {
  if ((feature.isDeleted ?? 0) !== 0) {
    return false;
  }

  const scope = feature.membershipScope;
  if (scope != null && (scope.isDeleted ?? 0) !== 0) {
    return false;
  }
  if (scope?.isActive === false) {
    return false;
  }

  const statusValues = [
    scope?.status,
    feature.scopeStatus,
    feature.membershipScopeStatus,
    feature.featureStatus,
  ].filter((value): value is number => value != null);

  if (statusValues.length > 0) {
    return statusValues.every(isActiveNumericStatus);
  }

  return true;
}

export function isMembershipFeatureRequestDisabled(userStatus: string | null): boolean {
  const status = userStatus?.toLowerCase() ?? '';
  return (
    status === 'requested' ||
    status === 'delivered' ||
    status === 'not_available' ||
    status === 'used' ||
    status === 'active'
  );
}

export function membershipFeatureRequestLabel(userStatus: string | null): string {
  if (userStatus?.toLowerCase() === 'requested') {
    return 'Requested';
  }
  return 'Request Service';
}

function unwrapMembershipFeatureRequestPayload(data: unknown): Record<string, unknown> | null {
  if (data == null || typeof data !== 'object') {
    return null;
  }
  const row = data as Record<string, unknown>;
  const nested = row.data;
  if (nested != null && typeof nested === 'object') {
    return nested as Record<string, unknown>;
  }
  return row;
}

export function parseMembershipFeatureRequestResult(data: unknown): MembershipFeatureRequestResult {
  const row = unwrapMembershipFeatureRequestPayload(data);
  if (row == null) {
    throw new Error('Invalid membership feature request response');
  }
  const id = readNumber(row.id);
  const status = readString(row.status);
  if (id == null || status == null) {
    throw new Error('Invalid membership feature request response');
  }
  return {
    id,
    status,
    title: readString(row.title) ?? '',
  };
}

export function membershipFeatureStatusLabel(userStatus: string): string {
  switch (userStatus) {
    case 'active':
      return 'Active';
    case 'delivered':
      return 'Delivered';
    case 'pending':
      return 'Pending';
    case 'requested':
      return 'Requested';
    case 'used':
      return 'Used';
    case 'not_available':
      return 'Not available';
    default:
      return userStatus;
  }
}

export function parseMyMembershipPurchaseStateDto(data: unknown): MyMembershipPurchaseStateDto {
  if (data == null || typeof data !== 'object') {
    throw new Error('Invalid membership purchase state response');
  }
  const row = data as Record<string, unknown>;
  const progress = readNumber(row.progressPercent);

  return {
    userType: readString(row.userType) ?? 'user',
    membershipType: readString(row.membershipType) ?? 'users',
    current: parseCurrent(row.current),
    daysRemaining: readNumber(row.daysRemaining),
    progressPercent: progress != null ? Math.min(100, Math.max(0, progress)) : 0,
  };
}

export function parseMyMembershipDashboardDto(data: unknown): MyMembershipDashboardDto {
  if (data == null || typeof data !== 'object') {
    throw new Error('Invalid membership dashboard response');
  }
  const row = data as Record<string, unknown>;
  const featuresRaw = Array.isArray(row.features) ? row.features : [];
  const features = featuresRaw
    .map(parseFeature)
    .filter((item): item is MyMembershipFeatureDto => item != null);

  const progress = readNumber(row.progressPercent);

  return {
    userType: readString(row.userType) ?? 'user',
    membershipType: readString(row.membershipType) ?? 'users',
    current: parseCurrent(row.current),
    daysRemaining: readNumber(row.daysRemaining),
    progressPercent: progress != null ? Math.min(100, Math.max(0, progress)) : 0,
    features,
    mostUsedFeatureTitle: readString(row.mostUsedFeatureTitle),
    mostUsedFeatureLabel: readString(row.mostUsedFeatureLabel),
    upgradeHint: readString(row.upgradeHint),
  };
}

export function formatMembershipDateLabel(iso: string | null): string | null {
  if (iso == null || iso.trim().length === 0) {
    return null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
