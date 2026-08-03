import { NativeModules, Platform } from 'react-native';

interface CallLockScreenNative {
  isDeviceLocked: () => Promise<boolean>;
  setCallLockOverlay: (enabled: boolean) => Promise<void>;
  leaveCallUiIfLocked: () => Promise<void>;
}

function getNativeModule(): CallLockScreenNative | null {
  if (Platform.OS !== 'android') {
    return null;
  }
  const mod = NativeModules.CallAndroidPermissions as CallLockScreenNative | undefined;
  if (
    mod == null ||
    typeof mod.isDeviceLocked !== 'function' ||
    typeof mod.setCallLockOverlay !== 'function' ||
    typeof mod.leaveCallUiIfLocked !== 'function'
  ) {
    return null;
  }
  return mod;
}

/** True when Android keyguard is locked. iOS → false (CallKit owns lock UX). */
export async function isDeviceLocked(): Promise<boolean> {
  const native = getNativeModule();
  if (native == null) {
    return false;
  }
  try {
    return await native.isDeviceLocked();
  } catch {
    return false;
  }
}

/**
 * Show MainActivity over the lock screen for call UI only.
 * Call when IncomingCall / InCall / OutgoingCall is active.
 */
export function enableCallLockOverlay(): void {
  const native = getNativeModule();
  if (native == null) {
    return;
  }
  void native.setCallLockOverlay(true).catch(() => {
    // ignore
  });
}

/**
 * End of call: clear lock overlay and, if still locked, hide the app
 * so the user does not land in the full shell without unlocking.
 */
export function leaveCallUiIfLocked(): void {
  const native = getNativeModule();
  if (native == null) {
    return;
  }
  void native.leaveCallUiIfLocked().catch(() => {
    // ignore
  });
}
