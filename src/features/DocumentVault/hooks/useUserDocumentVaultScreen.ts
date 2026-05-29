import { useCallback, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { assetToMultipartFile } from '@/services/api/multipartFetch';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';
import { showGlobalToast } from '@/shared/components';

import {
  useCreateVaultDocumentShareMutation,
  useDeleteVaultDocumentMutation,
  useDeleteVaultDocumentShareMutation,
  useGetMyVaultDocumentSharesQuery,
  useGetMyVaultDocumentsQuery,
  useGetMyVaultShareTargetsQuery,
  useGetVaultDocumentTypesQuery,
  useUploadVaultDocumentMutation,
} from '../api/documentVaultApi';
import type { VaultShareTargetOption } from '../components/VaultShareModal';
import type {
  VaultDocument,
  VaultDocumentShare,
  VaultDocumentType,
  VaultShareTargetConsultant,
} from '../types/documentVault.types';
import {
  formatShareTargetConsultantLabel,
  groupVaultDocumentsByType,
} from '../utils/documentVaultDisplay';
import {
  getVaultAssetMimeType,
  launchVaultImagePicker,
  validateVaultPickerAsset,
  type VaultImagePickerSource,
} from '@/features/MyServices/utils/vaultImagePicker';
import { buildVaultUploadFilename } from '@/features/MyServices/utils/vaultUploadFilename';

export interface UseUserDocumentVaultScreenResult {
  isLoading: boolean;
  isRefreshing: boolean;
  isBusy: boolean;
  errorMessage: string | null;
  documentCount: number;
  sentShareCount: number;
  receivedShareCount: number;
  groupedDocuments: ReturnType<typeof groupVaultDocumentsByType>;
  sentShares: VaultDocumentShare[];
  receivedShares: VaultDocumentShare[];
  documentTypes: VaultDocumentType[];
  shareTargetOptions: VaultShareTargetOption[];
  uploadModalVisible: boolean;
  shareModalVisible: boolean;
  selectedDocumentTypeId: string;
  shareDocumentId: string;
  shareTargetUserId: string;
  shareDocumentPreview: VaultDocument | null;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  setSelectedDocumentTypeId: (value: string) => void;
  openShareModal: (document: VaultDocument) => void;
  closeShareModal: () => void;
  setShareTargetUserId: (value: string) => void;
  refresh: () => void;
  uploadFromSource: (source: VaultImagePickerSource) => Promise<void>;
  submitShare: () => Promise<void>;
  confirmDeleteDocument: (document: VaultDocument) => void;
  removeShare: (shareId: number) => Promise<void>;
  isOwnDocument: (document: VaultDocument) => boolean;
  openDocumentActions: (document: VaultDocument) => void;
}

export function useUserDocumentVaultScreen(): UseUserDocumentVaultScreenResult {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authUser = useAppSelector((state) => state.auth.user);
  const accountRole = useAppSelector((state) => state.auth.accountRole);
  const displayName = useAppSelector((state) => state.auth.displayName);

  const actorType = (accountRole ?? 'user').toLowerCase();
  const actorId = Number(authUser?.id ?? 0);
  const personNameForUpload = (displayName ?? authUser?.name ?? 'User').trim() || 'User';

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState('');
  const [shareDocumentId, setShareDocumentId] = useState('');
  const [shareTargetUserId, setShareTargetUserId] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const skip = !isAuthenticated;

  const {
    data: documents = [],
    isLoading: docsLoading,
    isFetching: docsFetching,
    error: docsError,
    refetch: refetchDocs,
  } = useGetMyVaultDocumentsQuery(undefined, { skip });

  const {
    data: shares = { sent: [], received: [] },
    isLoading: sharesLoading,
    isFetching: sharesFetching,
    error: sharesError,
    refetch: refetchShares,
  } = useGetMyVaultDocumentSharesQuery(undefined, { skip });

  const { data: documentTypes = [] } = useGetVaultDocumentTypesQuery(undefined, { skip });
  const { data: shareTargetsRaw = [] } = useGetMyVaultShareTargetsQuery(undefined, { skip });

  const [uploadVaultDocument] = useUploadVaultDocumentMutation();
  const [deleteVaultDocument] = useDeleteVaultDocumentMutation();
  const [createVaultDocumentShare] = useCreateVaultDocumentShareMutation();
  const [deleteVaultDocumentShare] = useDeleteVaultDocumentShareMutation();

  const shareTargetOptions = useMemo((): VaultShareTargetOption[] => {
    return shareTargetsRaw
      .filter((t): t is VaultShareTargetConsultant => t.userType === 'consultant')
      .map((target) => ({
        id: target.id,
        label: formatShareTargetConsultantLabel(target.name, target.industryNames, target.id),
      }));
  }, [shareTargetsRaw]);

  const ownDocuments = useMemo(
    () =>
      documents.filter(
        (doc) => doc.userType.toLowerCase() === actorType && Number(doc.userId) === actorId,
      ),
    [actorId, actorType, documents],
  );

  const groupedDocuments = useMemo(
    () => groupVaultDocumentsByType(documents),
    [documents],
  );

  const shareDocumentPreview = useMemo((): VaultDocument | null => {
    const id = Number(shareDocumentId);
    if (!Number.isFinite(id) || id <= 0) {
      return null;
    }
    return ownDocuments.find((doc) => doc.id === id) ?? null;
  }, [ownDocuments, shareDocumentId]);

  const errorMessage = useMemo((): string | null => {
    if (docsError != null) {
      return getApiErrorMessage(docsError, 'Failed to load documents');
    }
    if (sharesError != null) {
      return getApiErrorMessage(sharesError, 'Failed to load shares');
    }
    return null;
  }, [docsError, sharesError]);

  const isLoading =
    (docsLoading || sharesLoading) && documents.length === 0 && shares.sent.length === 0;
  const isRefreshing = (docsFetching || sharesFetching) && !isLoading;

  const refresh = useCallback((): void => {
    void refetchDocs();
    void refetchShares();
  }, [refetchDocs, refetchShares]);

  const isOwnDocument = useCallback(
    (document: VaultDocument): boolean =>
      document.userType.toLowerCase() === actorType && Number(document.userId) === actorId,
    [actorId, actorType],
  );

  const openUploadModal = useCallback((): void => {
    if (documentTypes.length === 0) {
      showGlobalToast('Document types are not available right now');
      return;
    }
    setSelectedDocumentTypeId(String(documentTypes[0]?.id ?? ''));
    setUploadModalVisible(true);
  }, [documentTypes]);

  const closeUploadModal = useCallback((): void => {
    setUploadModalVisible(false);
  }, []);

  const openShareModal = useCallback((document: VaultDocument): void => {
    setShareDocumentId(String(document.id));
    setShareTargetUserId('');
    setShareModalVisible(true);
  }, []);

  const closeShareModal = useCallback((): void => {
    setShareModalVisible(false);
    setShareDocumentId('');
    setShareTargetUserId('');
  }, []);

  const uploadFromSource = useCallback(
    async (source: VaultImagePickerSource): Promise<void> => {
      const docTypeId = Number(selectedDocumentTypeId);
      if (!Number.isFinite(docTypeId) || docTypeId <= 0) {
        showGlobalToast('Select a document type');
        return;
      }

      const pickerResult = await launchVaultImagePicker(source);
      if (pickerResult.errorMessage != null) {
        showGlobalToast({ variant: 'error', message: pickerResult.errorMessage });
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

      const selectedType = documentTypes.find((dt) => dt.id === docTypeId);
      const label = selectedType?.docName ?? 'Document';
      const ordinal = documents.filter((d) => d.documentTypeId === docTypeId).length + 1;
      const mimeType = getVaultAssetMimeType(asset);
      const originalName = asset.fileName?.trim() || `upload_${Date.now()}.jpg`;
      const uploadFilename = buildVaultUploadFilename({
        requirementLabel: label,
        ordinal,
        personDisplayName: personNameForUpload,
        originalFilename: originalName,
        mimeType,
      });
      const file = assetToMultipartFile(asset, uploadFilename, mimeType);

      if (file.uri.length === 0) {
        showGlobalToast('Could not read the selected file. Please try again.');
        return;
      }
      if (Platform.OS === 'android' && file.uri.startsWith('content://')) {
        showGlobalToast('Could not access this file. Try the camera or another photo.');
        return;
      }

      setIsBusy(true);
      try {
        await uploadVaultDocument({ documentTypeId: docTypeId, file }).unwrap();
        setUploadModalVisible(false);
        showGlobalToast('Document uploaded');
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Upload failed'));
      } finally {
        setIsBusy(false);
      }
    },
    [
      documentTypes,
      documents,
      personNameForUpload,
      selectedDocumentTypeId,
      uploadVaultDocument,
    ],
  );

  const submitShare = useCallback(async (): Promise<void> => {
    const userDocumentId = Number(shareDocumentId);
    const targetUserId = Number(shareTargetUserId);
    if (!Number.isFinite(userDocumentId) || userDocumentId <= 0) {
      showGlobalToast('Select a document to share');
      return;
    }
    if (!Number.isFinite(targetUserId) || targetUserId <= 0) {
      showGlobalToast('Select a consultant first');
      return;
    }

    setIsBusy(true);
    try {
      await createVaultDocumentShare({
        userDocumentId,
        targetUserId,
        targetUserType: 'consultant',
      }).unwrap();
      closeShareModal();
      showGlobalToast('Document shared');
    } catch (err: unknown) {
      showGlobalToast(getApiErrorMessage(err, 'Share failed'));
    } finally {
      setIsBusy(false);
    }
  }, [closeShareModal, createVaultDocumentShare, shareDocumentId, shareTargetUserId]);

  const handleDeleteDocument = useCallback(
    async (documentId: number): Promise<void> => {
      setIsBusy(true);
      try {
        await deleteVaultDocument(documentId).unwrap();
        showGlobalToast('Document deleted');
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Delete failed'));
      } finally {
        setIsBusy(false);
      }
    },
    [deleteVaultDocument],
  );

  const confirmDeleteDocument = useCallback(
    (document: VaultDocument): void => {
      Alert.alert(
        'Delete document?',
        'This will remove the file from your vault.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => void handleDeleteDocument(document.id),
          },
        ],
      );
    },
    [handleDeleteDocument],
  );

  const removeShare = useCallback(
    async (shareId: number): Promise<void> => {
      setIsBusy(true);
      try {
        await deleteVaultDocumentShare(shareId).unwrap();
        showGlobalToast('Share removed');
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Unshare failed'));
      } finally {
        setIsBusy(false);
      }
    },
    [deleteVaultDocumentShare],
  );

  const openDocumentActions = useCallback(
    (document: VaultDocument): void => {
      if (!isOwnDocument(document)) {
        return;
      }
      Alert.alert('Document', undefined, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => openShareModal(document) },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDeleteDocument(document),
        },
      ]);
    },
    [confirmDeleteDocument, isOwnDocument, openShareModal],
  );

  return {
    isLoading,
    isRefreshing,
    isBusy,
    errorMessage,
    documentCount: documents.length,
    sentShareCount: shares.sent.length,
    receivedShareCount: shares.received.length,
    groupedDocuments,
    sentShares: shares.sent,
    receivedShares: shares.received,
    documentTypes,
    shareTargetOptions,
    uploadModalVisible,
    shareModalVisible,
    selectedDocumentTypeId,
    shareDocumentId,
    shareTargetUserId,
    shareDocumentPreview,
    openUploadModal,
    closeUploadModal,
    setSelectedDocumentTypeId,
    openShareModal,
    closeShareModal,
    setShareTargetUserId,
    refresh,
    uploadFromSource,
    submitShare,
    confirmDeleteDocument,
    removeShare,
    isOwnDocument,
    openDocumentActions,
  };
}
