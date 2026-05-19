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
    message: 'Allow microphone access to speak during voice calls.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
}
