import { InteractionManager, PermissionsAndroid, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type CameraOptions,
  type ImageLibraryOptions,
  type ImagePickerResponse,
} from 'react-native-image-picker';

import type { MultipartFilePayload } from '@/services/api/multipartFetch';

export type VaultImagePickerSource = 'camera' | 'library' | 'files';

const MAX_VAULT_FILE_BYTES = 10 * 1024 * 1024;

const ALLOWED_VAULT_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const BLOCKED_VAULT_MIME = new Set(['image/heic', 'image/heif']);

/** Delay so the upload dialog Modal can dismiss before presenting camera (iOS). */
const CAMERA_PRESENT_DELAY_MS = Platform.OS === 'ios' ? 450 : 200;

const CAMERA_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  quality: 0.9,
  maxWidth: 2048,
  maxHeight: 2048,
  saveToPhotos: false,
  cameraType: 'back',
  presentationStyle: 'fullScreen',
  includeExtra: true,
};

const LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.9,
  maxWidth: 2048,
  maxHeight: 2048,
  selectionLimit: 1,
  assetRepresentationMode: 'compatible',
};

export interface VaultPickedFile {
  uri: string;
  fileName: string | null;
  fileSize: number | null;
  type: string | null;
}

export interface VaultPickerResult {
  file: VaultPickedFile | null;
  /** Compatibility for callers that still expect image-picker `Asset`. */
  asset: Asset | null;
  errorMessage: string | null;
}

function toAssetCompat(file: VaultPickedFile | null): Asset | null {
  if (file == null) {
    return null;
  }
  return {
    uri: file.uri,
    fileName: file.fileName ?? undefined,
    fileSize: file.fileSize ?? undefined,
    type: file.type ?? undefined,
  };
}

function normalizeMimeType(raw: string | undefined | null): string {
  const mime = (raw ?? 'image/jpeg').toLowerCase();
  if (mime === 'image/jpg') {
    return 'image/jpeg';
  }
  return mime;
}

function pickerErrorMessage(response: ImagePickerResponse): string | null {
  if (response.didCancel) {
    return null;
  }
  if (response.errorMessage != null && response.errorMessage.trim().length > 0) {
    return response.errorMessage.trim();
  }
  if (response.errorCode === 'permission') {
    return 'Camera permission denied. Allow camera access in Settings and try again.';
  }
  if (response.errorCode === 'camera_unavailable') {
    return 'Camera is not available on this device.';
  }
  if (response.errorCode != null) {
    return 'Could not open camera. Please try again.';
  }
  return null;
}

function fileFromImageAsset(asset: Asset | undefined): VaultPickedFile | null {
  if (asset?.uri == null || asset.uri.length === 0) {
    return null;
  }
  return {
    uri: asset.uri,
    fileName: asset.fileName ?? null,
    fileSize: asset.fileSize ?? null,
    type: asset.type ?? null,
  };
}

async function requestAndroidCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
  const alreadyGranted = await PermissionsAndroid.check(permission);
  if (alreadyGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(permission, {
    title: 'Camera access',
    message: 'Allow camera access to take photos for your document upload.',
    buttonPositive: 'Allow',
    buttonNegative: 'Cancel',
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

function waitForUiReady(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(resolve, CAMERA_PRESENT_DELAY_MS);
    });
  });
}

async function openCamera(): Promise<VaultPickerResult> {
  const permitted = await requestAndroidCameraPermission();
  if (!permitted) {
    return {
      file: null,
      asset: null,
      errorMessage: 'Camera permission is required to take a photo.',
    };
  }

  await waitForUiReady();

  const response = await launchCamera(CAMERA_OPTIONS);
  const errorMessage = pickerErrorMessage(response);
  if (errorMessage != null) {
    return { file: null, asset: null, errorMessage };
  }
  if (response.didCancel) {
    return { file: null, asset: null, errorMessage: null };
  }

  const file = fileFromImageAsset(response.assets?.[0]);
  return { file, asset: toAssetCompat(file), errorMessage: null };
}

async function openLibrary(): Promise<VaultPickerResult> {
  await waitForUiReady();

  const response = await launchImageLibrary(LIBRARY_OPTIONS);
  const errorMessage = pickerErrorMessage(response);
  if (errorMessage != null) {
    return { file: null, asset: null, errorMessage };
  }
  if (response.didCancel) {
    return { file: null, asset: null, errorMessage: null };
  }

  const file = fileFromImageAsset(response.assets?.[0]);
  return { file, asset: toAssetCompat(file), errorMessage: null };
}

async function openFiles(): Promise<VaultPickerResult> {
  await waitForUiReady();

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      return { file: null, asset: null, errorMessage: null };
    }

    const picked = result.assets[0];
    if (picked?.uri == null || picked.uri.length === 0) {
      return {
        file: null,
        asset: null,
        errorMessage: 'Could not read the selected file.',
      };
    }

    const file: VaultPickedFile = {
      uri: picked.uri,
      fileName: picked.name ?? null,
      fileSize: picked.size ?? null,
      type: picked.mimeType ?? null,
    };
    return { file, asset: toAssetCompat(file), errorMessage: null };
  } catch {
    return {
      file: null,
      asset: null,
      errorMessage: 'Could not open the file picker. Please try again.',
    };
  }
}

export async function launchVaultImagePicker(
  source: VaultImagePickerSource,
): Promise<VaultPickerResult> {
  if (source === 'camera') {
    return openCamera();
  }
  if (source === 'files') {
    return openFiles();
  }
  return openLibrary();
}

export function validateVaultPickerFile(file: VaultPickedFile): string | null {
  const fileSize = file.fileSize ?? 0;
  if (fileSize > MAX_VAULT_FILE_BYTES) {
    return 'File too large. Maximum 10MB.';
  }

  const mimeType = normalizeMimeType(file.type);
  if (BLOCKED_VAULT_MIME.has(mimeType)) {
    return 'HEIC format is not supported. Please pick a JPG, PNG, or PDF.';
  }
  if (!ALLOWED_VAULT_MIME.has(mimeType)) {
    return 'Invalid file type. Use JPG, PNG, WEBP, or PDF.';
  }

  return null;
}

/** @deprecated Prefer validateVaultPickerFile — kept for DocumentVault / ExpertVideos. */
export function validateVaultPickerAsset(asset: Asset): string | null {
  return validateVaultPickerFile({
    uri: asset.uri ?? '',
    fileName: asset.fileName ?? null,
    fileSize: asset.fileSize ?? null,
    type: asset.type ?? null,
  });
}

export function getVaultFileMimeType(file: VaultPickedFile): string {
  return normalizeMimeType(file.type);
}

/** @deprecated Prefer getVaultFileMimeType. */
export function getVaultAssetMimeType(asset: Asset): string {
  return normalizeMimeType(asset.type);
}

export function vaultPickedFileToMultipart(
  file: VaultPickedFile,
  uploadFilename: string,
  mimeType: string,
): MultipartFilePayload {
  const fallbackExt =
    mimeType === 'application/pdf'
      ? '.pdf'
      : mimeType === 'image/png'
        ? '.png'
        : mimeType === 'image/webp'
          ? '.webp'
          : '.jpg';
  const fallbackName = file.fileName?.trim() || `upload_${Date.now()}${fallbackExt}`;

  return {
    uri: file.uri,
    name: uploadFilename || fallbackName,
    type: mimeType,
  };
}
