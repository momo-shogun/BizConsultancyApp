import React, { useCallback, useState } from 'react';

import { VaultDocumentPreviewModal } from '../components/VaultDocumentPreviewModal';
import type { VaultDocument } from '../types/documentVault.types';

export interface UseVaultDocumentPreviewModalResult {
  openPreview: (document: VaultDocument) => void;
  previewModal: React.ReactElement;
}

export function useVaultDocumentPreviewModal(): UseVaultDocumentPreviewModalResult {
  const [previewDocument, setPreviewDocument] = useState<VaultDocument | null>(null);

  const openPreview = useCallback((document: VaultDocument): void => {
    const url = document.documentUrl?.trim() ?? '';
    if (url.length === 0) {
      return;
    }
    setPreviewDocument(document);
  }, []);

  const closePreview = useCallback((): void => {
    setPreviewDocument(null);
  }, []);

  const previewModal = (
    <VaultDocumentPreviewModal
      visible={previewDocument != null}
      document={previewDocument}
      onClose={closePreview}
    />
  );

  return { openPreview, previewModal };
}
