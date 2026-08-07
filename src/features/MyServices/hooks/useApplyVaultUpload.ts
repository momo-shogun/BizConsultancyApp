import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

import { showGlobalToast } from '@/shared/components';
import { getApiErrorMessage } from '@/utils/apiError';

import { useUploadMyVaultDocumentMutation } from '../api/myServicesApi';
import type { SubmissionDocumentRequirementItem } from '../types/myServices.types';
import { docSelectionKey } from '../utils/applyServiceReview';

import {
  getVaultFileMimeType,
  launchVaultImagePicker,
  validateVaultPickerFile,
  vaultPickedFileToMultipart,
  type VaultImagePickerSource,
} from '../utils/vaultImagePicker';
import { buildVaultUploadFilename } from '../utils/vaultUploadFilename';

interface UseApplyVaultUploadParams {
  submissionId: number;
  isApplied: boolean;
  personNameForUpload: string;
  setDraftSelections: Dispatch<SetStateAction<Record<string, number[]>>>;
  /**
   * Persist drafts and return a server answer-instance id for the target row.
   * Called when the instance has no id yet (mirrors web save-before-upload).
   */
  ensureAnswerInstanceId: (stepId: number, instanceIndex: number) => Promise<number | null>;
}

interface UploadTarget {
  item: SubmissionDocumentRequirementItem;
  stepId: number;
  instanceIndex: number;
  answerInstanceId: number | null;
}

interface UseApplyVaultUploadResult {
  uploadingSelectionKey: string | null;
  uploadSourceTarget: UploadTarget | null;
  requestUploadForRequirement: (
    item: SubmissionDocumentRequirementItem,
    stepId: number,
    instanceIndex: number,
    answerInstanceId: number | null,
  ) => void;
  closeUploadSourceDialog: () => void;
  uploadFromSource: (source: VaultImagePickerSource) => Promise<void>;
}

export function useApplyVaultUpload({
  submissionId,
  isApplied,
  personNameForUpload,
  setDraftSelections,
  ensureAnswerInstanceId,
}: UseApplyVaultUploadParams): UseApplyVaultUploadResult {
  const [uploadingSelectionKey, setUploadingSelectionKey] = useState<string | null>(null);
  const [uploadSourceTarget, setUploadSourceTarget] = useState<UploadTarget | null>(null);
  const [uploadVault] = useUploadMyVaultDocumentMutation();

  const requestUploadForRequirement = useCallback(
    (
      item: SubmissionDocumentRequirementItem,
      stepId: number,
      instanceIndex: number,
      answerInstanceId: number | null,
    ): void => {
      if (isApplied) {
        showGlobalToast('This application is final submitted and locked');
        return;
      }
      setUploadSourceTarget({ item, stepId, instanceIndex, answerInstanceId });
    },
    [isApplied],
  );

  const closeUploadSourceDialog = useCallback((): void => {
    setUploadSourceTarget(null);
  }, []);

  const performUpload = useCallback(
    async (
      item: SubmissionDocumentRequirementItem,
      answerInstanceId: number,
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
      const picked = pickerResult.file;
      if (picked == null) {
        return;
      }

      const validationError = validateVaultPickerFile(picked);
      if (validationError != null) {
        showGlobalToast(validationError);
        return;
      }

      const ordinal = Math.max(1, item.availableDocuments.length + 1);
      const mimeType = getVaultFileMimeType(picked);
      const originalName =
        picked.fileName?.trim() ||
        `upload_${Date.now()}${mimeType === 'application/pdf' ? '.pdf' : '.jpg'}`;
      const uploadFilename = buildVaultUploadFilename({
        requirementLabel: item.documentTypeName ?? 'Document',
        ordinal,
        personDisplayName: personNameForUpload,
        originalFilename: originalName,
        mimeType,
      });
      const file = vaultPickedFileToMultipart(picked, uploadFilename, mimeType);

      if (file.uri.length === 0) {
        showGlobalToast('Could not read the selected file. Please try another file.');
        return;
      }

      if (!Number.isFinite(item.documentTypeId) || item.documentTypeId <= 0) {
        showGlobalToast('Invalid document type for this requirement. Please refresh and try again.');
        return;
      }

      const selectionKey = docSelectionKey(item.serviceDocumentId, answerInstanceId);
      setUploadingSelectionKey(selectionKey);
      try {
        const uploaded = await uploadVault({
          submissionId,
          serviceDocumentId: item.serviceDocumentId,
          documentTypeId: item.documentTypeId,
          file,
        }).unwrap();

        setDraftSelections((prev) => {
          const current = prev[selectionKey] ?? [];
          if (current.includes(uploaded.id)) {
            return prev;
          }
          return {
            ...prev,
            [selectionKey]: [...current, uploaded.id],
          };
        });
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Upload failed'));
      } finally {
        setUploadingSelectionKey(null);
      }
    },
    [personNameForUpload, setDraftSelections, submissionId, uploadVault],
  );

  const uploadFromSource = useCallback(
    async (source: VaultImagePickerSource): Promise<void> => {
      const target = uploadSourceTarget;
      if (target == null) {
        return;
      }
      setUploadSourceTarget(null);

      let answerInstanceId = target.answerInstanceId;
      if (answerInstanceId == null || answerInstanceId <= 0) {
        try {
          answerInstanceId = await ensureAnswerInstanceId(
            target.stepId,
            target.instanceIndex,
          );
        } catch (err: unknown) {
          showGlobalToast({
            variant: 'error',
            message: getApiErrorMessage(err, 'Save failed before upload'),
            duration: 6000,
            position: 'top',
          });
          return;
        }
        if (answerInstanceId == null || answerInstanceId <= 0) {
          showGlobalToast({
            variant: 'error',
            message: 'Could not save this entry before upload. Please try again.',
            duration: 6000,
            position: 'top',
          });
          return;
        }
      }

      await performUpload(target.item, answerInstanceId, source);
    },
    [ensureAnswerInstanceId, performUpload, uploadSourceTarget],
  );

  return {
    uploadingSelectionKey,
    uploadSourceTarget,
    requestUploadForRequirement,
    closeUploadSourceDialog,
    uploadFromSource,
  };
}
