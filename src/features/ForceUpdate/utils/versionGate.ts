import { Platform } from 'react-native';
import * as Application from 'expo-application';

/**
 * Native build number: Android `versionCode` / iOS `CFBundleVersion`.
 * Returns null when metadata is unavailable.
 */
export function readLocalBuildNumber(): number | null {
  const raw = Application.nativeBuildVersion;
  if (raw == null || String(raw).trim().length === 0) {
    return null;
  }
  const parsed = Number.parseInt(String(raw), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

/** True when local build is below the admin floor. `minBuildNumber <= 0` disables force update. */
export function shouldForceUpdate(
  localBuildNumber: number | null,
  minBuildNumber: number,
): boolean {
  if (minBuildNumber <= 0) {
    return false;
  }
  if (localBuildNumber == null) {
    return false;
  }
  return localBuildNumber < minBuildNumber;
}

export function platformMinBuildNumber(policy: {
  androidMinVersionCode: number;
  iosMinVersionCode: number;
}): number {
  if (Platform.OS === 'ios') {
    return policy.iosMinVersionCode;
  }
  if (Platform.OS === 'android') {
    return policy.androidMinVersionCode;
  }
  return 0;
}
