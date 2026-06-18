import { InteractionManager, PermissionsAndroid, Platform } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type CameraOptions,
  type ImageLibraryOptions,
  type ImagePickerResponse,
} from 'react-native-image-picker';

export type VaultImagePickerSource = 'camera' | 'library';

const MAX_VAULT_FILE_BYTES = 10 * 1024 * 1024;

const ALLOWED_VAULT_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

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

export interface VaultPickerResult {
  asset: Asset | null;
  errorMessage: string | null;
}

function normalizeMimeType(raw: string | undefined): string {
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

function assetFromResponse(response: ImagePickerResponse): Asset | null {
  const error = pickerErrorMessage(response);
  if (error != null) {
    return null;
  }
  const asset = response.assets?.[0];
  if (asset?.uri == null || asset.uri.length === 0) {
    return null;
  }
  return asset;
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
      asset: null,
      errorMessage: 'Camera permission is required to take a photo.',
    };
  }

  await waitForUiReady();

  const response = await launchCamera(CAMERA_OPTIONS);
  const errorMessage = pickerErrorMessage(response);
  if (errorMessage != null) {
    return { asset: null, errorMessage };
  }

  return { asset: assetFromResponse(response), errorMessage: null };
}

async function openLibrary(): Promise<VaultPickerResult> {
  await waitForUiReady();

  const response = await launchImageLibrary(LIBRARY_OPTIONS);
  const errorMessage = pickerErrorMessage(response);
  if (errorMessage != null) {
    return { asset: null, errorMessage };
  }

  return { asset: assetFromResponse(response), errorMessage: null };
}

export async function launchVaultImagePicker(
  source: VaultImagePickerSource,
): Promise<VaultPickerResult> {
  if (source === 'camera') {
    return openCamera();
  }
  return openLibrary();
}

export function validateVaultPickerAsset(asset: Asset): string | null {
  const fileSize = asset.fileSize ?? 0;
  if (fileSize > MAX_VAULT_FILE_BYTES) {
    return 'File too large. Maximum 10MB.';
  }

  const mimeType = normalizeMimeType(asset.type);
  if (BLOCKED_VAULT_MIME.has(mimeType)) {
    return 'HEIC format is not supported. Please pick a JPG or PNG photo.';
  }
  if (!ALLOWED_VAULT_MIME.has(mimeType)) {
    return 'Invalid file type. Use JPG/PNG/WEBP.';
  }

  return null;
}

export function getVaultAssetMimeType(asset: Asset): string {
  return normalizeMimeType(asset.type);
}
