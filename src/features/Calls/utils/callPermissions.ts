import { PermissionsAndroid, Platform } from 'react-native';

export async function ensureCallMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
  const alreadyGranted = await PermissionsAndroid.check(permission);
  if (alreadyGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(permission, {
    title: 'Microphone access',
    message: 'Allow microphone access to speak during calls.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function ensureCallCameraPermission(): Promise<boolean> {
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
    message: 'Allow camera access for video calls.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function ensureCallPermissions(callType: 'voice' | 'video'): Promise<{
  microphone: boolean;
  camera: boolean;
}> {
  const microphone = await ensureCallMicrophonePermission();
  if (!microphone) {
    return { microphone: false, camera: false };
  }
  if (callType !== 'video') {
    return { microphone: true, camera: true };
  }
  const camera = await ensureCallCameraPermission();
  return { microphone: true, camera };
}
