import type { VaultDocument } from '@/features/DocumentVault/types/documentVault.types';
import { resolveAwsImageUrl } from '@/utils/awsImageUrl';

import type { SubmissionDocumentRow } from '../types/myServices.types';

export function resolveSubmissionDocumentUrl(
  documentUrl: string | null | undefined,
): string | null {
  return resolveAwsImageUrl(documentUrl);
}

export function toVaultPreviewDocument(doc: SubmissionDocumentRow): VaultDocument | null {
  const url = resolveSubmissionDocumentUrl(doc.documentUrl);
  if (url == null || url.length === 0) {
    return null;
  }

  const fileSize = doc.fileSize != null ? Number(doc.fileSize) : Number.NaN;

  return {
    id: doc.selectionId,
    userType: 'user',
    userId: 0,
    documentTypeId: 0,
    documentUrl: url,
    status: 1,
    isDeleted: 0,
    originalFilename: doc.originalFilename,
    mimeType: doc.mimeType,
    fileSize: Number.isFinite(fileSize) ? fileSize : null,
    createdAt: '',
    updatedAt: '',
  };
}
