import type { VaultDocument, VaultDocumentGroup } from '../types/documentVault.types';

export function isVaultImageDocument(doc: VaultDocument): boolean {
  const mime = (doc.mimeType ?? '').toLowerCase();
  if (mime.startsWith('image/')) {
    return true;
  }
  const name = (doc.originalFilename ?? doc.documentUrl).toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(name);
}

export function getVaultDocumentTitle(doc: VaultDocument): string {
  return doc.originalFilename?.trim() || `Document #${doc.id}`;
}

export function groupVaultDocumentsByType(documents: VaultDocument[]): VaultDocumentGroup[] {
  const map = new Map<string, VaultDocument[]>();
  for (const doc of documents) {
    const key = doc.documentType?.docName?.trim() || `Type #${doc.documentTypeId}`;
    const list = map.get(key) ?? [];
    list.push(doc);
    map.set(key, list);
  }
  return Array.from(map.entries()).map(([typeName, docs]) => ({
    typeName,
    documents: docs,
  }));
}

export function formatShareTargetLabel(
  name: string | null | undefined,
  mobile: string | null | undefined,
  fallbackId: number,
): string {
  const displayName = name?.trim() || `User #${fallbackId}`;
  const phone = mobile?.trim();
  return phone != null && phone.length > 0 ? `${displayName} (${phone})` : displayName;
}

export function formatShareTargetConsultantLabel(
  name: string | null | undefined,
  industryNames: readonly string[],
  fallbackId: number,
): string {
  const displayName = name?.trim() || `Consultant #${fallbackId}`;
  const industries = industryNames.map((n) => n.trim()).filter((n) => n.length > 0).join(', ');
  return industries.length > 0 ? `${displayName} (${industries})` : displayName;
}
