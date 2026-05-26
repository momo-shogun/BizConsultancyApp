import { launchImageLibrary, type Asset, type ImageLibraryOptions } from 'react-native-image-picker';

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

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

export async function pickProfileImageFromLibrary(): Promise<ProfileImagePickResult> {
  const response = await launchImageLibrary(LIBRARY_OPTIONS);

  if (response.didCancel) {
    return { asset: null, errorMessage: null };
  }

  if (response.errorMessage != null && response.errorMessage.trim().length > 0) {
    return { asset: null, errorMessage: response.errorMessage.trim() };
  }

  const asset = response.assets?.[0];
  if (asset?.uri == null || asset.uri.length === 0) {
    return { asset: null, errorMessage: 'No image selected' };
  }

  const mime = normalizeMimeType(asset.type);
  const allowed = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
  if (!allowed.has(mime)) {
    return { asset: null, errorMessage: 'Use JPEG, PNG, GIF, or WebP image' };
  }

  const size = asset.fileSize ?? 0;
  if (size > MAX_PROFILE_IMAGE_BYTES) {
    return { asset: null, errorMessage: 'Image must be 5MB or smaller' };
  }

  return { asset, errorMessage: null };
}
