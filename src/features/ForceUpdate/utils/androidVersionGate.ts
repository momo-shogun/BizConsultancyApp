import { Platform } from 'react-native';
import * as Application from 'expo-application';

/**
 * Android `versionCode` from the installed build.
 * Returns null on iOS or when native build metadata is unavailable.
 */
export function readLocalAndroidVersionCode(): number | null {
  if (Platform.OS !== 'android') {
    return null;
  }
  const raw = Application.nativeBuildVersion;
  if (raw == null || String(raw).trim().length === 0) {
    return null;
  }
  const parsed = Number.parseInt(String(raw), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

/** True when local build is below the admin floor. `minVersionCode <= 0` disables force update. */
export function shouldForceAndroidUpdate(
  localVersionCode: number | null,
  minVersionCode: number,
): boolean {
  if (minVersionCode <= 0) {
    return false;
  }
  if (localVersionCode == null) {
    return false;
  }
  return localVersionCode < minVersionCode;
}
