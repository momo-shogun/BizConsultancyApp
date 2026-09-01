import * as Application from 'expo-application';

/**
 * Human-readable app version from native metadata:
 * iOS `CFBundleShortVersionString`, Android `versionName`.
 */
export function getNativeAppVersion(): string {
  const version = Application.nativeApplicationVersion;
  if (version != null && version.trim().length > 0) {
    return version.trim();
  }
  return '—';
}
