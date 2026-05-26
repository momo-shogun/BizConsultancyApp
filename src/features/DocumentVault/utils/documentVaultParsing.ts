import type {
  VaultDocument,
  VaultDocumentShare,
  VaultDocumentSharesResult,
  VaultDocumentType,
  VaultShareTarget,
} from '../types/documentVault.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseVaultDocumentType(raw: unknown): VaultDocumentType | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const docName = typeof raw.docName === 'string' ? raw.docName : '';
  const slug = typeof raw.slug === 'string' ? raw.slug : '';
  if (!Number.isFinite(id) || docName.length === 0) {
    return null;
  }
  return { id, docName, slug };
}

export function parseVaultDocumentTypes(raw: unknown): VaultDocumentType[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(parseVaultDocumentType)
    .filter((item): item is VaultDocumentType => item != null);
}

export function parseVaultDocument(raw: unknown): VaultDocument | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const documentUrl = typeof raw.documentUrl === 'string' ? raw.documentUrl : '';
  const documentTypeId = Number(raw.documentTypeId);
  if (!Number.isFinite(id) || documentUrl.length === 0 || !Number.isFinite(documentTypeId)) {
    return null;
  }

  const documentTypeRaw = raw.documentType;
  const documentType =
    documentTypeRaw != null ? parseVaultDocumentType(documentTypeRaw) : null;

  return {
    id,
    userType: typeof raw.userType === 'string' ? raw.userType : '',
    userId: Number(raw.userId),
    documentTypeId,
    documentUrl,
    status: Number(raw.status),
    isDeleted: Number(raw.isDeleted),
    originalFilename:
      typeof raw.originalFilename === 'string' ? raw.originalFilename : null,
    mimeType: typeof raw.mimeType === 'string' ? raw.mimeType : null,
    fileSize: raw.fileSize != null ? Number(raw.fileSize) : null,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : '',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
    documentType: documentType ?? undefined,
  };
}

export function parseVaultDocuments(raw: unknown): VaultDocument[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.map(parseVaultDocument).filter((item): item is VaultDocument => item != null);
}

export function parseVaultDocumentShare(raw: unknown): VaultDocumentShare | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  const userDocumentId = Number(raw.userDocumentId);
  if (!Number.isFinite(id) || !Number.isFinite(userDocumentId)) {
    return null;
  }

  const userDocumentRaw = raw.userDocument;
  const userDocument =
    userDocumentRaw != null ? parseVaultDocument(userDocumentRaw) : undefined;

  return {
    id,
    ownerUserType: typeof raw.ownerUserType === 'string' ? raw.ownerUserType : '',
    ownerUserId: Number(raw.ownerUserId),
    targetUserType: typeof raw.targetUserType === 'string' ? raw.targetUserType : '',
    targetUserId: Number(raw.targetUserId),
    userDocumentId,
    permission: typeof raw.permission === 'string' ? raw.permission : 'view',
    status: Number(raw.status),
    isDeleted: Number(raw.isDeleted),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : '',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
    ownerName: typeof raw.ownerName === 'string' ? raw.ownerName : null,
    targetName: typeof raw.targetName === 'string' ? raw.targetName : null,
    userDocument: userDocument ?? undefined,
  };
}

export function parseVaultDocumentShares(raw: unknown): VaultDocumentSharesResult {
  if (Array.isArray(raw)) {
    const shares = raw
      .map(parseVaultDocumentShare)
      .filter((item): item is VaultDocumentShare => item != null);
    return { sent: shares, received: [] };
  }
  if (!isRecord(raw)) {
    return { sent: [], received: [] };
  }
  const sentRaw = raw.sent;
  const receivedRaw = raw.received;
  const sent = Array.isArray(sentRaw)
    ? sentRaw
        .map(parseVaultDocumentShare)
        .filter((item): item is VaultDocumentShare => item != null)
    : [];
  const received = Array.isArray(receivedRaw)
    ? receivedRaw
        .map(parseVaultDocumentShare)
        .filter((item): item is VaultDocumentShare => item != null)
    : [];
  return { sent, received };
}

function parseShareTarget(raw: unknown): VaultShareTarget | null {
  if (!isRecord(raw)) {
    return null;
  }
  const userType = raw.userType;
  const id = Number(raw.id);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  const name = typeof raw.name === 'string' ? raw.name : null;
  if (userType === 'user') {
    return {
      userType: 'user',
      id,
      name,
      mobile: typeof raw.mobile === 'string' ? raw.mobile : null,
    };
  }
  if (userType === 'consultant') {
    const industryNames = Array.isArray(raw.industryNames)
      ? raw.industryNames.filter((v): v is string => typeof v === 'string')
      : [];
    return { userType: 'consultant', id, name, industryNames };
  }
  return null;
}

export function parseVaultShareTargets(raw: unknown): VaultShareTarget[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.map(parseShareTarget).filter((item): item is VaultShareTarget => item != null);
}
