import { AppState, type AppStateStatus, NativeModules, Platform } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

interface CallLockScreenNative {
  isDeviceLocked: () => Promise<boolean>;
}

function getNativeModule(): CallLockScreenNative | null {
  if (Platform.OS !== 'android') {
    return null;
  }
  const mod = NativeModules.CallAndroidPermissions as CallLockScreenNative | undefined;
  if (mod == null || typeof mod.isDeviceLocked !== 'function') {
    return null;
  }
  return mod;
}

/**
 * Tracks whether the Android keyguard is locked so call UI can block app browsing.
 * Re-checks on AppState changes (unlock / re-lock).
 */
export function useIsDeviceLocked(): boolean {
  const [locked, setLocked] = useState(false);

  const refresh = useCallback((): void => {
    const native = getNativeModule();
    if (native == null) {
      setLocked(false);
      return;
    }
    void native
      .isDeviceLocked()
      .then(setLocked)
      .catch(() => {
        setLocked(false);
      });
  }, []);

  useEffect(() => {
    refresh();
    const onChange = (next: AppStateStatus): void => {
      if (next === 'active' || next === 'background') {
        refresh();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    const interval = setInterval(refresh, 2000);
    return () => {
      sub.remove();
      clearInterval(interval);
    };
  }, [refresh]);

  return locked;
}
