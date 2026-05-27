import { InteractionManager, PermissionsAndroid, Platform } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type CameraOptions,
  type ImageLibraryOptions,
  type ImagePickerResponse,
} from 'react-native-image-picker';

export type ProfileImagePickerSource = 'camera' | 'library';

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_PROFILE_MIME = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const CAMERA_PRESENT_DELAY_MS = Platform.OS === 'ios' ? 450 : 200;

const CAMERA_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  quality: 0.85,
  maxWidth: 1600,
  maxHeight: 1600,
  saveToPhotos: false,
  cameraType: 'front',
  presentationStyle: 'fullScreen',
};

const LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.85,
  maxWidth: 1600,
  maxHeight: 1600,
  selectionLimit: 1,
  assetRepresentationMode: 'compatible',
};

export interface ProfileImagePickResult {
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

function validateProfileAsset(asset: Asset): string | null {
  if (asset.uri == null || asset.uri.length === 0) {
    return 'No image selected';
  }

  const mime = normalizeMimeType(asset.type);
  if (!ALLOWED_PROFILE_MIME.has(mime)) {
    return 'Use JPEG, PNG, GIF, or WebP image';
  }

  const size = asset.fileSize ?? 0;
  if (size > MAX_PROFILE_IMAGE_BYTES) {
    return 'Image must be 5MB or smaller';
  }

  return null;
}

function assetFromResponse(response: ImagePickerResponse): ProfileImagePickResult {
  const pickerError = pickerErrorMessage(response);
  if (pickerError != null) {
    return { asset: null, errorMessage: pickerError };
  }

  const asset = response.assets?.[0];
  if (asset == null) {
    return { asset: null, errorMessage: null };
  }

  const validationError = validateProfileAsset(asset);
  if (validationError != null) {
    return { asset: null, errorMessage: validationError };
  }

  return { asset, errorMessage: null };
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
    message: 'Allow camera access to take your profile photo.',
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

async function openCamera(): Promise<ProfileImagePickResult> {
  const permitted = await requestAndroidCameraPermission();
  if (!permitted) {
    return {
      asset: null,
      errorMessage: 'Camera permission is required to take a photo.',
    };
  }

  await waitForUiReady();
  const response = await launchCamera(CAMERA_OPTIONS);
  return assetFromResponse(response);
}

async function openLibrary(): Promise<ProfileImagePickResult> {
  await waitForUiReady();
  const response = await launchImageLibrary(LIBRARY_OPTIONS);
  return assetFromResponse(response);
}

export async function pickProfileImageFromSource(
  source: ProfileImagePickerSource,
): Promise<ProfileImagePickResult> {
  if (source === 'camera') {
    return openCamera();
  }
  return openLibrary();
}

/** @deprecated Prefer pickProfileImageFromSource('library') */
export async function pickProfileImageFromLibrary(): Promise<ProfileImagePickResult> {
  return pickProfileImageFromSource('library');
}
