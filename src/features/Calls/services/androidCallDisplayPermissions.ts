import { Linking, NativeModules, Platform } from 'react-native';
import notifee from '@notifee/react-native';
import MMKVStorage from 'react-native-mmkv-storage';

const FSI_PROMPT_DISMISSED_KEY = 'calls.android_fsi_prompt_dismissed';
const BATTERY_PROMPT_DISMISSED_KEY = 'calls.android_battery_prompt_dismissed';

interface CallAndroidPermissionsNative {
  canUseFullScreenIntent: () => Promise<boolean>;
  openFullScreenIntentSettings: () => Promise<void>;
}

function getNativeModule(): CallAndroidPermissionsNative | null {
  const mod = NativeModules.CallAndroidPermissions as CallAndroidPermissionsNative | undefined;
  if (mod == null || typeof mod.canUseFullScreenIntent !== 'function') {
    return null;
  }
  return mod;
}

function getMmkv(): ReturnType<MMKVStorage.Loader['initialize']> {
  return new MMKVStorage.Loader().initialize();
}

export function wasFullScreenIntentPromptDismissed(): boolean {
  try {
    return getMmkv().getString(FSI_PROMPT_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function markFullScreenIntentPromptDismissed(): void {
  try {
    void getMmkv().setStringAsync(FSI_PROMPT_DISMISSED_KEY, '1');
  } catch {
    // ignore
  }
}

export function wasBatteryOptimizationPromptDismissed(): boolean {
  try {
    return getMmkv().getString(BATTERY_PROMPT_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function markBatteryOptimizationPromptDismissed(): void {
  try {
    void getMmkv().setStringAsync(BATTERY_PROMPT_DISMISSED_KEY, '1');
  } catch {
    // ignore
  }
}

/** Android 14+: whether the OS allows full-screen incoming-call intents. Pre-34 → true. */
export async function canUseFullScreenIntent(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  if (typeof Platform.Version === 'number' && Platform.Version < 34) {
    return true;
  }
  const native = getNativeModule();
  if (native == null) {
    return true;
  }
  try {
    return await native.canUseFullScreenIntent();
  } catch {
    return true;
  }
}

export async function openFullScreenIntentSettings(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  const native = getNativeModule();
  if (native != null) {
    try {
      await native.openFullScreenIntentSettings();
      return;
    } catch {
      // fall through
    }
  }
  await Linking.openSettings();
}

export async function isBatteryOptimizationRestrictingCalls(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }
  try {
    return await notifee.isBatteryOptimizationEnabled();
  } catch {
    return false;
  }
}

export async function openBatteryOptimizationSettings(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    await notifee.openBatteryOptimizationSettings();
  } catch {
    await Linking.openSettings();
  }
}

export type AndroidCallDisplayPrompt = 'full_screen_intent' | 'battery_optimization' | null;

/**
 * One-time prompts for killed-state incoming reliability on Android 14+.
 * Prefer FSI first; battery exemption is secondary.
 */
export async function getPendingAndroidCallDisplayPrompt(): Promise<AndroidCallDisplayPrompt> {
  if (Platform.OS !== 'android') {
    return null;
  }
  const fsiOk = await canUseFullScreenIntent();
  if (!fsiOk && !wasFullScreenIntentPromptDismissed()) {
    return 'full_screen_intent';
  }
  const batteryRestricted = await isBatteryOptimizationRestrictingCalls();
  if (batteryRestricted && !wasBatteryOptimizationPromptDismissed()) {
    return 'battery_optimization';
  }
  return null;
}
