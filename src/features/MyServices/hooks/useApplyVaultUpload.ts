import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

import { showGlobalToast } from '@/shared/components';
import { getApiErrorMessage } from '@/utils/apiError';

import { useUploadMyVaultDocumentMutation } from '../api/myServicesApi';
import type { SubmissionDocumentRequirementItem } from '../types/myServices.types';
import { assetToMultipartFile } from '@/services/api/multipartFetch';

import {
  getVaultAssetMimeType,
  launchVaultImagePicker,
  validateVaultPickerAsset,
  type VaultImagePickerSource,
} from '../utils/vaultImagePicker';
import { buildVaultUploadFilename } from '../utils/vaultUploadFilename';

interface UseApplyVaultUploadParams {
  submissionId: number;
  isApplied: boolean;
  personNameForUpload: string;
  setDraftSelections: Dispatch<SetStateAction<Record<number, number[]>>>;
}

interface UseApplyVaultUploadResult {
  uploadingForServiceDocumentId: number | null;
  uploadSourceItem: SubmissionDocumentRequirementItem | null;
  requestUploadForRequirement: (item: SubmissionDocumentRequirementItem) => void;
  closeUploadSourceDialog: () => void;
  uploadFromSource: (source: VaultImagePickerSource) => Promise<void>;
}

export function useApplyVaultUpload({
  submissionId,
  isApplied,
  personNameForUpload,
  setDraftSelections,
}: UseApplyVaultUploadParams): UseApplyVaultUploadResult {
  const [uploadingForServiceDocumentId, setUploadingForServiceDocumentId] = useState<
    number | null
  >(null);
  const [uploadSourceItem, setUploadSourceItem] =
    useState<SubmissionDocumentRequirementItem | null>(null);
  const [uploadVault] = useUploadMyVaultDocumentMutation();

  const requestUploadForRequirement = useCallback(
    (item: SubmissionDocumentRequirementItem): void => {
      if (isApplied) {
        showGlobalToast('This application is final submitted and locked');
        return;
      }
      setUploadSourceItem(item);
    },
    [isApplied],
  );

  const closeUploadSourceDialog = useCallback((): void => {
    setUploadSourceItem(null);
  }, []);

  const performUpload = useCallback(
    async (
      item: SubmissionDocumentRequirementItem,
      source: VaultImagePickerSource,
    ): Promise<void> => {
      const pickerResult = await launchVaultImagePicker(source);
      if (pickerResult.errorMessage != null) {
        showGlobalToast({
          variant: 'error',
          message: pickerResult.errorMessage,
          duration: 6000,
          position: 'top',
        });
        return;
      }
      const asset = pickerResult.asset;
      if (asset == null) {
        return;
      }

      const validationError = validateVaultPickerAsset(asset);
      if (validationError != null) {
        showGlobalToast(validationError);
        return;
      }

      const ordinal = Math.max(1, item.availableDocuments.length + 1);
      const mimeType = getVaultAssetMimeType(asset);
      const originalName = asset.fileName?.trim() || `upload_${Date.now()}.jpg`;
      const uploadFilename = buildVaultUploadFilename({
        requirementLabel: item.documentTypeName ?? 'Document',
        ordinal,
        personDisplayName: personNameForUpload,
        originalFilename: originalName,
        mimeType,
      });
      const file = assetToMultipartFile(asset, uploadFilename, mimeType);

      if (file.uri.length === 0) {
        showGlobalToast('Could not read the selected file. Please try another photo.');
        return;
      }

      if (!Number.isFinite(item.documentTypeId) || item.documentTypeId <= 0) {
        showGlobalToast('Invalid document type for this requirement. Please refresh and try again.');
        return;
      }

      setUploadingForServiceDocumentId(item.serviceDocumentId);
      try {
        const uploaded = await uploadVault({
          submissionId,
          serviceDocumentId: item.serviceDocumentId,
          documentTypeId: item.documentTypeId,
          file,
        }).unwrap();

        setDraftSelections((prev) => {
          const current = prev[item.serviceDocumentId] ?? [];
          if (current.includes(uploaded.id)) {
            return prev;
          }
          return {
            ...prev,
            [item.serviceDocumentId]: [...current, uploaded.id],
          };
        });
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Upload failed'));
      } finally {
        setUploadingForServiceDocumentId(null);
      }
    },
    [personNameForUpload, setDraftSelections, submissionId, uploadVault],
  );

  const uploadFromSource = useCallback(
    async (source: VaultImagePickerSource): Promise<void> => {
      const item = uploadSourceItem;
      if (item == null) {
        return;
      }
      setUploadSourceItem(null);
      await performUpload(item, source);
    },
    [performUpload, uploadSourceItem],
  );

  return {
    uploadingForServiceDocumentId,
    uploadSourceItem,
    requestUploadForRequirement,
    closeUploadSourceDialog,
    uploadFromSource,
  };
}
