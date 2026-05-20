import {
  InteractionManager,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const MIC_PERMISSION = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;

const PERMISSION_RATIONALE = {
  title: 'Microphone access',
  message: 'Biz AI needs your microphone so you can ask questions by voice.',
  buttonPositive: 'Allow',
  buttonNegative: 'Deny',
} as const;

function waitForActivityReady(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, Platform.OS === 'android' ? 280 : 0);
      });
    });
  });
}

/** Check without showing a dialog (safe when Activity may be unavailable). */
export async function hasBizAIMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  try {
    return await PermissionsAndroid.check(MIC_PERMISSION);
  } catch {
    return false;
  }
}

/** Request mic permission when Activity is ready; shows system dialog if needed. */
export async function ensureBizAIMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    if (await hasBizAIMicrophonePermission()) {
      return true;
    }

    await waitForActivityReady();

    const result = await PermissionsAndroid.request(MIC_PERMISSION, PERMISSION_RATIONALE);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

export async function openBizAIAppSettings(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch {
    // User can open settings manually.
  }
}
